import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { TicketAssigneeSchema } from "@/TEMP.types";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation avec Zod
        const parsedBody = TicketAssigneeSchema.parse(body);

        const { ticketId, userId } = parsedBody;

        // Insertion dans la table `ticket_assignees`
        const { data, error } = await supabase
            .from("ticket_assignees")
            .insert([
                { ticketId, userId }
            ]);

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: (error as z.ZodError).errors }, { status: 400 });
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { ticketId, userId } = await request.json();

        // Suppression de l'assignee pour un ticket
        const { error } = await supabase
            .from("ticket_assignees")
            .delete()
            .eq("ticketId", ticketId)
            .eq("userId", userId);

        if (error) throw error;

        return NextResponse.json({ message: "Assignee removed successfully" }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
