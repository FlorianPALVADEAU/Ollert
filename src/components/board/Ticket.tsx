'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function DraggableTicket({ ticket, columnId }: { ticket: any; columnId: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ticket.id,
    data: { columnId },
  });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 border p-3 rounded shadow-sm cursor-move select-none"
    >
      <p className="font-medium">{ticket.title}</p>
      {ticket.description && (
        <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
      )}
    </div>
  );
}
