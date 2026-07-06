"use client";

import { Button } from "@/components/ui/button";
import type { Exercicio, Treino } from "@/lib/types";

const GROUP_COLORS = [
  "bg-emerald-600",
  "bg-blue-600",
  "bg-violet-600",
  "bg-orange-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-amber-600",
];

type Props = {
  treinos: Treino[];
  onTecnicaClick: (tecnicaId: string) => void;
  onExemploClick: (exercicio: Exercicio) => void;
};

export function TreinoTable({ treinos, onTecnicaClick, onExemploClick }: Props) {
  if (treinos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Nenhum exercício cadastrado. Acesse Configurações para adicionar treinos e exercícios.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {treinos.map((treino, groupIndex) => {
        const color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];
        const exercicios = treino.exercicios ?? [];

        return (
          <section key={treino.id} className="overflow-hidden rounded-xl border shadow-sm">
            <div className={`${color} px-4 py-3 text-lg font-bold text-white`}>
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
                              className="font-medium text-primary underline-offset-2 hover:underline"
                            >
                              {ex.tecnica.nome}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <Button
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
        );
      })}
    </div>
  );
}
