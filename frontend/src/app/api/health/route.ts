import { getApiBaseUrl } from "@/lib/server-api";

export async function GET() {
  const apiBase = getApiBaseUrl();

  try {
    const res = await fetch(`${apiBase}/health`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    return Response.json({
      ok: res.ok,
      apiBase,
      health: data,
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        apiBase,
        erro: err instanceof Error ? err.message : "Falha ao conectar",
      },
      { status: 502 },
    );
  }
}
