"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFrameData, moveTicket } from "./action";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { Column } from "@/components/board/Column";
import { EditColumnDialog } from "@/components/board/EditColumnDialog";
import { DeleteColumnDialog } from "@/components/board/DeleteColumnDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { createColumn, addCollaborator } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getAllNonCollaboratorUsers } from "@/app/api/users/users.endpoints";
import { UserType } from "@/app/types/users.type";

export default function FramePage() {
  const { id: frameId } = useParams() as { id: string };
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);
  const [tickets, setTickets] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [users, setUsers] = useState<UserType[]>([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllNonCollaboratorUsers(frameId);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        console.error("Erreur de récupération des utilisateurs:", data.error);
      }
    };

    fetchUsers();
  }, [open]);

  const handleTicketDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const sourceColId = active.data.current?.columnId;
    const destColId = over.id;

    if (!sourceColId || !destColId) return;

    if (sourceColId === destColId) return;

    const ticket = tickets[sourceColId].find((t) => t.id === active.id);
    if (!ticket) return;

    const updatedSource = tickets[sourceColId].filter(
      (t) => t.id !== active.id
    );
    const updatedDest = [
      ...(tickets[destColId] || []),
      { ...ticket, column_id: destColId },
    ];

    setTickets({
      ...tickets,
      [sourceColId]: updatedSource,
      [destColId]: updatedDest,
    });

    try {
      await moveTicket(
        String(ticket.id),
        String(destColId),
        updatedDest.length
      );
    } catch (err) {
      console.error("Erreur lors du déplacement du ticket :", err);
    }
  };

  if (loading) return <div className="p-6">Chargement du tableau...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Ajouter un collaborateur</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un collaborateur</DialogTitle>
              </DialogHeader>
              <form
                action={() => {
                  addCollaborator(frameId, value);
                  setValue("");
                }}
              >
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? users.find((user) => user.id === value)?.email
                        : "Chercher un utilisateur..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher ..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Pas d'utilisateur trouvé.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {user.email}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === user.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">Ajouter</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: QA"
                      required
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
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleTicketDragEnd}
      >
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
      {editingColumn && (
        <EditColumnDialog
          column={editingColumn}
          onClose={() => setEditingColumn(null)}
        />
      )}

      {/* Modale pour supprimer la colonne */}
      {deletingColumn && (
        <DeleteColumnDialog
          column={deletingColumn}
          onClose={() => setDeletingColumn(null)}
        />
      )}
    </div>
  );
}
