import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET() {
  try {
    const { data, error } = await supabase.from("cars").select("*");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brand, model, year } = body;

    if (!brand || !model || !year) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cars")
      .insert([{ brand, model, year }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
