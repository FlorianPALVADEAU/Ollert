import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { DraggableTicket } from "./Ticket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddTicketDialog } from "./AddTicketDialog";
import { ColumnActionsMenu } from "./ColumnActionsMenu";

export function Column({
  column,
  tickets,
  onEdit,
  onDelete,
  refetchTickets,
}: {
  column: any;
  tickets: any[];
  onEdit: () => void;
  onDelete: () => void;
  refetchTickets: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-64 min-w-64 h-full p-4 rounded shadow transition-colors ${
        isOver ? "bg-blue-100" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{column.name}</h2>
        <ColumnActionsMenu onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
          >
            <DraggableTicket
              ticket={ticket}
              columnId={column.id}
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              setOpen={() => setIsDialogOpen(true)}
              refetchTicket={refetchTickets}
              />
          </div>
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
