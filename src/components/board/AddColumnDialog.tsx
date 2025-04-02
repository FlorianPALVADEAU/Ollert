'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createColumn } from '@/app/frames/[id]/action';

export function AddColumnDialog({ frameId }: { frameId: string }) {
  return (
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
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" placeholder="Nom de la colonne" required />
          </div>
          <DialogFooter>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
