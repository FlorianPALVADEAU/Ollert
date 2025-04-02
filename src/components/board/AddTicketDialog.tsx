'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTicket } from '@/app/frames/[id]/action';

export function AddTicketDialog({ columnId }: { columnId: string }) {
  return (
    <form action={createTicket}>
      <input type="hidden" name="column_id" value={columnId} />
      <div className="space-y-4 py-4">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required />
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>
      <Button type="submit">Créer</Button>
    </form>
  );
}
