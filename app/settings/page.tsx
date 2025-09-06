"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrefs, updatePrefs } from "@/components/meal-utils"
import { useEffect, useState } from "react"

const diets = ["None", "Vegetarian", "Vegan", "Keto", "Gluten-Free"]

export default function SettingsPage() {
  const { data: prefs } = usePrefs()
  const [diet, setDiet] = useState("None")
  const [allergies, setAllergies] = useState<string[]>([])
  const [custom, setCustom] = useState("")
  const [calOn, setCalOn] = useState(false)
  const [freq, setFreq] = useState("On expiry day")
  const [time, setTime] = useState("09:00")

  useEffect(() => {
    if (prefs) {
      setDiet(prefs.diet)
      setAllergies(prefs.allergies || [])
      setCalOn(prefs.calendar?.enabled || false)
      setFreq(prefs.calendar?.frequency || "On expiry day")
      setTime(prefs.calendar?.time || "09:00")
    }
  }, [prefs])

  function toggleAllergy(a: string) {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }
  function addCustom() {
    if (!custom) return
    setAllergies((prev) => (prev.includes(custom) ? prev : [...prev, custom]))
    setCustom("")
  }
  function save() {
    updatePrefs({ diet, allergies, calendar: { enabled: calOn, frequency: freq, time } })
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold">User Preferences</h1>
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 font-semibold">Dietary Restrictions & Allergies</h2>
            <div className="mb-3">
              <Label>Dietary Preference</Label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
              >
                {diets.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <Label>Allergies</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["Nuts", "Dairy", "Eggs", "Soy", "Shellfish", "Gluten"].map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={allergies.includes(a)} onChange={() => toggleAllergy(a)} />
                    {a}
                  </label>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Add custom allergy" value={custom} onChange={(e) => setCustom(e.target.value)} />
                <Button
                  variant="secondary"
                  onClick={addCustom}
                  className="h-10 px-4 bg-secondary text-primary hover:bg-primary hover:text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Calendar Alerts</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={calOn} onChange={(e) => setCalOn(e.target.checked)} />
              Enable Google Calendar notifications
            </label>
            {calOn && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <Label>Frequency</Label>
                  <select
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                  >
                    {["On expiry day", "1 day before", "2 days before"].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Time of Day</Label>
                  <Input type="time" className="mt-1" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            )}
          </section>
          <Button className="h-12 px-7 bg-primary text-white hover:bg-primary/90" onClick={save}>
            Save Preferences
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
