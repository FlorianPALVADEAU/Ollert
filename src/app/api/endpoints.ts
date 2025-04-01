import axios from "axios";
import { CarType } from "./cars/service";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Car Routes ---
export const getAllCars = async () => {
  try {
    const response = await axiosClient.get("/api/cars");
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};

export const getCarById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/api/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
};

export const createCar = async (car: { brand: string; model: string; year: number }) => {
  try {
    const response = await axiosClient.post("/api/cars", car);
    return response.data;
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
};

export const updateCar = async (id: string, car: { brand?: string; model?: string; year?: number }) => {
  try {
    const response = await axiosClient.put(`/api/cars/${id}`, car);
    return response.data;
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};

export const deleteCar = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/api/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

// --- User Routes ---
export const getAllUsers = async () => {
  try {
    const response = await axiosClient.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (user: { name: string; email: string; role: string }) => {
  try {
    const response = await axiosClient.post("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, user: { name?: string; email?: string; role?: string }) => {
  try {
    const response = await axiosClient.put(`/api/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// --- Ticket Routes ---
export const getAllTickets = async () => {
  try {
    const response = await axiosClient.get("/api/tickets");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/api/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

export const createTicket = async (ticket: { title: string; description: string; assigneeId: string }) => {
  try {
    const response = await axiosClient.post("/api/tickets", ticket);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const updateTicket = async (id: string, ticket: { title?: string; description?: string; assigneeId?: string }) => {
  try {
    const response = await axiosClient.put(`/api/tickets/${id}`, ticket);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

export const deleteTicket = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/api/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};

// --- Frame Routes ---
export const getAllFrames = async () => {
  try {
    const response = await axiosClient.get("/api/frames");
    return response.data;
  } catch (error) {
    console.error("Error fetching frames:", error);
    throw error;
  }
};

export const getFrameById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/api/frames/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching frame:", error);
    throw error;
  }
};

export const createFrame = async (frame: { type: string; size: number; carId: string }) => {
  try {
    const response = await axiosClient.post("/api/frames", frame);
    return response.data;
  } catch (error) {
    console.error("Error creating frame:", error);
    throw error;
  }
};

export const updateFrame = async (id: string, frame: { type?: string; size?: number; carId?: string }) => {
  try {
    const response = await axiosClient.put(`/api/frames/${id}`, frame);
    return response.data;
  } catch (error) {
    console.error("Error updating frame:", error);
    throw error;
  }
};

export const deleteFrame = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/api/frames/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting frame:", error);
    throw error;
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

// --- User Hooks ---
export const useGetAllUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: getAllUsers });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (user: { name: string; email: string; role: string }) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<{ name: string; email: string; role: string }> }) => updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// --- Ticket Hooks ---
export const useGetAllTickets = () => {
  return useQuery({ queryKey: ["tickets"], queryFn: getAllTickets });
};

export const useGetTicketById = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: (ticket: { title: string; description: string; assigneeId: string }) => createTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  return useMutation({
    mutationFn: ({ id, ticket }: { id: string; ticket: Partial<{ title: string; description: string; assigneeId: string }> }) => updateTicket(id, ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useDeleteTicket = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

// --- Frame Hooks ---
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
    mutationFn: (frame: { type: string; size: number; carId: string }) => createFrame(frame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    },
  });
};

export const useUpdateFrame = () => {
  return useMutation({
    mutationFn: ({ id, frame }: { id: string; frame: Partial<{ type: string; size: number; carId: string }> }) => updateFrame(id, frame),
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
