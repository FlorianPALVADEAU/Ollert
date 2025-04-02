'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// Récupérer tous les tableaux accessibles au user
export async function getUserFrames() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: collaborators, error: collabError } = await supabase
    .from("frame_collaborators")
    .select("frame_id")
    .eq("user_id", user.id)

  if (collabError) throw new Error(collabError.message)

  const frameIds = collaborators.map(c => c.frame_id)

  const { data: frames, error } = await supabase
    .from("frames")
    .select("id, name, description, thumbnail, created_at")
    .in("id", frameIds)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return frames
}

// Créer un nouveau tableau, l'ajouter aux collaborateurs, et créer 3 colonnes de base
export async function createFrame(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null

  // 1. Créer le tableau
  const { data: frame, error: frameError } = await supabase
    .from("frames")
    .insert([{ name, description }])
    .select()
    .single()

  if (frameError) throw new Error(frameError.message)

  // 2. Ajouter le user comme collaborateur
  const { error: collabError } = await supabase
    .from("frame_collaborators")
    .insert([{ user_id: user.id, frame_id: frame.id }])

  if (collabError) throw new Error(collabError.message)

  // 3. Ajouter les 3 colonnes de base
  const defaultColumns = ["To Do", "In Progress", "Done"].map(name => ({
    name,
    frame_id: frame.id,
  }))

  const { error: columnsError } = await supabase
    .from("columns")
    .insert(defaultColumns)

  if (columnsError) throw new Error(columnsError.message)

  redirect("/")
}
