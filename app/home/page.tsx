"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMealPlan, usePantry, useRecipes, missingIngredients, markCooked } from "@/components/meal-utils"
import { RecipeDialog } from "@/components/recipe-dialog"

function todayKey() {
  const day = new Date().getDay()
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return map[day]
}

export default function HomePage() {
  const { user } = useAuth()
  const { data: plan } = useMealPlan()
  const { data: pantry } = usePantry()
  const { data: recipes } = useRecipes()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10 flex-1">
          <h1 className="text-2xl font-bold">You are not logged in</h1>
          <p className="text-foreground/80">Please return to the homepage and login or use Preview Demo.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button size="lg">Back to Landing</Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const nameOrEmail = user.name || user.email || "Guest"
  const today = plan?.[todayKey()] || { breakfast: "", lunch: "", dinner: "" }

  const alerts = (pantry || [])
    .flatMap((i) => i.expiries.map((date) => ({ name: i.name, quantity: i.quantity, date })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1">
        {/* Greeting with user details */}
        <section className="mb-6 rounded-lg border p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">Welcome back, {nameOrEmail} 👋</h1>
            <p className="text-sm text-gray-700">Your personalized plan is built from your pantry and preferences.</p>
          </div>
        </section>

        {/* 1. Quick Weekly Summary */}
        <section className="mb-6 rounded-lg border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">This Week’s Plan Ready ✅</h2>
              <p className="text-sm text-foreground/80">Your meals are set based on your pantry.</p>
            </div>
            <Link href="/meal-plan">
<<<<<<< HEAD
              <Button className="h-12 px-7 bg-primary hover:bg-primary/90 text-white">View Full Meal Plan</Button>
=======
              <Button className="h-12 px-7 bg-primary hover:bg-primary/90">View Full Meal Plan</Button>
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
            </Link>
          </div>
        </section>

        {/* 2. Today’s Meals */}
        <section className="mb-6">
          <h3 className="mb-3 font-semibold">Today’s Meals</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(["breakfast", "lunch", "dinner"] as const).map((k) => {
              const dish = today[k]
              const miss = missingIngredients(recipes?.[dish], pantry || [])
              return (
                <div key={k} className="rounded-lg border p-4">
                  <div className="mb-1 text-sm text-gray-500 capitalize">{k}</div>
                  <div className="font-medium">{dish || "—"}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <RecipeDialog dish={dish} />
<<<<<<< HEAD
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markCooked(dish)}
                      className="text-primary border-primary hover:bg-primary hover:text-white"
                    >
=======
                    <Button size="sm" variant="outline" onClick={() => markCooked(dish)}>
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
                      Mark as Cooked
                    </Button>
                    {miss.length > 0 && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Needs items</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Expiry Alerts */}
        <section className="mb-6">
          <h3 className="mb-3 font-semibold">Expiry Alerts</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {alerts.map((a, idx) => (
              <li key={idx} className="rounded-lg border p-3">
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-amber-700">Expires: {a.date}</div>
              </li>
            ))}
            {alerts.length === 0 && <p className="text-sm text-gray-600">No urgent items.</p>}
          </ul>
        </section>

        {/* 4. Action Buttons */}
        <section className="flex flex-wrap gap-3">
          <Link href="/meal-plan">
<<<<<<< HEAD
            <Button size="lg" className="h-12 px-7 bg-primary text-white hover:bg-primary/90">
=======
            <Button size="lg" className="h-12 px-7">
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
              View Full Meal Plan
            </Button>
          </Link>
          <Link href="/shopping-list">
<<<<<<< HEAD
            <Button size="lg" className="h-12 px-7 bg-primary text-white hover:bg-primary/90">
=======
            <Button size="lg" variant="secondary" className="h-12 px-7">
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
              View Shopping List
            </Button>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
