const API_BASE = "/api/backend";
const FETCH_TIMEOUT_MS = 20_000;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeout])
    : timeout;

  const res = await fetch(url, { ...init, signal, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.erro || `Erro ${res.status}`);
  }
  return res.json();
}

export async function getTreinos() {
  return fetchJson<import("./types").Treino[]>(`${API_BASE}/treinos`);
}

export async function getTecnicas() {
  return fetchJson<import("./types").Tecnica[]>(`${API_BASE}/tecnicas`);
}

export async function getExercicios(params?: { treino_id?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.treino_id) qs.set("treino_id", params.treino_id);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return fetchJson<import("./types").Exercicio[]>(
    `${API_BASE}/exercicios${query ? `?${query}` : ""}`,
  );
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, { ...init, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.erro || `Erro ${res.status}`);
  }
  return res.json();
}

export async function getWeekCheckins(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchJson<import("./types").TrainingCheckin[]>(`${API_BASE}/checkins/week${qs}`);
}

export async function getCheckInStats(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchJson<import("./types").CheckInStats>(`${API_BASE}/checkins/stats${qs}`);
}

export async function createCheckin(data: { checkinDate: string; treinoId?: string }) {
  return fetchJson<import("./types").TrainingCheckin>(`${API_BASE}/checkins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
