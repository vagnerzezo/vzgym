function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL
    || process.env.NEXT_PUBLIC_API_BASE_URL
    || "http://localhost:3002"
  );
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${getApiBaseUrl()}/${path.join("/")}${incomingUrl.search}`;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.method !== "GET" && request.method !== "HEAD"
      ? { "Content-Type": request.headers.get("content-type") || "application/json" }
      : undefined,
    body: request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined,
    cache: "no-store",
  });

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
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
