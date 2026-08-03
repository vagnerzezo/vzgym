"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayLabel: string;
  saving: boolean;
  onConfirm: () => void;
};

export function CheckInConfirmModal({
  open,
  onOpenChange,
  dayLabel,
  saving,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">💪 Bora treinar?</DialogTitle>
          <DialogDescription className="pt-1 text-left text-base text-muted-foreground">
            Deseja marcar que você realizou o treino deste dia
            {dayLabel ? ` (${dayLabel})` : ""}?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Não
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            disabled={saving}
            onClick={onConfirm}
          >
            {saving ? "Salvando…" : "Sim"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
