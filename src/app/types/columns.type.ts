import { z } from "zod";

export const ColumnSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    frameId: z.string().uuid(),
    tickets: z.array(z.string().uuid()),
}); 
export const ColumnsArraySchema = z.array(ColumnSchema);
export const ColumnCreateSchema = ColumnSchema.omit({ id: true });
export const ColumnUpdateSchema = ColumnSchema.partial().omit({ id: true });

export type ColumnType = z.infer<typeof ColumnSchema>;
export type ColumnsArrayType = z.infer<typeof ColumnsArraySchema>;
export type ColumnCreateType = z.infer<typeof ColumnCreateSchema>;
export type ColumnUpdateType = z.infer<typeof ColumnUpdateSchema>;