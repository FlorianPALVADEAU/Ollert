import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TicketSchema } from "@/TEMP.types";
import { z } from "zod";

export async function GET({ params }: { params: { id: string } }) {
  try {
      const { id } = params;

      // Récupérer la tâche avec un ID spécifique
      const { data, error } = await supabase
          .from("tickets")
          .select("*")
          .eq("id", id)
          .single();

      if (error) throw error;

      return NextResponse.json(data, { status: 200 });
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  try {
      const { id } = params;
      const body = await request.json();

      // Validation des données avec Zod
      const parsedBody = TicketSchema.parse(body);

      const { title, description, status, assignees, dueDate, tags, thumbnail, position } = parsedBody;

      // Mise à jour du ticket dans la base de données
      const { data, error } = await supabase
          .from("tickets")
          .update({
              title,
              description,
              status,
              assignees,
              dueDate,
              tags,
              thumbnail,
              position,
              updatedAt: new Date().toISOString(),
          })
          .eq("id", id);

      if (error) throw error;

      return NextResponse.json(data, { status: 200 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
      const { id } = params;

      // Suppression du ticket de la base de données
      const { error } = await supabase
          .from("tickets")
          .delete()
          .eq("id", id);

      if (error) throw error;

      return NextResponse.json({ message: "Ticket deleted successfully" }, { status: 200 });
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
