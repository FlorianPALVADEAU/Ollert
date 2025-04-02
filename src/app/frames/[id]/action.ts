'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// GET COLUMNS + TICKETS
export async function getFrameData(frameId: string) {
  const supabase = await createClient()

  const { data: columns, error: colError } = await supabase
    .from("columns")
    .select("id, name, created_at")
    .eq("frame_id", frameId)
    .order("created_at", { ascending: true })

  if (colError) throw new Error(colError.message)

  const columnIds = columns.map(c => c.id)

  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("id, title, description, column_id, position, status")
    .in("column_id", columnIds)
    .order("position", { ascending: true })

  if (ticketError) throw new Error(ticketError.message)

  return { columns, tickets }
}

// CREATE COLUMN
export async function createColumn(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get("name") as string
  const frameId = formData.get("frame_id") as string

  const { error } = await supabase
    .from("columns")
    .insert([{ name, frame_id: frameId }])

  if (error) throw new Error(error.message)

  redirect(`/frames/${frameId}`)
}

//UPDATE COLUMN
export async function updateColumn(formData: FormData) {
  const supabase = await createClient();
  const columnId = formData.get("column_id") as string;
  const name = formData.get("name") as string;

  // Récupération du frame_id pour la redirection après modification
  const { data: columnData, error: colError } = await supabase
    .from("columns")
    .select("frame_id")
    .eq("id", columnId)
    .single();

  if (colError) throw new Error(colError.message);

  const { error } = await supabase
    .from("columns")
    .update({ name })
    .eq('id', columnId);

  if (error) throw new Error(error.message);

  // Redirection vers le tableau
  redirect(`/frames/${columnData.frame_id}`);
}

// DELETE COLUMN
export async function deleteColumn(columnId: string) {
  const supabase = await createClient();

  // Récupération du frame_id pour la redirection après suppression
  const { data: columnData, error: colError } = await supabase
    .from("columns")
    .select("frame_id")
    .eq("id", columnId)
    .maybeSingle(); // Utilisation de maybeSingle pour gérer plusieurs ou aucune ligne retournée

  // Vérification si la colonne n'a pas été trouvée
  if (colError || !columnData) {
    throw new Error("La colonne spécifiée n'a pas été trouvée.");
  }

  // Suppression de la colonne
  const { error } = await supabase
    .from("columns")
    .delete()
    .eq('id', columnId);

  if (error) throw new Error(error.message);

  // Redirection vers le tableau
  redirect(`/frames/${columnData.frame_id}`);
}


// CREATE TICKET
export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  const columnId = formData.get("column_id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  const { data: last } = await supabase
    .from("tickets")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = last?.position ? last.position + 1 : 1

  const { error } = await supabase
    .from("tickets")
    .insert([{ title, description, column_id: columnId, position, status: "TODO" }])

  if (error) throw new Error(error.message)

  const { data } = await supabase
    .from("columns")
    .select("frame_id")
    .eq("id", columnId)
    .single()

  if (data?.frame_id) {
    redirect(`/frames/${data.frame_id}`)
  }
}

//MOVE TICKET
export async function moveTicket(ticketId: string, newColumnId: string, newPosition: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tickets')
    .update({
      column_id: newColumnId,
      position: newPosition,
    })
    .eq('id', ticketId);

  if (error) throw new Error(error.message);
}

//MOVE COLUMNS
export async function updateColumnOrder(frameId: string, columnIds: string[]) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('frames')
    .update({ column_order: columnIds })
    .eq('id', frameId);

  if (error) throw new Error(error.message);
}
