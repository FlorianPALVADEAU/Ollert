/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { addCollaborator, createColumn, getFrameData, moveTicket } from "./action";
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

import { getAllCollaboratorUsers, getAllNonCollaboratorUsers } from "@/app/api/users/users.endpoints";
import { UserType } from "@/app/types/users.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircle, ChevronsUpDown, Check } from "lucide-react";
import { randomColors } from "@/utils/randomColors";
import { FrameType } from "@/app/types/frames.type";

export default function FramePage() {
  const { id: frameId } = useParams() as { id: string };
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);
  const [tickets, setTickets] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{
    addCollaborator: boolean;
    addColumn: boolean;
    editColumn: boolean;
    deleteColumn: boolean;
  }>({
    addCollaborator: false,
    addColumn: false,
    editColumn: false,
    deleteColumn: false,
  });
  const [refetchTickets, setRefetchTickets] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [collaborators, setCollaborators] = useState<UserType[]>([]);
  const [frame, setFrame] = useState<FrameType | null>(null);

  const [editingColumn, setEditingColumn] = useState<any | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<any | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getFrameData(frameId);
      setColumns(data.columns);
      setFrame(data.frame);
      const grouped: Record<string, any[]> = {};
      for (const col of data.columns) {
        grouped[col.id] = data.tickets.filter((t) => t.column_id === col.id);
      }
      setTickets(grouped);
      setLoading(false);
      setRefetchTickets(false);
    }

    if (frameId) {
      fetchData();
    }
  }, [frameId, dialogState, refetchTickets]);

  useEffect(() => {
    const fetchUsers = async () => {
      const nonCollaboratorResponse = await getAllNonCollaboratorUsers(frameId);
      const collaboratorResponse = await getAllCollaboratorUsers(frameId);
      const nonCollaboratorData = await nonCollaboratorResponse.json();
      if (nonCollaboratorResponse.ok) {
        setUsers(nonCollaboratorData);
      } else {
        console.error("Erreur de récupération des non collaborateurs:", nonCollaboratorData.error);
      }
      const collaboratorData = await collaboratorResponse.json();
      if (collaboratorResponse.ok) {
        setCollaborators(collaboratorData);
      } else {
        console.error(
          "Erreur de récupération des collaborateurs:",
          collaboratorData.error
        );
      }
    };

    fetchUsers();
  }, [dialogState.addCollaborator]);

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

  const handleOpenDialog = (dialog: "addCollaborator" | "addColumn" | "editColumn" | "deleteColumn") => {
    setDialogState((prev) => ({ ...prev, [dialog]: true }));
  };

  const handleCloseDialog = (dialog: "addCollaborator" | "addColumn" | "editColumn" | "deleteColumn") => {
    setDialogState((prev) => ({ ...prev, [dialog]: false }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{!loading ? 
          frame?.name || "Tableau" : 
          (
          <div className="flex items-center justify-center h-10 w-10">
            <LoaderCircle className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
          </div>)
        }</h1>
        <div className="flex gap-2">
          <div className="relative flex -space-x-4">
            {loading ? (
              <div className="flex items-center justify-center h-10 w-10">
                <LoaderCircle className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
              </div>
            ) : (
              collaborators.map((user, index) => (
                <Avatar
                  key={user.id}
                  className="relative z-[1] border-3 border-white"
                  style={{ left: `${index * -2}px` }} // Décale chaque avatar vers la gauche
                >
                  <AvatarImage src="#" />
                  <AvatarFallback className={`${randomColors[index % randomColors.length]}`}>
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))
            )}
          </div>
          <Dialog open={dialogState.addCollaborator} onOpenChange={(open) => setDialogState((prev) => ({ ...prev, addCollaborator: open }))}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog("addCollaborator")}>
                + Ajouter un collaborateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un collaborateur</DialogTitle>
              </DialogHeader>
              <form
                action={() => {
                  addCollaborator(frameId, value);
                  setValue("");
                  handleCloseDialog("addCollaborator");
                }}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={dialogState.addCollaborator}
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
                        <CommandEmpty>Pas d&apos;utilisateur trouvé.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
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

          <Dialog open={dialogState.addColumn} onOpenChange={(open) => setDialogState((prev) => ({ ...prev, addColumn: open }))}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog("addColumn")}>
                + Ajouter une colonne
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle colonne</DialogTitle>
              </DialogHeader>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  createColumn(formData);
                  handleCloseDialog("addColumn");
                }}
              >
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


      {
        loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)] w-full">
            <LoaderCircle className="animate-spin text-gray-500 h-10 w-10 mx-auto" />
          </div>
        ) : (
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
                  onEdit={() => {
                    setDialogState((prev) => ({ ...prev, editColumn: true })); 
                    setEditingColumn(column);
                  }}
                  onDelete={() => {
                    setDialogState((prev) => ({ ...prev, deleteColumn: true })); 
                    setDeletingColumn(column);
                  }}
                  refetchTickets={() => setRefetchTickets(true)}
                />
              ))}
            </div>
          </DndContext>
        )
      }

      {/* Modale pour modifier la colonne */}
      {dialogState.editColumn && editingColumn && (
        <EditColumnDialog
          open={dialogState.editColumn}
          onOpenChange={(open) => setDialogState((prev) => ({ ...prev, editColumn: open }))}
          column={editingColumn}
          onClose={() => handleCloseDialog("editColumn")}
        />
      )}

      {/* Modale pour supprimer la colonne */}
      {dialogState.deleteColumn && deletingColumn && (
        <DeleteColumnDialog
          open={dialogState.deleteColumn}
          onOpenChange={(open) => setDialogState((prev) => ({ ...prev, deleteColumn: open }))}
          column={deletingColumn}
          onClose={() => handleCloseDialog("deleteColumn")}
        />

      )}
    </div>
  );
}
