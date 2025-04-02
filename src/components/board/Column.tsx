'use client';

import { useDroppable } from '@dnd-kit/core';
import { DraggableTicket } from './Ticket';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, MoreHorizontal } from 'lucide-react';
import { AddTicketDialog } from './AddTicketDialog';
import { ColumnActionsMenu } from './ColumnActionsMenu'; // Import du menu d'actions

export function Column({ column, tickets, onEdit, onDelete }: { column: any; tickets: any[]; onEdit: () => void; onDelete: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-64 min-w-64 h-full p-4 rounded shadow transition-colors ${
        isOver ? 'bg-blue-100' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{column.name}</h2>
        <ColumnActionsMenu onEdit={onEdit} onDelete={onDelete} /> {/* Menu d'actions */}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {tickets.map((ticket) => (
          <DraggableTicket key={ticket.id} ticket={ticket} columnId={column.id} />
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <AddTicketDialog columnId={column.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
