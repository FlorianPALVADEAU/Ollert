'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteColumn } from '@/app/frames/[id]/action'; 

export function DeleteColumnDialog({ open, column, onClose, onOpenChange }: { open: boolean; column: any; onClose: () => void, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>Êtes-vous sûr de vouloir supprimer la colonne <strong>{column.name}</strong> ? Cette action est irréversible.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            async function deleteColumnAndClose() {
              try {
                onClose();
                await deleteColumn(column.id);
              }
              catch (error) {
                console.error("Erreur lors de la suppression de la colonne :", error);
              }
            }
            deleteColumnAndClose();
          }}>Supprimer</Button>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
      <button onClick={onClose} className="hidden" aria-hidden="true"></button>
    </Dialog>
  );
}
