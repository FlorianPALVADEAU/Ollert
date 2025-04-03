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
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddTicketDialog } from "./AddTicketDialog";
import { ColumnActionsMenu } from "./ColumnActionsMenu";

export function Column({
  column,
  tickets,
  onEdit,
  onDelete,
}: {
  column: any;
  tickets: any[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour gérer l'ouverture de la boîte de dialogue
  const [selectedTicket, setSelectedTicket] = useState<any>(null); // Pour savoir quel ticket a été sélectionné

  const handleTicketClick = (ticket: any) => {
    console.log("click");
    setSelectedTicket(ticket); // Définir le ticket sélectionné
    setIsDialogOpen(true); // Ouvrir la boîte de dialogue
  };

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
            onClick={(e) => {
              e.stopPropagation();
              handleTicketClick(ticket);
            }}
          >
            <DraggableTicket
              ticket={ticket}
              columnId={column.id}
              handleTicketClick={handleTicketClick}
            />
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la tâche</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div>
              <p>
                <strong>ID de la tâche:</strong> {selectedTicket.id}
              </p>
              <p>
                <strong>Nom de la tâche:</strong> {selectedTicket.name}
              </p>
              {/* Ajoutez plus de détails du ticket ici */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
