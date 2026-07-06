"use client";

import { ExerciciosPanel } from "@/components/config/ExerciciosPanel";
import { TecnicasPanel } from "@/components/config/TecnicasPanel";
import { TreinosPanel } from "@/components/config/TreinosPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTreinos, getTecnicas } from "@/lib/api";
import type { Tecnica, Treino } from "@/lib/types";
import { ArrowLeft, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConfigPage() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [tecnicas, setTecnicas] = useState<Tecnica[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [t, tc] = await Promise.all([getTreinos(), getTecnicas()]);
      setTreinos(t);
      setTecnicas(tc);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar dados");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Configurações</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="exercicios">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
            <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
            <TabsTrigger value="treinos">Grupos</TabsTrigger>
          </TabsList>

          <TabsContent value="exercicios">
            <ExerciciosPanel treinos={treinos} tecnicas={tecnicas} onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="tecnicas">
            <TecnicasPanel onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="treinos">
            <TreinosPanel onRefresh={refresh} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
