"use client";

import { CheckInConfirmModal } from "@/components/CheckInConfirmModal";
import { getCurrentWeekDays, type WeekDay } from "@/lib/checkin-dates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isCompleted: (date: string) => boolean;
  onMark: (checkinDate: string) => Promise<unknown>;
};

export function WeeklyCheckIn({ isCompleted, onMark }: Props) {
  const days = getCurrentWeekDays();
  const [pending, setPending] = useState<WeekDay | null>(null);
  const [saving, setSaving] = useState(false);
  const [justMarked, setJustMarked] = useState<string | null>(null);

  function handleDayClick(day: WeekDay) {
    if (day.isFuture) {
      toast.message("Aguarde esse dia chegar para marcar o check-in.");
      return;
    }
    if (isCompleted(day.date)) {
      toast.message(`Check-in de ${day.label} já registrado.`);
      return;
    }
    setPending(day);
  }

  async function handleConfirm() {
    if (!pending) return;
    setSaving(true);
    try {
      await onMark(pending.date);
      setJustMarked(pending.date);
      toast.success(`Treino de ${pending.label} marcado!`);
      setPending(null);
      window.setTimeout(() => setJustMarked(null), 700);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar o check-in. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className="rounded-2xl border border-border/50 bg-card/50 px-3 py-3 sm:px-4"
        role="group"
        aria-label="Check-in semanal"
      >
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const done = isCompleted(day.date);
            const pop = justMarked === day.date;
            return (
              <button
                key={day.date}
                type="button"
                disabled={day.isFuture}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl px-0.5 py-1.5 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  day.isFuture
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:bg-secondary/60",
                  day.isToday && !done && "bg-primary/10",
                )}
                aria-label={`${day.label}${done ? ", realizado" : ", não realizado"}`}
                aria-pressed={done}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wide sm:text-xs",
                    day.isToday ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {day.label}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-9 sm:w-9",
                    done
                      ? "scale-100 border-primary bg-primary text-primary-foreground shadow-[0_0_0_3px] shadow-primary/20"
                      : "border-muted-foreground/35 bg-transparent text-transparent",
                    pop && "animate-[checkin-pop_0.45s_ease-out]",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 transition-opacity duration-300",
                      done ? "opacity-100" : "opacity-0",
                    )}
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <CheckInConfirmModal
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !saving) setPending(null);
        }}
        dayLabel={pending?.label ?? ""}
        saving={saving}
        onConfirm={handleConfirm}
      />
    </>
  );
}
