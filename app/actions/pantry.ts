// "Next.js" supports server actions. Uses Supabase server client per guidelines.
"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

export async function removePantryItem(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !id) return
  await supabase.from("pantry").delete().eq("id", id).eq("user_id", user.id)
}
