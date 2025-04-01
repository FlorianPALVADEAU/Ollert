import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { UserSchema } from "@/TEMP.types";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Validation avec Zod
        const parsedId = z.string().uuid().parse(id);

        // Récupération de l'utilisateur par ID
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", parsedId)
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: (error as z.ZodError).errors }, { status: 400 });
        }
        return NextResponse.json({ error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation avec Zod
        const parsedBody = UserSchema.parse(body);

        const { name, email } = parsedBody;

        // Insertion dans la table `users`
        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    name,
                    email,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ]);

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: (error as z.ZodError).errors }, { status: 400 });
        }
        return NextResponse.json({ error: (error as Error).message || "Unknown error" }, { status: 500 });
    }
}
