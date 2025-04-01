import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { FrameSchema } from "@/TEMP.types";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Récupérer un frame avec un ID spécifique
        const { data, error } = await supabase
            .from("frames")
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

        // Validation avec Zod
        const parsedBody = FrameSchema.parse(body);

        // Mise à jour du frame spécifique
        const { data, error } = await supabase
            .from("frames")
            .update(parsedBody)
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE({ params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Suppression du frame
        const { error } = await supabase
            .from("frames")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ message: "Frame deleted successfully" }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
