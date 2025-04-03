"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function DraggableTicket({
  ticket,
  columnId,
  handleTicketClick,
}: {
  ticket: any;
  columnId: string;
  handleTicketClick: (ticket: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: ticket.id,
      data: { columnId },
    });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    width: "100%",
    boxSizing: "border-box",
    transition: "transform 200ms ease",
    ...(isDragging ? { transform: "none" } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes} // Applique les attributs nécessaires pour le drag
      {...listeners} // Applique les écouteurs d'événements pour le drag
      className="bg-gray-50 border p-3 rounded shadow-sm cursor-move select-none"
      onClick={handleTicketClick} // Ajout de la gestion du clic dans les listeners
    >
      <p className="font-medium">{ticket.title}</p>
      {ticket.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {ticket.description}
        </p>
      )}
    </div>
  );
}
