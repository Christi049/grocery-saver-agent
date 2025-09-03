"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

export async function purchaseItem(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !id) return

  const { data: item } = await supabase.from("shopping_list").select("*").eq("id", id).eq("user_id", user.id).single()
  if (!item) return

  // Mark purchased
  await supabase.from("shopping_list").update({ purchased: !item.purchased }).eq("id", id)

  // If transitioning to purchased, add to pantry
  if (!item.purchased) {
    await supabase.from("pantry").insert({
      user_id: user.id,
      item_name: item.item_name,
      quantity: item.quantity,
      expiry_date: null,
    })
  }
}
