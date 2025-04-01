// /app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

// Simulation de données, à remplacer par fetch Supabase
const mockBoards = [
  { id: "board-1", name: "Projet Client A" },
  { id: "board-2", name: "Refonte Marketing" },
  { id: "board-3", name: "Trello Clone" },
];

export default function DashboardPage() {
  const [boards, setBoards] = useState<typeof mockBoards>([]);

  useEffect(() => {
    // Ici, tu pourrais faire un appel à Supabase pour récupérer les tableaux
    setBoards(mockBoards);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Tableaux</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau tableau
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link key={board.id} href={`/board/${board.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Accéder au tableau</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
