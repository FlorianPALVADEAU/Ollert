import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = params?.id; // Assurez-vous que params est défini

    if (!id) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cars")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating car:", error); // Log pour débogage
    return NextResponse.json({ error: "Car not found or invalid data" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params?.id; // Assurez-vous que params est défini

    if (!id) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error); // Log pour débogage
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
}