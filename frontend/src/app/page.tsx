"use client";

import { ExemploModal } from "@/components/ExemploModal";
import { TecnicaModal } from "@/components/TecnicaModal";
import { TreinoTable } from "@/components/TreinoTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTreinos } from "@/hooks/useTreinos";
import type { Exercicio, Tecnica } from "@/lib/types";
import { Dumbbell, RefreshCw, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const { treinos, loading, refreshing, error, reload } = useTreinos();
  const [search, setSearch] = useState("");
  const [filterTreino, setFilterTreino] = useState("all");
  const [selectedTecnica, setSelectedTecnica] = useState<Tecnica | null>(null);
  const [tecnicaModalOpen, setTecnicaModalOpen] = useState(false);
  const [selectedExercicio, setSelectedExercicio] = useState<Exercicio | null>(null);
  const [exemploModalOpen, setExemploModalOpen] = useState(false);

  const filteredTreinos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return treinos
      .filter((t) => filterTreino === "all" || t.id === filterTreino)
      .map((t) => ({
        ...t,
        exercicios: (t.exercicios ?? []).filter((ex) => {
          if (!term) return true;
          return (
            ex.nome.toLowerCase().includes(term)
            || ex.musculo.toLowerCase().includes(term)
            || ex.tecnica?.nome.toLowerCase().includes(term)
          );
        }),
      }))
      .filter((t) => filterTreino !== "all" || t.exercicios.length > 0 || !term);
  }, [treinos, search, filterTreino]);

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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Pesquisar exercício, músculo ou técnica..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterTreino} onValueChange={setFilterTreino}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filtrar treino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os treinos</SelectItem>
              {treinos.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando ficha de treino...</p>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="mb-2 font-medium text-destructive">Erro ao conectar na API</p>
            <p className="mb-4 text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={handleRetry}>Tentar novamente</Button>
          </div>
        ) : (
          <TreinoTable
            treinos={filteredTreinos}
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
