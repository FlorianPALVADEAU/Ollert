/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getUserFrames, createFrame } from "@/app/action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteFrameDialog } from "@/components/board/DeleteFrameDialog";

export default function DashboardPage() {
  const [frames, setFrames] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [frameToDelete, setFrameToDelete] = useState<any>(null);

  useEffect(() => {
    async function fetchFrames() {
      const frames = await getUserFrames();
      setFrames(frames);
    }
    fetchFrames();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Tableaux</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Créer un tableau</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau tableau</DialogTitle>
            </DialogHeader>

            <form action={createFrame}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nom du tableau"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Ajoutez une description optionnelle"
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

      {frames.length === 0 ? (
        <p className="text-muted-foreground">Aucun tableau pour l’instant</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {frames.map((frame) => (
            <Link key={frame.id} href={`/frames/${frame.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full flex justify-between items-center">
                    <CardTitle>{frame.name}</CardTitle>
                      <Button
                        variant="ghost" 
                        aria-label="Supprimer le tableau"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setFrameToDelete(frame);
                          setOpenModal(true);
                        }} 
                      >
                        <Trash 
                          width={20}
                          height={20}
                        />                    
                      </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {frame.description || "Pas de description"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Modale pour supprimer la frame */}
      {openModal && frameToDelete && (
        <DeleteFrameDialog
          open={openModal}
          onOpenChange={(open) => setOpenModal(open)}
          frame={frameToDelete}
          onClose={() => setOpenModal(false)}
        />

      )}
    </div>
  );
}