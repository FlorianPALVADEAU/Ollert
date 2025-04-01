import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { FrameSchema } from "@/TEMP.types";
import { z } from "zod";

export async function GET() {
  try {
    const { data, error } = await supabase.from("frames").select("*");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch frames" }, { status: 500 });
  }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation avec Zod
        const parsedBody = FrameSchema.parse(body);

        const { name, description, thumbnail, backgroundImage, collaborators } = parsedBody;

        // Insertion dans la table `frames`
        const { data, error } = await supabase
            .from("frames")
            .insert([
                {
                    name,
                    description,
                    thumbnail,
                    backgroundImage,
                    collaborators,
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
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
