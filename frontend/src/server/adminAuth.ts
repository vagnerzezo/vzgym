const DEFAULT_ADMIN_SECRET = "vagnerzezo";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
}

export function requireAdmin(request: Request): Response | null {
  const secret = getAdminSecret();
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const key = bearer || request.headers.get("x-admin-key") || "";

  if (!key || key !== secret) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 });
  }

  return null;
}
