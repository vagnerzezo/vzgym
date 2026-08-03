"use client";

import { WeeklyCheckIn } from "@/components/WeeklyCheckIn";
import { Button } from "@/components/ui/button";
import type { Exercicio, Treino } from "@/lib/types";
import { ArrowLeft, ArrowRight, Dumbbell, Flame, ListChecks } from "lucide-react";
import { useState } from "react";

type Props = {
  treinos: Treino[];
  onTecnicaClick: (tecnicaId: string) => void;
  onExemploClick: (exercicio: Exercicio) => void;
  isCheckinCompleted: (date: string) => boolean;
  onMarkCheckin: (checkinDate: string) => Promise<unknown>;
};

function splitNome(nome: string) {
  const [titulo, ...resto] = nome.split(" - ");
  return {
    titulo: titulo?.trim() || nome,
    subtitulo: resto.join(" - ").trim(),
  };
}

function plural(total: number) {
  return `${total} ${total === 1 ? "exercício" : "exercícios"}`;
}

function TreinoDetail({
  treino,
  onBack,
  onTecnicaClick,
  onExemploClick,
}: {
  treino: Treino;
  onBack: () => void;
  onTecnicaClick: (tecnicaId: string) => void;
  onExemploClick: (exercicio: Exercicio) => void;
}) {
  const exercicios = treino.exercicios ?? [];
  const { titulo, subtitulo } = splitNome(treino.nome);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border shadow-sm">
        <div className="surface-gradient flex items-center gap-3 border-b bg-card px-4 py-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Dumbbell className="h-5 w-5 text-primary" aria-hidden />
          </span>
          <div className="flex w-full min-w-0 items-center justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="truncate text-lg font-bold leading-tight text-foreground">{titulo}</h2>
              <p className="truncate text-sm text-muted-foreground">
                {subtitulo || plural(exercicios.length)}
              </p>
            </div>
            <Button className="-ml-2 cursor-pointer gap-2" variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
        {exercicios.length === 0 ? (
          <p className="bg-card p-4 text-sm text-muted-foreground">Nenhum exercício neste grupo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-semibold">Exercício</th>
                  <th className="w-20 px-4 py-2.5 text-center font-semibold">Séries</th>
                  <th className="w-32 px-4 py-2.5 text-center font-semibold">Técnica</th>
                  <th className="w-24 px-4 py-2.5 text-center font-semibold">Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {exercicios.map((ex, rowIndex) => (
                  <tr
                    key={ex.id}
                    className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <td className="px-4 py-2.5 font-medium">{ex.nome}</td>
                    <td className="px-4 py-2.5 text-center">{ex.series}</td>
                    <td className="px-4 py-2.5 text-center">
                      {ex.tecnica ? (
                        <button
                          type="button"
                          onClick={() => onTecnicaClick(ex.tecnica!.id)}
                          className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline"
                        >
                          {ex.tecnica.nome}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => onExemploClick(ex)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export function TreinoTable({
  treinos,
  onTecnicaClick,
  onExemploClick,
  isCheckinCompleted,
  onMarkCheckin,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedTreino = treinos.find((t) => t.id === selectedId);

  if (treinos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
        Nenhum exercício cadastrado. Acesse Configurações para adicionar treinos e exercícios.
      </div>
    );
  }

  if (selectedTreino) {
    return (
      <TreinoDetail
        treino={selectedTreino}
        onBack={() => setSelectedId(null)}
        onTecnicaClick={onTecnicaClick}
        onExemploClick={onExemploClick}
      />
    );
  }

  const totalExercicios = treinos.reduce((acc, t) => acc + (t.exercicios?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Flame className="h-4 w-4" aria-hidden />
          Sua rotina
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Meus <span className="text-primary">Treinos</span>
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Escolha um treino para ver a lista completa de exercícios, séries, repetições e as
          técnicas aplicadas.
        </p>
      </header>

      <WeeklyCheckIn isCompleted={isCheckinCompleted} onMark={onMarkCheckin} />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {treinos.map((treino) => {
          const total = treino.exercicios?.length ?? 0;
          const { titulo, subtitulo } = splitNome(treino.nome);

          return (
            <button
              key={treino.id}
              type="button"
              onClick={() => setSelectedId(treino.id)}
              className="group surface-gradient relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-primary/10 opacity-60 blur-2xl transition-opacity group-hover:opacity-100"
              />

              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Dumbbell className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-base font-bold leading-tight">{titulo}</span>
                  {subtitulo && (
                    <span className="block truncate text-sm text-muted-foreground">{subtitulo}</span>
                  )}
                </div>
              </div>

              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <ListChecks className="h-3.5 w-3.5" aria-hidden />
                  {plural(total)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Abrir treino
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {plural(totalExercicios)} {totalExercicios === 1 ? "cadastrado" : "cadastrados"} no total.
      </p>
    </div>
  );
}
