"use client";

import { Button } from "@/components/ui/button";
import type { Exercicio, Treino } from "@/lib/types";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { useState } from "react";

type Props = {
  treinos: Treino[];
  onTecnicaClick: (tecnicaId: string) => void;
  onExemploClick: (exercicio: Exercicio) => void;
};

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

  return (
    <div className="space-y-4">
      <Button className="cursor-pointer -ml-2 gap-2" variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <section className="overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-card px-4 py-3 text-lg font-bold text-foreground">
          {treino.nome}
        </div>
        {exercicios.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhum exercício neste grupo.</p>
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
                          className="font-medium text-primary underline-offset-2 hover:underline cursor-pointer"
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

export function TreinoTable({ treinos, onTecnicaClick, onExemploClick }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedTreino = treinos.find((t) => t.id === selectedId);

  if (treinos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
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

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-wrap">
      {treinos.map((treino) => {
        const exercicios = treino.exercicios ?? [];
        const label = treino.nome.split(" - ")[0]?.trim() || treino.nome;

        return (
          <button
            key={treino.id}
            type="button"
            onClick={() => setSelectedId(treino.id)}
            className="flex min-h-28 flex-col cursor-pointer items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:border-primary hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-w-0 md:flex-1"
          >
            <Dumbbell className="h-6 w-6 text-primary" aria-hidden />
            <span className="text-lg font-bold leading-tight">{label}</span>
            <span className="line-clamp-2 text-xs text-muted-foreground">{treino.nome}</span>
            <span className="text-xs text-muted-foreground">
              {exercicios.length} {exercicios.length === 1 ? "exercício" : "exercícios"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
