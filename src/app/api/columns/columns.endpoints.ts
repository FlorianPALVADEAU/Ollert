import { ColumnCreateSchema, ColumnCreateType, ColumnUpdateSchema, ColumnUpdateType } from "@/app/types/columns.type";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { z } from "zod";

const queryClient = new QueryClient();


// --- Column Routes ---
export const getAllColumns = async () => {
	try {
		const { data, error } = await supabase.from("columns").select("*");

		if (error) throw error;

		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to fetch columns" }, { status: 500 });
	}
};

export const getColumnById = async (id: string) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}
		
		const { data, error } = await supabase.from("columns").select("*").eq("id", id).single();
	
		if (error) throw error;
	
		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Column not found" }, { status: 404 });
	}
};

export const createColumn = async (Column: ColumnCreateType) => {
    try {

        const parsedBody = ColumnCreateSchema.parse(Column);

		if (!parsedBody) {
			return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
		}

        const { name, frameId, tickets } = parsedBody;

        // Insertion de la colonne dans la base de données
        const { data, error } = await supabase
            .from("columns")
            .insert([
                {
                    name,
                    frameId,
                    tickets,
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

export const updateColumn = async (id: string, Column: ColumnUpdateType) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}

		const parsedBody = ColumnUpdateSchema.parse(Column)
	
		if (!parsedBody) {
			return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
		}
	
		const { data, error } = await supabase
		  .from("columns")
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

export const deleteColumn = async (id: string) => {
	try {
		if (!id) {
			return NextResponse.json({ error: "Le champ ID est requis"})
		}

		const { error } = await supabase.from("columns").delete().eq("id", id);
	
		if (error) throw error;
	
		return NextResponse.json({ message: "Column deleted successfully" }, { status: 204 });
	  } catch (error) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	  }
};

// --- useQuery and useMutation Hooks ---
export const useGetAllColumns = () => {
  return useQuery({ queryKey: ["frames"], queryFn: getAllColumns });
};

export const useGetColumnById = (id: string) => {
  return useQuery({
	queryKey: ["frame", id],
	queryFn: () => getColumnById(id),
	enabled: !!id,
  });
};

export const useCreateColumn = () => {
  return useMutation({
	mutationFn: (column: ColumnCreateType) => createColumn(column),
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["frames"] });
	},
  });
};

export const useUpdateColumn = () => {
  return useMutation({
	mutationFn: ({ id, column }: { id: string; column: ColumnUpdateType }) => updateColumn(id, column) as Promise<unknown>,
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["frames"] });
	},
  });
};

export const useDeleteColumn = () => {
  return useMutation({
	mutationFn: (id: string) => deleteColumn(id),
	onSuccess: () => {
	  queryClient.invalidateQueries({ queryKey: ["frames"] });
	},
  });
};