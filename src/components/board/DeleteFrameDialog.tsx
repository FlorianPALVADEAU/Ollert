'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteFrame } from '@/app/api/frames/frames.endpoints';

export function DeleteFrameDialog({ open, frame, onClose, onOpenChange }: { open: boolean; frame: any; onClose: () => void, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            Êtes-vous sûr de vouloir supprimer le tableau <strong>{frame.name}</strong> ?
            {
              frame?.collaborators?.length ? (
                <span>Cette action supprimera ce tableau pour vous et les <strong>{frame.collaborators.length} autres collaborateurs</strong></span>
              ) : (
                <span>Cette action action est irréversible</span>
              )
            }
            .
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            async function deleteColumnAndClose() {
              try {
                onClose();
                await deleteFrame(frame.id);
              }
              catch (error) {
                console.error("Erreur lors de la suppression de le tableau :", error);
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
