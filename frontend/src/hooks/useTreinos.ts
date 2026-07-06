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

const INITIAL_STATE: State = {
  treinos: [],
  loading: true,
  refreshing: false,
  error: null,
  fromCache: false,
};

export function useTreinos() {
  const [state, setState] = useState<State>(INITIAL_STATE);

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
      let message = err instanceof Error ? err.message : "Erro ao carregar treinos";
      if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
        message = "A API demorou para responder. Rode npm run dev:all na raiz do projeto.";
      }
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
    const cached = readCache<Treino[]>(CACHE_KEYS.treinos);
    if (cached?.length) {
      setState((prev) => ({
        ...prev,
        treinos: cached,
        loading: false,
        fromCache: true,
      }));
    }

    load({ silent: !!cached?.length });
  }, [load]);

  return { ...state, reload: () => load({ silent: true }) };
}
