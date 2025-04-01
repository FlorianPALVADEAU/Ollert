"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const initialData: Record<string, { id: string; title: string }[]> = {
  "To Do": [
    { id: "1", title: "Créer projet Next.js" },
    { id: "2", title: "Installer Shadcn UI" },
  ],
  "In Progress": [
    { id: "3", title: "Développer la page login" },
  ],
  "Done": [
    { id: "4", title: "Configurer Supabase" },
  ],
  "In Production": [],
};

export default function TrelloBoard() {
  const [columns, setColumns] = useState(initialData);

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
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-[calc(100vh-4rem)] overflow-x-auto p-6">
        {Object.entries(columns).map(([columnId, tasks]) => (
          <div
            key={columnId}
            className="flex flex-col bg-white rounded-xl shadow-md w-72 p-4"
          >
            <h2 className="text-lg font-bold mb-4">{columnId}</h2>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  className="flex-1 min-h-0 overflow-y-auto space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
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

            <Button
              variant="outline"
              size="sm"
              className="mt-4 flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" /> Ajouter une tâche
            </Button>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
