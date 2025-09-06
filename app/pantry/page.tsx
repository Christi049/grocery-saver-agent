"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePantry, updatePantry } from "@/components/meal-utils"
import { useState } from "react"

export default function PantryPage() {
  const { data: pantry } = usePantry()
  const [name, setName] = useState("")
  const [qty, setQty] = useState(1)
  const [exp, setExp] = useState("")

  function removeItem(target: string) {
    const items = [...(pantry || [])].filter((p) => p.name !== target)
    updatePantry(items)
  }

  function addItem() {
    if (!name || qty <= 0) return
    const items = [...(pantry || [])]
    const found = items.find((p) => p.name.toLowerCase() === name.toLowerCase())
    if (found) {
      found.quantity += qty
      if (exp) found.expiries.push(exp)
    } else {
      items.push({ name, quantity: qty, expiries: exp ? [exp] : [] })
    }
    updatePantry(items)
    setName("")
    setQty(1)
    setExp("")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 flex-1">
        <h1 className="mb-4 text-xl font-semibold">Pantry</h1>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <Input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number.parseInt(e.target.value || "1"))} />
          <Input type="date" value={exp} onChange={(e) => setExp(e.target.value)} />
<<<<<<< HEAD
          <Button
            onClick={addItem}
            className="h-10 px-4 bg-black text-white hover:bg-[#59705B] hover:text-white cursor-pointer"
          >
            Add Item
          </Button>
=======
          <Button onClick={addItem}>Add Item</Button>
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(pantry || []).map((p) => (
            <div key={p.name} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="text-sm text-foreground/70">Qty: {p.quantity}</div>
              </div>
              <div className="mt-2 text-sm text-foreground/80">
                Expiries: {p.expiries.length ? p.expiries.join(", ") : "—"}
              </div>
              <div className="mt-3">
<<<<<<< HEAD
                <Button variant="destructive" onClick={() => removeItem(p.name)} className="cursor-pointer">
=======
                <Button variant="destructive" onClick={() => removeItem(p.name)}>
>>>>>>> a37c6c975e999f32c50f6779983029e33bb37b94
                  Remove
                </Button>
              </div>
              <p className="mt-2 text-xs text-foreground/60">
                Manual adjust removed. Use cooking and purchasing to update.
              </p>
            </div>
          ))}
          {(pantry || []).length === 0 && <p className="text-sm text-foreground/70">No items in pantry.</p>}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
