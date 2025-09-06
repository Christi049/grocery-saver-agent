"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { useShopping, updateShopping, addPurchasedToPantry } from "@/components/meal-utils"

export default function ShoppingListPage() {
  const { data: items } = useShopping()

  function togglePurchased(idx: number) {
    if (!items) return
    const item = items[idx]
    addPurchasedToPantry(item)
    const newList = items.filter((_, i) => i !== idx)
    updateShopping(newList)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 flex-1">
        <h1 className="mb-4 text-xl font-semibold">Shopping List</h1>
        <ul className="space-y-3">
          {(items || []).map((i, idx) => (
            <li key={idx} className="flex items-center justify-between rounded-md border px-3 py-3">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-foreground/60">Qty: {i.quantity}</div>
              </div>
              <Button onClick={() => togglePurchased(idx)} className="h-10 px-5 bg-primary hover:bg-primary/90">
                Purchase
              </Button>
            </li>
          ))}
          {(items || []).length === 0 && <p className="text-sm text-foreground/70">No items needed.</p>}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
