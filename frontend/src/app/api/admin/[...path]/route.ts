const DEFAULT_ADMIN_SECRET = "vagnerzezo";

function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL
    || process.env.NEXT_PUBLIC_API_BASE_URL
    || "http://localhost:3002"
  );
}

function getAdminSecret() {
  return process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
}

async function proxyAdminRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${getApiBaseUrl()}/admin/${path.join("/")}${incomingUrl.search}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${getAdminSecret()}`);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
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
  return proxyAdminRequest(request, context);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyAdminRequest(request, context);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyAdminRequest(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyAdminRequest(request, context);
}
