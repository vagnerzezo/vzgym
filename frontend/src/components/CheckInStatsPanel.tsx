"use client";

import type { CheckInStats } from "@/lib/types";
import { CalendarDays, CheckCircle2, Flame, Percent, Trophy, type LucideIcon } from "lucide-react";

type Props = {
  stats: CheckInStats | null;
  loading?: boolean;
};

function StatItem({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-lg font-bold leading-tight tabular-nums text-foreground">
          {value}
        </p>
        {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function CheckInStatsPanel({ stats, loading }: Props) {
  if (loading && !stats) {
    return (
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-busy>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl border bg-muted/30" />
        ))}
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section aria-label="Estatísticas de check-in" className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Consistência
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatItem
          icon={CheckCircle2}
          label="Mês"
          value={String(stats.monthTotal)}
          hint="check-ins no mês"
        />
        <StatItem
          icon={CalendarDays}
          label="Semana"
          value={String(stats.weekTotal)}
          hint="check-ins na semana"
        />
        <StatItem
          icon={Flame}
          label="Streak"
          value={`${stats.currentStreak}d`}
          hint="dias consecutivos"
        />
        <StatItem
          icon={Percent}
          label="Mês %"
          value={`${stats.monthPercent}%`}
          hint="dias com treino"
        />
        <StatItem
          icon={Trophy}
          label="Recorde"
          value={`${stats.bestStreak}d`}
          hint="melhor sequência"
        />
      </div>
    </section>
  );
}
