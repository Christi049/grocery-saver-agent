"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  useMealPlan,
  usePantry,
  useRecipes,
  missingIngredients,
  markCooked,
  updateMealPlan,
} from "@/components/meal-utils"
import { RecipeDialog } from "@/components/recipe-dialog"
import { ShoppingCart } from "lucide-react"

const days: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"> = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

export default function MealPlanPage() {
  const { data: plan } = useMealPlan()
  const { data: pantry } = usePantry()
  const { data: recipes } = useRecipes()

  function swapDish(day: string, slot: "breakfast" | "lunch" | "dinner") {
    const keys = Object.keys(recipes || {})
    if (keys.length === 0 || !plan) return
    const current = plan[day][slot]
    const alternatives = keys.filter((k) => k !== current)
    const rand = alternatives[Math.floor(Math.random() * alternatives.length)]
    const newPlan = { ...plan, [day]: { ...plan[day], [slot]: rand } }
    updateMealPlan(newPlan)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1">
        <h1 className="mb-4 text-xl font-semibold">Weekly Meal Plan</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {days.map((d) => {
            const slots = (plan && plan[d]) || { breakfast: "", lunch: "", dinner: "" }
            return (
              <div key={d} className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">{d}</h3>
                {(["breakfast", "lunch", "dinner"] as const).map((slot) => {
                  const dish = slots[slot]
                  const miss = missingIngredients(recipes?.[dish], pantry || [])
                  return (
                    <div key={slot} className="mb-3 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-foreground/60 capitalize">{slot}</div>
                        {miss.length > 0 && (
                          <ShoppingCart className="h-4 w-4 text-primary" aria-label="Missing ingredients" />
                        )}
                      </div>
                      <div className="font-medium">{dish || "—"}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button onClick={() => markCooked(dish)} className="h-10 px-5 bg-primary hover:bg-primary/90">
                          Mark as Cooked
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 px-5 bg-transparent"
                          onClick={() => swapDish(d, slot)}
                        >
                          Swap Dish
                        </Button>
                        <RecipeDialog dish={dish} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
