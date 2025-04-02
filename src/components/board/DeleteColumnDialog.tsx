'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteColumn } from '@/app/frames/[id]/action'; 

export function DeleteColumnDialog({ column, onClose }: { column: any; onClose: () => void }) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>Êtes-vous sûr de vouloir supprimer la colonne <strong>{column.name}</strong> ? Cette action est irréversible.</p>
        </div>
        <DialogFooter>
          <Button onClick={async () => {
            await deleteColumn(column.id);
            onClose();
          }}>Supprimer</Button>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
      <button onClick={onClose} className="hidden" aria-hidden="true"></button>
    </Dialog>
  );
}
