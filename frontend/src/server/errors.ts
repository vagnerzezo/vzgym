export function handleApiError(err: unknown, fallback: string): Response {
  const error = err as { code?: string; message?: string };

  if (error.code === "P2025") {
    return Response.json({ erro: "Registro não encontrado" }, { status: 404 });
  }
  if (error.code === "P2003") {
    return Response.json({ erro: "Referência inválida" }, { status: 400 });
  }
  if (error.code === "P2002") {
    return Response.json({ erro: "Registro duplicado" }, { status: 409 });
  }
  if (error.message?.includes("obrigat")) {
    return Response.json({ erro: error.message }, { status: 400 });
  }

  console.error(err);
  return Response.json({ erro: fallback }, { status: 500 });
}
