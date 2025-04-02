import { TicketAssigneeCreateType, TicketAssigneeCreateSchema, TicketAssigneeUpdateType, TicketAssigneeUpdateSchema } from "@/app/types/tickets.type";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { z } from "zod";

const queryClient = new QueryClient();


// --- TicketAssignee Routes ---
export const getAllTicketAssignees = async () => {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase.from("ticket_assignees").select("*");

		if (error) throw error;

		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to fetch ticket_assignees" }, { status: 500 });
	}
};

export const getTicketAssigneeById = async (id: string) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}
		const supabase = await createClient();
		const { data, error } = await supabase.from("ticket_assignees").select("*").eq("id", id).single();
	
		if (error) throw error;
	
		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "TicketAssignee not found" }, { status: 404 });
	}
};

export const createTicketAssignee = async (TicketAssignee: TicketAssigneeCreateType) => {
    try {

        const parsedBody = TicketAssigneeCreateSchema.parse(TicketAssignee);

		if (!parsedBody) {
			return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
		}
		const supabase = await createClient();
        // Insertion de la colonne dans la base de données
        const { data, error } = await supabase
            .from("ticket_assignees")
            .insert([
                {
                    ...parsedBody,
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
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
};

export const updateTicketAssignee = async (id: string, TicketAssignee: TicketAssigneeUpdateType) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}

		const parsedBody = TicketAssigneeUpdateSchema.parse(TicketAssignee)
	
		if (!parsedBody) {
			return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
		}
		const supabase = await createClient();
		const { data, error } = await supabase
		  .from("ticket_assignees")
		  .update({
			...parsedBody,
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
};

export const deleteTicketAssignee = async (id: string) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}
		const supabase = await createClient();
		const { error } = await supabase.from("ticket_assignees").delete().eq("id", id);
	
		if (error) throw error;
	
		return NextResponse.json({ message: "TicketAssignee deleted successfully" }, { status: 204 });
	  } catch (error) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	  }
};

// --- useQuery and useMutation Hooks ---
export const useGetAllTicketAssignees = () => {
  return useQuery({ queryKey: ["ticket_assignees"], queryFn: getAllTicketAssignees });
};

export const useGetTicketAssigneeById = (id: string) => {
  return useQuery({
	queryKey: ["frame", id],
	queryFn: () => getTicketAssigneeById(id),
	enabled: !!id,
  });
};

export const useCreateTicketAssignee = () => {
  return useMutation({
	mutationFn: (column: TicketAssigneeCreateType) => createTicketAssignee(column),
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["ticket_assignees"] });
	},
  });
};

export const useUpdateTicketAssignee = () => {
  return useMutation({
	mutationFn: ({ id, column }: { id: string; column: TicketAssigneeUpdateType }) => updateTicketAssignee(id, column) as Promise<unknown>,
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["ticket_assignees"] });
	},
  });
};

export const useDeleteTicketAssignee = () => {
  return useMutation({
	mutationFn: (id: string) => deleteTicketAssignee(id),
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["ticket_assignees"] });
	},
  });
};