import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TicketSchema } from "@/TEMP.types";
import { z } from "zod";

export async function GET() {
  try {
    const { data, error } = await supabase.from("tickets").select("*");
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
      const body = await request.json();

      // Validation des données avec Zod
      const parsedBody = TicketSchema.parse(body);

      const { title, description, status, assignees, dueDate, tags, thumbnail, position } = parsedBody;

      // Insertion du ticket validé dans la base de données
      const { data, error } = await supabase
          .from("tickets")
          .insert([
              {
                  title,
                  description,
                  status,
                  assignees,
                  dueDate,
                  tags,
                  thumbnail,
                  position,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
              }
          ]);

      if (error) throw error;

      return NextResponse.json(data, { status: 201 });
  } catch (error) {
      if (error instanceof z.ZodError) {
          return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}