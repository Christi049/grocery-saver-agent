"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

type Ingredient = { name: string; qty: number }
type Recipe = { name: string; ingredients: Ingredient[]; steps: string[] }

const DEMO_RECIPES: Recipe[] = [
  {
    name: "Veggie Omelette",
    ingredients: [
      { name: "Eggs", qty: 3 },
      { name: "Spinach", qty: 1 },
    ],
    steps: ["Beat eggs", "Saute spinach", "Cook omelette"],
  },
  {
    name: "Pasta Salad",
    ingredients: [
      { name: "Pasta", qty: 2 },
      { name: "Tomato", qty: 1 },
    ],
    steps: ["Boil pasta", "Chop tomato", "Mix and serve"],
  },
]

export async function generateWeeklyMealPlan() {
  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: pantry } = await supabase.from("pantry").select("item_name, quantity").eq("user_id", user.id)

  // Super-simple heuristic: pick first two demo recipes across the week
  const weekStart = new Date()
  for (let day = 0; day < 7; day++) {
    for (const meal of ["breakfast", "lunch", "dinner"] as const) {
      const recipe = DEMO_RECIPES[(day + (meal === "lunch" ? 1 : meal === "dinner" ? 2 : 0)) % DEMO_RECIPES.length]
      await supabase.from("meal_plan").insert({
        user_id: user.id,
        week_start: weekStart.toISOString().slice(0, 10),
        day,
        meal_type: meal,
        dish_name: recipe.name,
        recipe_steps: recipe.steps,
        ingredients: recipe.ingredients,
      })

      // Add missing ingredients to shopping list
      for (const ing of recipe.ingredients) {
        const onHand = (pantry ?? []).find((p) => p.item_name.toLowerCase() === ing.name.toLowerCase())
        if (!onHand || Number(onHand.quantity) < ing.qty) {
          await supabase.from("shopping_list").insert({
            user_id: user.id,
            item_name: ing.name,
            quantity: ing.qty - Number(onHand?.quantity ?? 0),
            purchased: false,
          })
        }
      }
    }
  }
}
