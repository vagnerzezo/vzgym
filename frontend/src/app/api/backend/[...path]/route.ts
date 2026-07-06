import { getApiBaseUrl } from "@/lib/server-api";

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const apiBase = getApiBaseUrl();
  const targetUrl = `${apiBase}/${path.join("/")}${incomingUrl.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.method !== "GET" && request.method !== "HEAD"
        ? { "Content-Type": request.headers.get("content-type") || "application/json" }
        : undefined,
      body: request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("[API proxy]", targetUrl, err);
    return Response.json(
      {
        erro: "Não foi possível conectar na API",
        api: apiBase,
        detalhe: err instanceof Error ? err.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}
