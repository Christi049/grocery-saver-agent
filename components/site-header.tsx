"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, CalendarDays, ShoppingCart, Boxes, Settings } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meal-plan", label: "Meal Plan", icon: CalendarDays },
  { href: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
  { href: "/pantry", label: "Pantry", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const computedLinks = links.map((l) => {
    if (l.label === "Home") {
      return { ...l, href: user ? "/home" : "/" }
    }
    return l
  })

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <Link href={user ? "/home" : "/"} className="font-semibold text-gray-900">
          SaverCart
        </Link>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-2">
          {computedLinks.map((l) => {
            const Icon = l.icon
            const active = pathname === l.href || (l.href !== (user ? "/home" : "/") && pathname.startsWith(l.href))
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-sm ${
                  active ? "bg-accent/30 text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            )
          })}
          {user ? (
            <Button variant="ghost" className="ml-2" onClick={logout}>
              Logout
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
