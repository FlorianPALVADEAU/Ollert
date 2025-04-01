import { z } from "zod";

const CarSchema = z.object({
  id: z.string().uuid(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().gte(1900).lte(new Date().getFullYear()),
});

export const CarCreateSchema = CarSchema.omit({ id: true });
export const CarUpdateSchema = CarSchema.partial().omit({ id: true });
export const CarArraySchema = z.array(CarSchema);

export type CarType = z.infer<typeof CarSchema>;
export type CarCreateType = z.infer<typeof CarCreateSchema>;
export type CarUpdateType = z.infer<typeof CarUpdateSchema>;
export type CarArrayType = z.infer<typeof CarArraySchema>;