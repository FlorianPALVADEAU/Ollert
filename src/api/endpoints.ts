import axios from "axios";
import { CarType } from "./cars/service";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const baseUrl = process.env.NEXT_PUBLIC_API_URL
const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCars = async () => {
    try {
        const response = await axiosClient.get("/api/cars");
        return response.data;
    } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
    }
}

export const getCarById = async (id: string) => {
    try {
        const response = await axiosClient.get(`/api/cars/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching car:", error);
        throw error;
    }
}

export const createCar = async (car: { brand: string; model: string; year: number }) => {
    try {
        const response = await axiosClient.post("/api/cars", car);
        return response.data;
    } catch (error) {
        console.error("Error creating car:", error);
        throw error;
    }
}

export const updateCar = async (id: string, car: { brand?: string; model?: string; year?: number }) => {
    try {
        const response = await axiosClient.put(`/api/cars/${id}`, car);
        return response.data;
    } catch (error) {
        console.error("Error updating car:", error);
        throw error;
    }
}
export const deleteCar = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/api/cars/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting car:", error);
        throw error;
    }
}

// useQuerys


export const useGetAllCars = () => {
    return useQuery({ queryKey: ["cars"], queryFn: getAllCars });
}

export const useGetCarById = (id: string) => {
    return useQuery({
        queryKey: ["car", id],
        queryFn: () => getCarById(id),
        enabled: !!id,
    });
}
export const useCreateCar = () => {
    return useMutation({ 
        mutationFn: (car: { brand: string; model: string; year: number }) => createCar(car),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
    });
}

export const useUpdateCar = () => {
    return useMutation({ 
        mutationFn: ({ id, car }: { id: string; car: Partial<CarType> }) => updateCar(id, car) as Promise<unknown>, 
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
    });
}

export const useDeleteCar = () => {
    return useMutation({ 
        mutationFn: (id: string) => deleteCar(id), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
    });
}