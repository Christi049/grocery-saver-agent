"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import useSWR, { mutate as globalMutate } from "swr"

type Recipe = {
  name: string
  steps: string[]
  ingredients: { name: string; qty: number }[]
}

function getRecipes(): Record<string, Recipe> {
  try {
    return JSON.parse(localStorage.getItem("sc_recipes") || "{}")
  } catch {
    return {}
  }
}
function getPantry(): { name: string; quantity: number; expiries: string[] }[] {
  try {
    return JSON.parse(localStorage.getItem("sc_pantry") || "[]")
  } catch {
    return []
  }
}
function setPantry(pantry: any) {
  localStorage.setItem("sc_pantry", JSON.stringify(pantry))
}

export function RecipeDialog({ dish, trigger }: { dish: string; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data: recipes } = useSWR("sc_recipes", () => Promise.resolve(getRecipes()))
  const recipe = recipes?.[dish]

  function finishCooking() {
    if (!recipe) return
    const pantry = getPantry()
    const updated = pantry.map((p) => ({ ...p }))
    for (const ing of recipe.ingredients) {
      const item = updated.find((p) => p.name.toLowerCase() === ing.name.toLowerCase())
      if (item) item.quantity = Math.max(0, item.quantity - ing.qty)
    }
    setPantry(updated)
    globalMutate("sc_pantry")
    setOpen(false)
  }

  if (!dish) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            View Recipe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{recipe?.name || dish}</DialogTitle>
        </DialogHeader>
        {recipe ? (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Ingredients</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {recipe.ingredients.map((i) => (
                  <li key={i.name}>
                    {i.name} × {i.qty}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Steps</h4>
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                {recipe.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={finishCooking}>
              Finished Cooking – Update Pantry
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-700">No recipe details available.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
