"use client";

import { ExemploModal } from "@/components/ExemploModal";
import { TreinoTableSkeleton } from "@/components/LoadingSkeletons";
import { TecnicaModal } from "@/components/TecnicaModal";
import { TreinoTable } from "@/components/TreinoTable";
import { Button } from "@/components/ui/button";
import { useCheckins } from "@/hooks/useCheckins";
import { useTreinos } from "@/hooks/useTreinos";
import type { Exercicio, Tecnica } from "@/lib/types";
import { House, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const { treinos, loading, error, reload } = useTreinos();
  const { isCompleted, markCheckin } = useCheckins();
  const [selectedTecnica, setSelectedTecnica] = useState<Tecnica | null>(null);
  const [tecnicaModalOpen, setTecnicaModalOpen] = useState(false);
  const [selectedExercicio, setSelectedExercicio] = useState<Exercicio | null>(null);
  const [exemploModalOpen, setExemploModalOpen] = useState(false);

  function handleTecnicaClick(tecnicaId: string) {
    for (const treino of treinos) {
      for (const ex of treino.exercicios ?? []) {
        if (ex.tecnica?.id === tecnicaId) {
          setSelectedTecnica(ex.tecnica);
          setTecnicaModalOpen(true);
          return;
        }
      }
    }
  }

  async function handleRetry() {
    await reload();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky-header sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              <Image src="/logob.svg" alt="vzgym" width={64} height={44} className="rounded-md fill-[#fff]" />
            </h1>
          </div>
          <nav className="flex items-center gap-1">
            <span
              aria-current="page"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
            >
              <House className="h-4 w-4" aria-hidden />
              Treinos
            </span>
            <Link
              href="/config"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
            >
              <Settings className="h-4 w-4" aria-hidden />
              Configurações
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {loading ? (
          <TreinoTableSkeleton />
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="mb-2 font-medium text-destructive">Erro ao conectar na API</p>
            <p className="mb-4 text-sm text-muted-foreground">{error}</p>
            <Button className="cursor-pointer" variant="outline" onClick={handleRetry}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <TreinoTable
            treinos={treinos}
            onTecnicaClick={handleTecnicaClick}
            onExemploClick={(ex) => {
              setSelectedExercicio(ex);
              setExemploModalOpen(true);
            }}
            isCheckinCompleted={isCompleted}
            onMarkCheckin={markCheckin}
          />
        )}
      </main>

      <TecnicaModal
        tecnica={selectedTecnica}
        open={tecnicaModalOpen}
        onOpenChange={setTecnicaModalOpen}
      />
      <ExemploModal
        exercicio={selectedExercicio}
        open={exemploModalOpen}
        onOpenChange={setExemploModalOpen}
      />
    </div>
  );
}
