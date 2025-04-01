import { z } from "zod";

export const TicketAssigneeSchema = z.object({
    id: z.string().uuid(),
    ticketId: z.string().uuid(),
    userId: z.string().uuid(),
});
export const TicketAssigneesArraySchema = z.array(TicketAssigneeSchema);

export const TicketAssigneeCreateSchema = TicketAssigneeSchema.omit({ id: true });
export const TicketAssigneeUpdateSchema = TicketAssigneeSchema.partial().omit({ id: true });

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
export const TicketsArraySchema = z.array(TicketSchema);

export const TicketCreateSchema = TicketSchema.omit({ id: true });
export const TicketUpdateSchema = TicketSchema.partial().omit({ id: true });

export const ColumnTicketOrderSchema = z.object({
    id: z.string().uuid(),
    ticket_order: z.array(z.string().uuid()),
});
export const ColumnTicketOrderArraySchema = z.array(ColumnTicketOrderSchema);

export const ColumnTicketOrderCreateSchema = ColumnTicketOrderSchema.omit({ id: true });
export const ColumnTicketOrderUpdateSchema = ColumnTicketOrderSchema.partial().omit({ id: true });



export type TicketAssigneeType = z.infer<typeof TicketAssigneeSchema>;
export type TicketAssigneesArrayType = z.infer<typeof TicketAssigneesArraySchema>;
export type TicketType = z.infer<typeof TicketSchema>;
export type ColumnTicketOrderType = z.infer<typeof ColumnTicketOrderSchema>;
export type ColumnTicketOrderArrayType = z.infer<typeof ColumnTicketOrderArraySchema>;
export type TicketsArrayType = z.infer<typeof TicketsArraySchema>;
export type TicketCreateType = z.infer<typeof TicketCreateSchema>;
export type TicketUpdateType = z.infer<typeof TicketUpdateSchema>;
export type TicketAssigneeCreateType = z.infer<typeof TicketAssigneeCreateSchema>;
export type TicketAssigneeUpdateType = z.infer<typeof TicketAssigneeUpdateSchema>;
export type ColumnTicketOrderCreateType = z.infer<typeof ColumnTicketOrderCreateSchema>;
export type ColumnTicketOrderUpdateType = z.infer<typeof ColumnTicketOrderUpdateSchema>;