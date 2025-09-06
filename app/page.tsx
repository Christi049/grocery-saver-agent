"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { LoginSignupDialog } from "@/components/auth/login-signup-dialog"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"
import Image from "next/image"
import { UtensilsCrossed, CalendarCheck2, BellRing } from "lucide-react" // icons for objectives

export default function LandingPage() {
  const { loginDemo, user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 flex-1">
        {/* Section 1: Hero - full viewport */}
        <section className="grid min-h-screen grid-cols-1 items-center gap-8 py-10 md:grid-cols-2 md:py-0">
          <div className="flex flex-col justify-center gap-5">
            <h1 className="text-pretty text-4xl font-bold sm:text-5xl">
              Save food. Save money. Plan smarter with SaverCart.
            </h1>
            <p className="text-foreground/80 leading-relaxed text-lg">
              SaverCart generates weekly meal plans from your pantry, prioritizing items by expiry and respecting your
              dietary needs. Cut waste, cut costs, and simplify daily meals.
            </p>
            <div className="flex flex-wrap items-center gap-4">
<<<<<<< HEAD
              <LoginSignupDialog mode="login" className="h-16 px-10 text-lg text-white" />
              <LoginSignupDialog mode="signup" className="h-16 px-10 text-lg text-white" />
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 bg-transparent text-primary border-primary hover:bg-primary hover:text-white"
                onClick={loginDemo}
              >
=======
              <LoginSignupDialog mode="login" className="h-16 px-10 text-lg" />
              <LoginSignupDialog mode="signup" className="h-16 px-10 text-lg" />
              <Button variant="outline" size="lg" className="h-16 px-10 bg-transparent" onClick={loginDemo}>
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
                Preview Demo
              </Button>
              {user && (
                <Link href="/home">
<<<<<<< HEAD
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-16 px-10 text-primary hover:bg-primary hover:text-white"
                  >
=======
                  <Button variant="ghost" size="lg" className="h-16 px-10">
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
                    Go to App
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-2">
            <Image
              src="/images/hero.jpg"
              alt="SaverCart grocery and meal planning preview"
              width={1200}
              height={900}
              className="h-auto w-full rounded-md"
              priority
            />
            <p className="mt-2 text-center text-xs text-foreground/60">Product preview</p>
          </div>
        </section>

        {/* Section 2: Objectives - full viewport with larger, centered cards */}
        <section className="min-h-screen flex items-center py-12">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border p-8 text-center">
              <UtensilsCrossed className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mb-2 text-xl font-semibold">Personalized Meal Planning</h3>
              <p className="text-base text-foreground/80">
                Considers your dietary restrictions, allergies, and preferences.
              </p>
            </div>
            <div className="rounded-xl border p-8 text-center">
              <CalendarCheck2 className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mb-2 text-xl font-semibold">Automated Meal Planning</h3>
              <p className="text-base text-foreground/80">
                Generates a weekly meal plan from your inventory, prioritizing items by expiry.
              </p>
            </div>
            <div className="rounded-xl border p-8 text-center">
              <BellRing className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mb-2 text-xl font-semibold">Expiry Date Alerts</h3>
              <p className="text-base text-foreground/80">
                Timely notifications the day an item is set to expire—preventing food from being forgotten and wasted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Reviews - full viewport, bigger cards and larger centered subheading */}
        <section className="min-h-screen flex flex-col justify-center py-12">
          <h3 className="mb-10 text-center text-3xl font-semibold sm:text-4xl">What people say</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <blockquote className="rounded-2xl border p-8 text-base text-foreground shadow-sm">
              “Cut my weekly waste in half. Planning is effortless now.”
              <div className="mt-4 text-sm text-foreground/60">— Jamie L.</div>
            </blockquote>
            <blockquote className="rounded-2xl border p-8 text-base text-foreground shadow-sm">
              “I love that it respects my allergies and uses what I already have.”
              <div className="mt-4 text-sm text-foreground/60">— Priya S.</div>
            </blockquote>
            <blockquote className="rounded-2xl border p-8 text-base text-foreground shadow-sm">
              “Expiry alerts saved so much food. It’s like a smart pantry.”
              <div className="mt-4 text-sm text-foreground/60">— Marco T.</div>
            </blockquote>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
