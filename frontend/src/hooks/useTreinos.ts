"use client";

import { getTreinos } from "@/lib/api";
import { CACHE_KEYS, readCache, writeCache } from "@/lib/cache";
import type { Treino } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type State = {
  treinos: Treino[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fromCache: boolean;
};

export function useTreinos() {
  const [state, setState] = useState<State>(() => {
    const cached = readCache<Treino[]>(CACHE_KEYS.treinos);
    return {
      treinos: cached ?? [],
      loading: !cached,
      refreshing: false,
      error: null,
      fromCache: !!cached,
    };
  });

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const cached = readCache<Treino[]>(CACHE_KEYS.treinos);
    const hasCache = !!cached?.length;

    setState((prev) => ({
      ...prev,
      loading: !hasCache && !options?.silent,
      refreshing: hasCache || !!options?.silent,
      error: hasCache ? null : prev.error,
      treinos: hasCache ? cached : prev.treinos,
      fromCache: hasCache,
    }));

    try {
      const data = await getTreinos();
      writeCache(CACHE_KEYS.treinos, data);
      setState({
        treinos: data,
        loading: false,
        refreshing: false,
        error: null,
        fromCache: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar treinos";
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: prev.treinos.length > 0 ? null : message,
        fromCache: prev.treinos.length > 0,
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: () => load({ silent: true }) };
}
