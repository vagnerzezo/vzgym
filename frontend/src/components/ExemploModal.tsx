"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Exercicio } from "@/lib/types";
import { formatList, isVideoUrl } from "@/lib/utils";

type Props = {
  exercicio: Exercicio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExemploModal({ exercicio, open, onOpenChange }: Props) {
  if (!exercicio) return null;

  const passos = formatList(exercicio.passoAPasso);
  const dicas = formatList(exercicio.dicas);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pr-8">
          <DialogTitle className="break-words text-lg sm:text-xl">
            {exercicio.nome}
          </DialogTitle>
        </DialogHeader>
        <div className="min-w-0 space-y-4 text-sm">
          {exercicio.video && (
            <div className="overflow-hidden rounded-lg border bg-muted/30">
              {isVideoUrl(exercicio.video) ? (
                <video
                  src={exercicio.video}
                  controls
                  className="aspect-video max-h-52 w-full object-contain sm:max-h-72"
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exercicio.video}
                  alt={exercicio.nome}
                  className="mx-auto max-h-52 w-full object-contain sm:max-h-72"
                />
              )}
            </div>
          )}
          <section className="min-w-0">
            <h3 className="mb-1 font-semibold">Músculos trabalhados</h3>
            <p className="break-words text-muted-foreground">{exercicio.musculo}</p>
          </section>
          {passos.length > 0 && (
            <section className="min-w-0">
              <h3 className="mb-1 font-semibold">Passo a passo</h3>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                {passos.map((item) => (
                  <li key={item} className="break-words">
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {dicas.length > 0 && (
            <section className="min-w-0">
              <h3 className="mb-1 font-semibold">Dicas importantes</h3>
              <ul className="space-y-1 text-muted-foreground">
                {dicas.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="shrink-0 text-primary">•</span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {exercicio.observacoes && (
            <section className="min-w-0">
              <h3 className="mb-1 font-semibold">Observações</h3>
              <p className="break-all text-muted-foreground">{exercicio.observacoes}</p>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
