import { z } from "zod";
import { ColumnsArraySchema } from "./columns.type";


export const FrameCollaboratorSchema = z.object({
    id: z.string().uuid(),
    frameId: z.string().uuid(),
    userId: z.string().uuid(),
});
export const FrameCollaboratorsArraySchema = z.array(FrameCollaboratorSchema);

export const FrameCollaboratorCreateSchema = FrameCollaboratorSchema.omit({ id: true });
export const FrameCollaboratorUpdateSchema = FrameCollaboratorSchema.partial().omit({ id: true });

export const FrameSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    backgroundImage: z.string().optional(),
    columns: ColumnsArraySchema, 
    collaborators: FrameCollaboratorsArraySchema, 
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const FramesArraySchema = z.array(FrameSchema);

export const FrameCreateSchema = FrameSchema.omit({ id: true });
export const FrameUpdateSchema = FrameSchema.partial().omit({ id: true });

export type FrameCollaboratorType = z.infer<typeof FrameCollaboratorSchema>;
export type FrameCollaboratorsArrayType = z.infer<typeof FrameCollaboratorsArraySchema>;
export type FrameType = z.infer<typeof FrameSchema>;
export type FramesArrayType = z.infer<typeof FramesArraySchema>;
export type FrameCreateType = z.infer<typeof FrameCreateSchema>;
export type FrameUpdateType = z.infer<typeof FrameUpdateSchema>;
export type FrameCollaboratorCreateType = z.infer<typeof FrameCollaboratorCreateSchema>;
export type FrameCollaboratorUpdateType = z.infer<typeof FrameCollaboratorUpdateSchema>;
