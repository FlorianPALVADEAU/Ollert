'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createColumn(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const frameId = formData.get("frame_id") as string

  const { error } = await supabase
    .from("columns")
    .insert([{ name, frame_id: frameId }])

  if (error) throw new Error(error.message)

  revalidatePath(`/frames/${frameId}`)
}

export async function createTicket(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const columnId = formData.get("column_id") as string

  // Trouver la dernière position
  const { data: lastTicket } = await supabase
    .from("tickets")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = lastTicket?.position ? lastTicket.position + 1 : 1

  const { error } = await supabase
    .from("tickets")
    .insert([{
        title,
        description,
        column_id: columnId,
        position,
        status: "TODO"
    }])


  if (error) throw new Error(error.message)

  // Recharger la page du board
  revalidatePath(`/frames`)
}

export async function getColumnsAndTickets(frameId: string) {
    const supabase = await createClient()
  
    const { data: columns, error: colErr } = await supabase
      .from("columns")
      .select("id, name")
      .eq("frame_id", frameId)
      .order("created_at", { ascending: true })
  
    if (colErr) throw new Error(colErr.message)
  
    const columnIds = columns.map(col => col.id)
  
    const { data: tickets, error: ticketErr } = await supabase
      .from("tickets")
      .select("id, title, description, column_id, position")
      .in("column_id", columnIds)
      .order("position", { ascending: true })
  
    if (ticketErr) throw new Error(ticketErr.message)
  
    return { columns, tickets }
  }