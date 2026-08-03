"use client";

import { createCheckin, getCheckInStats, getWeekCheckins } from "@/lib/api";
import { normalizeCheckinDate, toLocalDateString } from "@/lib/checkin-dates";
import type { CheckInStats, TrainingCheckin } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type State = {
  checkins: TrainingCheckin[];
  stats: CheckInStats | null;
  loading: boolean;
  error: string | null;
};

const INITIAL: State = {
  checkins: [],
  stats: null,
  loading: true,
  error: null,
};

export function useCheckins() {
  const [state, setState] = useState<State>(INITIAL);
  const today = toLocalDateString();

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: prev.checkins.length === 0, error: null }));
    try {
      const [checkins, stats] = await Promise.all([
        getWeekCheckins(today),
        getCheckInStats(today),
      ]);
      setState({
        checkins: checkins.map((c) => ({
          ...c,
          checkinDate: normalizeCheckinDate(c.checkinDate),
        })),
        stats,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao carregar check-ins",
      }));
    }
  }, [today]);

  useEffect(() => {
    load();
  }, [load]);

  const markCheckin = useCallback(
    async (checkinDate: string) => {
      const saved = await createCheckin({ checkinDate });
      const normalized = {
        ...saved,
        checkinDate: normalizeCheckinDate(saved.checkinDate),
      };
      setState((prev) => {
        const without = prev.checkins.filter((c) => c.checkinDate !== checkinDate);
        return { ...prev, checkins: [...without, normalized] };
      });
      try {
        const stats = await getCheckInStats(today);
        setState((prev) => ({ ...prev, stats }));
      } catch {
        /* stats refresh is best-effort */
      }
      return normalized;
    },
    [today],
  );

  const isCompleted = useCallback(
    (date: string) =>
      state.checkins.some((c) => c.checkinDate === date && c.completed),
    [state.checkins],
  );

  return {
    ...state,
    reload: load,
    markCheckin,
    isCompleted,
  };
}
