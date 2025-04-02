'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getColumnsAndTickets,
  createColumn,
  createTicket,
} from './action';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

export default function FramePage() {
  const { id: frameId } = useParams() as { id: string };
  const [columns, setColumns] = useState<
    Record<string, { id: string; title: string }[]>
  >({});
  const [columnIds, setColumnIds] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getColumnsAndTickets(frameId);
        const byColumnName: Record<
          string,
          { id: string; title: string }[]
        > = {};

        type Ticket = { id: string; title: string; column_id: string };

        for (const col of data.columns) {
          byColumnName[col.name] = (data.tickets as Ticket[])
            .filter((t: Ticket) => t.column_id === col.id)
            .map((t: Ticket) => ({ id: t.id, title: t.title }));
        }

        setColumns(byColumnName);
        setColumnIds(data.columns);
      } catch (err) {
        console.error('Erreur chargement board:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [frameId]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = Array.from(columns[sourceCol]);
    const [movedTask] = sourceItems.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceItems.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceCol]: sourceItems,
      });
    } else {
      const destItems = Array.from(columns[destCol]);
      destItems.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      });
    }

    // TODO: persist drag & drop in Supabase
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Bouton Ajouter une colonne */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Ajouter une colonne</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle colonne</DialogTitle>
            </DialogHeader>
            <form action={createColumn}>
              <input type="hidden" name="frame_id" value={frameId} />
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la colonne</Label>
                  <Input id="name" name="name" placeholder="Ex: QA" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Board Trello */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-[calc(100vh-6rem)] overflow-x-auto">
          {Object.entries(columns).map(([colName, tasks]) => {
            const column = columnIds.find((c) => c.name === colName);
            if (!column) return null;

            return (
              <div
                key={colName}
                className="flex flex-col bg-white rounded-xl shadow-md w-72 p-4"
              >
                <h2 className="text-lg font-bold mb-4">{colName}</h2>
                <Droppable droppableId={colName} isDropDisabled={false}>
                  {(provided) => (
                    <div
                      className="flex-1 min-h-0 overflow-y-auto space-y-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 border shadow-sm"
                            >
                              <CardContent className="p-4">
                                <p>{task.title}</p>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Bouton + Modale Ajouter une tâche */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 flex items-center justify-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Ajouter une tâche
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle tâche</DialogTitle>
                    </DialogHeader>
                    <form action={createTicket}>
                      <input type="hidden" name="column_id" value={column.id} />
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titre</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Ex: corriger un bug"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Optionnel"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Créer</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
