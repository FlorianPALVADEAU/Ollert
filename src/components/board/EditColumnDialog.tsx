'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateColumn } from '@/app/frames/[id]/action'; 

export function EditColumnDialog({ open, column, onClose, onOpenChange }: { open: boolean; column: any; onClose: () => void, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la colonne</DialogTitle>
        </DialogHeader>
        <form action={updateColumn}>
          <input type="hidden" name="column_id" value={column.id} />
          <div className="space-y-4 py-4">
            <Label htmlFor="name">Nom de la colonne</Label>
            <Input id="name" name="name" defaultValue={column.name} required />
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
            <Button variant="outline" onClick={() => onClose()}>Annuler</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
