import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { CarCreateSchema, CarCreateType, CarType, CarUpdateType } from "@/app/types/cars.type";
import { createClient } from "@/utils/supabase/client";

const queryClient = new QueryClient();

// --- Car Routes ---
export const getAllCars = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("cars").select("*");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
};

export const getCarById = async (id: string) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "Le champ ID est requis"})
    }
    const supabase = await createClient();
    const { data, error } = await supabase.from("cars").select("*").eq("id", id).single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error); // Log pour débogage
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
};

export const createCar = async (car: CarCreateType) => {
  try {
    const { brand, model, year } = car;
    const parsedSchema = CarCreateSchema.parse(car);

    if (!parsedSchema) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    const supabase = await createClient();
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
};

export const updateCar = async (id: string, car: CarUpdateType) => {
  try {
    const parsedSchema = CarCreateSchema.parse(car);
    if (parsedSchema) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cars")
      .update(car)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating car:", error); // Log pour débogage
    return NextResponse.json({ error: "Car not found or invalid data" }, { status: 404 });
  }
};

export const deleteCar = async (id: string) => {
  try {
    if (!id) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error); // Log pour débogage
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
};

// --- useQuery and useMutation Hooks ---
export const useGetAllCars = () => {
  return useQuery({ queryKey: ["cars"], queryFn: getAllCars });
};

export const useGetCarById = (id: string) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => getCarById(id),
    enabled: !!id,
  });
};

export const useCreateCar = () => {
  return useMutation({
    mutationFn: (car: { brand: string; model: string; year: number }) => createCar(car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};

export const useUpdateCar = () => {
  return useMutation({
    mutationFn: ({ id, car }: { id: string; car: Partial<CarType> }) => updateCar(id, car) as Promise<unknown>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};

export const useDeleteCar = () => {
  return useMutation({
    mutationFn: (id: string) => deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};