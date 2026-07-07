"use client";

import { ExemploModal } from "@/components/ExemploModal";
import { TecnicaModal } from "@/components/TecnicaModal";
import { TreinoTable } from "@/components/TreinoTable";
import { Button } from "@/components/ui/button";
import { useTreinos } from "@/hooks/useTreinos";
import type { Exercicio, Tecnica } from "@/lib/types";
import { RefreshCw, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const { treinos, loading, refreshing, error, reload } = useTreinos();
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
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              <Image src="/logo.png" alt="vzgym" width={64} height={44} className="rounded-md" />
            </h1>
            {refreshing && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Atualizando" />
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/config">
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {loading ? (
          <p className="text-center text-muted-foreground">Carregando ficha de treino...</p>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="mb-2 font-medium text-destructive">Erro ao conectar na API</p>
            <p className="mb-4 text-sm text-muted-foreground">{error}</p>
            <Button className="cursor-pointer" variant="outline" onClick={handleRetry}>Tentar novamente</Button>
          </div>
        ) : (
          <TreinoTable
            treinos={treinos}
            onTecnicaClick={handleTecnicaClick}
            onExemploClick={(ex) => {
              setSelectedExercicio(ex);
              setExemploModalOpen(true);
            }}
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
