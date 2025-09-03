"use client"
import useSWR, { mutate } from "swr"

export type PantryItem = { name: string; quantity: number; expiries: string[] }
export type Recipe = { name: string; steps: string[]; ingredients: { name: string; qty: number }[] }
export type DayMeals = { breakfast: string; lunch: string; dinner: string }
export type MealPlan = Record<string, DayMeals>

const get = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}
const set = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))

export function usePantry() {
  return useSWR<PantryItem[]>("sc_pantry", () => Promise.resolve(get("sc_pantry", [])))
}
export function useRecipes() {
  return useSWR<Record<string, Recipe>>("sc_recipes", () => Promise.resolve(get("sc_recipes", {})))
}
export function useMealPlan() {
  return useSWR<MealPlan>("sc_meal_plan", () => Promise.resolve(get("sc_meal_plan", {})))
}
export function useShopping() {
  return useSWR<{ name: string; quantity: number }[]>("sc_shopping", () => Promise.resolve(get("sc_shopping", [])))
}
export function usePrefs() {
  return useSWR<{ diet: string; allergies: string[]; calendar: { enabled: boolean; frequency: string; time: string } }>(
    "sc_prefs",
    () =>
      Promise.resolve(
        get("sc_prefs", {
          diet: "None",
          allergies: [],
          calendar: { enabled: false, frequency: "On expiry day", time: "09:00" },
        }),
      ),
  )
}

export function updatePantry(items: PantryItem[]) {
  set("sc_pantry", items)
  mutate("sc_pantry")
}
export function updateShopping(items: { name: string; quantity: number }[]) {
  set("sc_shopping", items)
  mutate("sc_shopping")
}
export function updateMealPlan(plan: MealPlan) {
  set("sc_meal_plan", plan)
  mutate("sc_meal_plan")
}
export function updatePrefs(prefs: any) {
  set("sc_prefs", prefs)
  mutate("sc_prefs")
}

export function missingIngredients(recipe: Recipe | undefined, pantry: PantryItem[]) {
  if (!recipe) return []
  const miss: { name: string; quantity: number }[] = []
  for (const ing of recipe.ingredients) {
    const stock = pantry.find((p) => p.name.toLowerCase() === ing.name.toLowerCase())
    const available = stock?.quantity || 0
    if (available < ing.qty) miss.push({ name: ing.name, quantity: ing.qty - available })
  }
  return miss
}

export function markCooked(dish: string) {
  const recipes = get<Record<string, Recipe>>("sc_recipes", {})
  const recipe = recipes[dish]
  if (!recipe) return
  const pantry = get<PantryItem[]>("sc_pantry", [])
  for (const ing of recipe.ingredients) {
    const item = pantry.find((p) => p.name.toLowerCase() === ing.name.toLowerCase())
    if (item) item.quantity = Math.max(0, item.quantity - ing.qty)
  }
  set("sc_pantry", pantry)
  mutate("sc_pantry")
}

export function addPurchasedToPantry(item: { name: string; quantity: number }) {
  const pantry = get<PantryItem[]>("sc_pantry", [])
  const found = pantry.find((p) => p.name.toLowerCase() === item.name.toLowerCase())
  if (found) found.quantity += item.quantity
  else pantry.push({ name: item.name, quantity: item.quantity, expiries: [] })
  set("sc_pantry", pantry)
  mutate("sc_pantry")
}
