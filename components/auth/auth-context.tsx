"use client"
import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

export type User = { id: string; email: string; name?: string; demo?: boolean }

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  loginDemo: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = "sc_users"
const USER_KEY = "sc_user"

function readUsers(): Record<string, User & { password: string }> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
function writeUsers(users: Record<string, User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
function readUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeUser(user: User | null) {
  if (!user) localStorage.removeItem(USER_KEY)
  else localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setUser(readUser())
    setLoading(false)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const users = readUsers()
        const key = email.toLowerCase()
        const found = users[key]
        if (!found || found.password !== password) throw new Error("Invalid email or password")
        const u: User = { id: found.id, email: found.email, name: found.name }
        writeUser(u)
        setUser(u)
        router.push("/home")
      },
      signup: async (email, password, name) => {
        const users = readUsers()
        const key = email.toLowerCase()
        if (users[key]) throw new Error("User already exists")
        const newUser: User & { password: string } = {
          id: crypto.randomUUID(),
          email: key,
          name: name || email.split("@")[0],
          password,
        }
        users[key] = newUser
        writeUsers(users)
        const u: User = { id: newUser.id, email: newUser.email, name: newUser.name }
        writeUser(u)
        setUser(u)
        router.push("/home")
      },
      loginDemo: async () => {
        const demo: User = { id: "demo-user", email: "demo@savecart.local", name: "Demo User", demo: true }
        writeUser(demo)
        setUser(demo)
        const seeded = localStorage.getItem("sc_demo_seeded")
        if (!seeded) {
          seedDemoData()
          localStorage.setItem("sc_demo_seeded", "1")
        }
        router.push("/home")
      },
      logout: () => {
        writeUser(null)
        setUser(null)
        router.push("/")
      },
    }),
    [user, router],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

// Demo datasets
type PantryItem = { name: string; quantity: number; expiries: string[] }
type Recipe = { name: string; steps: string[]; ingredients: { name: string; qty: number }[] }
type MealPlan = Record<string, { breakfast: string; lunch: string; dinner: string }>

function dateIn(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function seedDemoData() {
  const pantry: PantryItem[] = [
    { name: "Eggs", quantity: 6, expiries: [dateIn(3)] },
    { name: "Milk", quantity: 1, expiries: [dateIn(2)] },
    { name: "Chicken Breast", quantity: 2, expiries: [dateIn(4)] },
    { name: "Rice", quantity: 5, expiries: [dateIn(90)] },
    { name: "Spinach", quantity: 2, expiries: [dateIn(1)] },
    { name: "Tomatoes", quantity: 4, expiries: [dateIn(5)] },
  ]
  const recipes: Record<string, Recipe> = {
    "Veggie Omelette": {
      name: "Veggie Omelette",
      steps: ["Whisk eggs", "Saute spinach and tomatoes", "Add eggs and cook"],
      ingredients: [
        { name: "Eggs", qty: 2 },
        { name: "Spinach", qty: 1 },
        { name: "Tomatoes", qty: 1 },
      ],
    },
    "Grilled Chicken & Rice": {
      name: "Grilled Chicken & Rice",
      steps: ["Season chicken", "Grill chicken", "Cook rice", "Serve together"],
      ingredients: [
        { name: "Chicken Breast", qty: 1 },
        { name: "Rice", qty: 1 },
      ],
    },
    "Tomato Soup": {
      name: "Tomato Soup",
      steps: ["Chop tomatoes", "Simmer with spices", "Blend & serve"],
      ingredients: [{ name: "Tomatoes", qty: 2 }],
    },
    "Cereal & Milk": {
      name: "Cereal & Milk",
      steps: ["Pour cereal", "Add milk", "Enjoy"],
      ingredients: [{ name: "Milk", qty: 1 }],
    },
    "Spinach Salad": {
      name: "Spinach Salad",
      steps: ["Wash spinach", "Chop tomatoes", "Mix and serve"],
      ingredients: [
        { name: "Spinach", qty: 1 },
        { name: "Tomatoes", qty: 1 },
      ],
    },
  }
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const plan: MealPlan = Object.fromEntries(
    days.map((d, i) => [
      d,
      {
        breakfast: i % 2 === 0 ? "Veggie Omelette" : "Cereal & Milk",
        lunch: i % 3 === 0 ? "Spinach Salad" : "Tomato Soup",
        dinner: "Grilled Chicken & Rice",
      },
    ]),
  )
  const shoppingList = [
    { name: "Chicken Breast", quantity: 2 },
    { name: "Rice", quantity: 2 },
    { name: "Milk", quantity: 1 },
  ]
  localStorage.setItem("sc_pantry", JSON.stringify(pantry))
  localStorage.setItem("sc_recipes", JSON.stringify(recipes))
  localStorage.setItem("sc_meal_plan", JSON.stringify(plan))
  localStorage.setItem("sc_shopping", JSON.stringify(shoppingList))
  localStorage.setItem(
    "sc_prefs",
    JSON.stringify({
      diet: "None",
      allergies: [],
      calendar: { enabled: false, frequency: "On expiry day", time: "09:00" },
    }),
  )
}
