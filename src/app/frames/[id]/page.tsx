'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFrameData, moveTicket } from './action';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { Column } from '@/components/board/Column';
import { AddColumnDialog } from '@/components/board/AddColumnDialog';
import { EditColumnDialog } from '@/components/board/EditColumnDialog';
import { DeleteColumnDialog } from '@/components/board/DeleteColumnDialog';

export default function FramePage() {
  const { id: frameId } = useParams() as { id: string };
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);
  const [tickets, setTickets] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingColumn, setEditingColumn] = useState<any | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<any | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function fetchData() {
      const data = await getFrameData(frameId);
      setColumns(data.columns);

      const grouped: Record<string, any[]> = {};
      for (const col of data.columns) {
        grouped[col.id] = data.tickets.filter((t) => t.column_id === col.id);
      }
      setTickets(grouped);
      setLoading(false);
    }

    fetchData();
  }, [frameId]);

  const handleTicketDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const sourceColId = active.data.current?.columnId;
    const destColId = over.id;

    if (!sourceColId || !destColId) return;

    if (sourceColId === destColId) return;

    const ticket = tickets[sourceColId].find((t) => t.id === active.id);
    if (!ticket) return;

    const updatedSource = tickets[sourceColId].filter((t) => t.id !== active.id);
    const updatedDest = [...(tickets[destColId] || []), { ...ticket, column_id: destColId }];

    setTickets({
      ...tickets,
      [sourceColId]: updatedSource,
      [destColId]: updatedDest,
    });

    try {
      await moveTicket(String(ticket.id), String(destColId), updatedDest.length);
    } catch (err) {
      console.error('Erreur lors du déplacement du ticket :', err);
    }
  };
  

  if (loading) return <div className="p-6">Chargement du tableau...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mon tableau</h1>
        <AddColumnDialog frameId={frameId} />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTicketDragEnd}>
        <div className="flex gap-4 overflow-x-auto h-[calc(100vh-12rem)] pb-6">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tickets={tickets[column.id] || []}
              onEdit={() => setEditingColumn(column)}
              onDelete={() => setDeletingColumn(column)}
            />
          ))}
        </div>
      </DndContext>

      {/* Modale pour modifier la colonne */}
      {editingColumn && <EditColumnDialog column={editingColumn} onClose={() => setEditingColumn(null)} />}

      {/* Modale pour supprimer la colonne */}
      {deletingColumn && <DeleteColumnDialog column={deletingColumn} onClose={() => setDeletingColumn(null)} />}
    </div>
  );
}
