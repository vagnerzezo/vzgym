const PREFIX = "vzgym:";

type CacheEntry<T> = {
  data: T;
  savedAt: number;
};

function storageKey(key: string) {
  return `${PREFIX}${key}`;
}

export function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    return entry.data ?? null;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry<T> = { data, savedAt: Date.now() };
    localStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // quota exceeded — ignora silenciosamente
  }
}

export function removeCache(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(key));
}

export function clearAppCache() {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

export const CACHE_KEYS = {
  treinos: "treinos",
  tecnicas: "tecnicas",
  exercicios: "exercicios",
} as const;

export function invalidateWorkoutCache() {
  removeCache(CACHE_KEYS.treinos);
  removeCache(CACHE_KEYS.tecnicas);
  removeCache(CACHE_KEYS.exercicios);
}
