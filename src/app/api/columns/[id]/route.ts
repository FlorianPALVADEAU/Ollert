import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { data, error } = await supabase.from("columns").select("*").eq("id", id).single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Column not found" }, { status: 404 });
  }
}

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Column name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("columns")
      .update({
        name,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { error } = await supabase.from("columns").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Column deleted successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
