"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Tecnica } from "@/lib/types";
import { formatList } from "@/lib/utils";

type Props = {
  tecnica: Tecnica | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TecnicaModal({ tecnica, open, onOpenChange }: Props) {
  if (!tecnica) return null;

  const passos = formatList(tecnica.comoExecutar);
  const beneficios = formatList(tecnica.beneficios);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pr-8">
          <DialogTitle className="break-words text-lg text-primary sm:text-xl">
            {tecnica.nome}
          </DialogTitle>
        </DialogHeader>
        <div className="min-w-0 space-y-4 text-sm">
          <section className="min-w-0">
            <h3 className="mb-1 font-semibold text-foreground">Descrição</h3>
            <p className="break-words text-muted-foreground">{tecnica.descricao}</p>
          </section>
          {tecnica.quandoUtilizar && (
            <section className="min-w-0">
              <h3 className="mb-1 font-semibold text-foreground">Quando utilizar</h3>
              <p className="break-words text-muted-foreground">{tecnica.quandoUtilizar}</p>
            </section>
          )}
          <section className="min-w-0">
            <h3 className="mb-1 font-semibold text-foreground">Como fazer</h3>
            <ul className="space-y-1 text-muted-foreground">
              {passos.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="min-w-0">
            <h3 className="mb-1 font-semibold text-foreground">Benefícios</h3>
            <ul className="space-y-1 text-muted-foreground">
              {beneficios.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </section>
          {tecnica.observacoes && (
            <section className="min-w-0">
              <h3 className="mb-1 font-semibold text-foreground">Observações</h3>
              <p className="break-all text-muted-foreground">{tecnica.observacoes}</p>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
