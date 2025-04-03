/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';
import { randomColors } from '@/utils/randomColors';
import { assignUserToTicket } from '@/app/api/tickets/ticket.endpoints';
import { useGetLoggedUser } from '@/app/api/users/users.endpoints';
import { User } from '@supabase/supabase-js';

export function DraggableTicket({ ticket, columnId, open, onClose, setOpen, refetchTicket }: { ticket: any; columnId: string, open: boolean, onClose: () => void, setOpen: (open: boolean) => void, refetchTicket: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { columnId },
  });
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const { data: lgdUser } = useGetLoggedUser() as any;

  useEffect(() => {
    if (lgdUser) {
      setLoggedUser(lgdUser); // Utilisez directement lgdUser
    } 
  }, [lgdUser]);

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    width: '100%',
    boxSizing: 'border-box',
    transition: 'transform 200ms ease',
    ...(isDragging ? { transform: 'none' } : {}),
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <div
        style={style}
        className="bg-gray-50 border p-3 rounded shadow-sm select-none flex items-start"
      >
        {/* Zone de drag uniquement sur cette poignée */}
        <div 
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="mr-2 mt-1 cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={16} />
        </div>
        
        {/* Contenu du ticket cliquable pour voir les détails */}
        <DialogTrigger onClick={() => setOpen(true)} className="flex-1 cursor-pointer text-left">
          <div className={`relative ${ticket?.ticket_assignees?.length > 0 && "pb-6"} `}>
            <p className="font-medium">{ticket.title}</p>
            {ticket.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
            )}
            <div className="absolute bottom-0 right-0 flex -space-x-4">

               { 
                Array.isArray(ticket?.ticket_assignees) && ticket?.ticket_assignees?.length > 0 && ticket?.ticket_assignees?.map((user: any, index: number) => (
                  <Avatar
                    key={user.id}
                    className="relative z-[1] border-3 border-white !h-7 !w-7"
                    style={{ left: `${index * -2}px` }}
                  >
                    <AvatarImage src="#" />
                    <AvatarFallback className={`${randomColors[index % randomColors.length]}`}>
                      {user?.users?.name
                        ? user?.users?.name?.charAt(0).toUpperCase()
                        : user?.users?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
              ))}
            </div>
          </div>
        </DialogTrigger>
      </div>

      {/* Dialogue pour afficher les détails du ticket */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ticket.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {ticket.description && (
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          {/* if user is not affiliated to this ticket, add a button 'prendre le ticket' */}
          <Button onClick={() => {
            async function takeTicket() {
              try {
                if (!loggedUser) return;
                await assignUserToTicket(ticket.id, loggedUser.id);
              } catch (error) {
                console.error("Erreur lors de la prise du ticket :", error);
              }
            }

            onClose();
            takeTicket();
            refetchTicket();
          }}>Prendre le ticket</Button>
        </DialogFooter>
      </DialogContent>
      <button onClick={onClose} className="hidden" aria-hidden="true"></button>
    </Dialog>
  );
}