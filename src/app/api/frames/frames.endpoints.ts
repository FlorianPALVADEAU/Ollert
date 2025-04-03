import { FrameCreateType, FrameCreateSchema, FrameUpdateType, FrameUpdateSchema } from "@/app/types/frames.type";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { z } from "zod";

const queryClient = new QueryClient();

// --- Frame Routes ---
export const getAllFrames = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("frames").select("*");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch frames" }, { status: 500 });
  }
};

export const getFrameById = async (id: string) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "Le champ ID est requis" });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.from("frames").select("*").eq("id", id).single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }
};

export const createFrame = async (Frame: FrameCreateType) => {
  try {
    const parsedBody = FrameCreateSchema.parse(Frame);

    if (!parsedBody) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    const supabase = await createClient();
    // Insertion du frame dans la base de données
    const { data, error } = await supabase
      .from("frames")
      .insert([
        {
          ...parsedBody,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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

export const updateFrame = async (id: string, Frame: FrameUpdateType) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "Le champ ID est requis" });
    }

    const parsedBody = FrameUpdateSchema.parse(Frame);

    if (!parsedBody) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("frames")
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

export const deleteFrame = async (id: string) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "Le champ ID est requis" });
    }
    const supabase = await createClient();
    const { error } = await supabase.from("frames").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Frame deleted successfully" }, { status: 204 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

// --- useQuery and useMutation Hooks ---
export const useGetAllFrames = () => {
  return useQuery({ queryKey: ["frames"], queryFn: getAllFrames });
};

export const useGetFrameById = (id: string) => {
  return useQuery({
    queryKey: ["frame", id],
    queryFn: () => getFrameById(id),
    enabled: !!id,
  });
};

export const useCreateFrame = () => {
  return useMutation({
    mutationFn: (frame: FrameCreateType) => createFrame(frame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
  });
};

export const useUpdateFrame = () => {
  return useMutation({
    mutationFn: ({ id, frame }: { id: string; frame: FrameUpdateType }) => updateFrame(id, frame) as Promise<unknown>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
  });
};

export const useDeleteFrame = () => {
  return useMutation({
    mutationFn: (id: string) => deleteFrame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
  });
};
