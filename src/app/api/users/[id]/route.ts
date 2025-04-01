import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { UserSchema } from "@/TEMP.types";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const { data, error } = await supabase
            .from("users")
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

        const parsedBody = UserSchema.parse(body);

        const { data, error } = await supabase
            .from("users")
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

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
