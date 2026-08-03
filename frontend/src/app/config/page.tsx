"use client";

import { CheckInStatsPanel } from "@/components/CheckInStatsPanel";
import { ExerciciosPanel } from "@/components/config/ExerciciosPanel";
import { TecnicasPanel } from "@/components/config/TecnicasPanel";
import { TreinosPanel } from "@/components/config/TreinosPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckins } from "@/hooks/useCheckins";
import { getTreinos, getTecnicas } from "@/lib/api";
import { CACHE_KEYS, invalidateWorkoutCache, readCache, writeCache } from "@/lib/cache";
import type { Tecnica, Treino } from "@/lib/types";
import { House, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConfigPage() {
  const [treinos, setTreinos] = useState<Treino[]>(() => readCache(CACHE_KEYS.treinos) ?? []);
  const [tecnicas, setTecnicas] = useState<Tecnica[]>(() => readCache(CACHE_KEYS.tecnicas) ?? []);
  const { stats, loading: checkInsLoading } = useCheckins();

  const refresh = useCallback(async () => {
    try {
      const [t, tc] = await Promise.all([getTreinos(), getTecnicas()]);
      writeCache(CACHE_KEYS.treinos, t);
      writeCache(CACHE_KEYS.tecnicas, tc);
      setTreinos(t);
      setTecnicas(tc);
    } catch (err) {
      if (treinos.length === 0 && tecnicas.length === 0) {
        toast.error(err instanceof Error ? err.message : "Erro ao carregar dados");
      }
    }
  }, [treinos.length, tecnicas.length]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky-header sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">
            <Image src="/logob.svg" alt="`vzgym`" width={64} height={44} className="rounded-md" />
          </h1>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
            >
              <House className="h-4 w-4" aria-hidden />
              Treinos
            </Link>
            <span
              aria-current="page"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
            >
              <Settings className="h-4 w-4" aria-hidden />
              Configurações
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="exercicios">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
            <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
            <TabsTrigger value="treinos">Grupos</TabsTrigger>
            <TabsTrigger value="consistencia">Consistência</TabsTrigger>
          </TabsList>

          <TabsContent value="exercicios">
            <ExerciciosPanel
              treinos={treinos}
              tecnicas={tecnicas}
              onRefresh={() => {
                invalidateWorkoutCache();
                return refresh();
              }}
            />
          </TabsContent>
          <TabsContent value="tecnicas">
            <TecnicasPanel
              onRefresh={() => {
                invalidateWorkoutCache();
                return refresh();
              }}
            />
          </TabsContent>
          <TabsContent value="treinos">
            <TreinosPanel
              onRefresh={() => {
                invalidateWorkoutCache();
                return refresh();
              }}
            />
          </TabsContent>
          <TabsContent value="consistencia">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Acompanhe seus check-ins, streak e o histórico de consistência nos treinos.
              </p>
              <CheckInStatsPanel stats={stats} loading={checkInsLoading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
