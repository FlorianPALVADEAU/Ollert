import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const UserArraySchema = z.array(UserSchema);

export const TicketAssigneeSchema = z.object({
    id: z.string().uuid(),
    ticketId: z.string().uuid(),
    userId: z.string().uuid(),
});
export const TicketAssigneesArraySchema = z.array(TicketAssigneeSchema);

export const TicketSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    assignees: TicketAssigneesArraySchema,
    dueDate: z.string().datetime().optional(),
    tags: z.array(z.string().min(1)).optional(),
    thumbnail: z.string().optional(),
    position: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const ColumnTicketOrderSchema = z.object({
    id: z.string().uuid(),
    ticket_order: z.array(z.string().uuid()),
});
export const ColumnTicketOrderArraySchema = z.array(ColumnTicketOrderSchema);


export const ColumnSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    frameId: z.string().uuid(),
    tickets: z.array(z.string().uuid()),
}); 
export const ColumnsArraySchema = z.array(ColumnSchema);

export const FrameCollaboratorSchema = z.object({
    id: z.string().uuid(),
    frameId: z.string().uuid(),
    userId: z.string().uuid(),
});
export const FrameCollaboratorsArraySchema = z.array(FrameCollaboratorSchema);

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
export const TicketsArraySchema = z.array(TicketSchema);
export const UsersArraySchema = z.array(UserSchema);

export type UserType = z.infer<typeof UserSchema>;
export type UserArrayType = z.infer<typeof UserArraySchema>;
export type TicketAssigneeType = z.infer<typeof TicketAssigneeSchema>;
export type TicketAssigneesArrayType = z.infer<typeof TicketAssigneesArraySchema>;
export type TicketType = z.infer<typeof TicketSchema>;
export type ColumnTicketOrderType = z.infer<typeof ColumnTicketOrderSchema>;
export type ColumnTicketOrderArrayType = z.infer<typeof ColumnTicketOrderArraySchema>;
export type ColumnType = z.infer<typeof ColumnSchema>;
export type ColumnsArrayType = z.infer<typeof ColumnsArraySchema>;
export type FrameCollaboratorType = z.infer<typeof FrameCollaboratorSchema>;
export type FrameCollaboratorsArrayType = z.infer<typeof FrameCollaboratorsArraySchema>;
export type FrameType = z.infer<typeof FrameSchema>;
export type FramesArrayType = z.infer<typeof FramesArraySchema>;
 