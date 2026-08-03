import { handleApiError } from "@/server/errors";
import * as exercicioService from "@/server/services/exercicioService";
import * as tecnicaService from "@/server/services/tecnicaService";
import * as treinoService from "@/server/services/treinoService";

type RouteContext = { params: Promise<{ path: string[] }> };

async function readBody(request: Request) {
  return (await request.json().catch(() => ({}))) as Record<string, unknown>;
}

async function handleAdmin(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  // Paridade com o proxy antigo: o browser chama /api/admin sem Bearer.
  const { path = [] } = await context.params;
  const segments = path.filter(Boolean);
  const method = request.method;
  const url = new URL(request.url);

  try {
    if (segments.length === 1 && segments[0] === "treinos" && method === "GET") {
      return Response.json(await treinoService.listTreinos());
    }
    if (segments.length === 1 && segments[0] === "treinos" && method === "POST") {
      const body = await readBody(request);
      const treino = await treinoService.createTreino(
        body as { nome?: string; ordem?: number },
      );
      return Response.json(treino, { status: 201 });
    }
    if (segments.length === 2 && segments[0] === "treinos" && method === "PUT") {
      const body = await readBody(request);
      const treino = await treinoService.updateTreino(
        segments[1],
        body as { nome?: string; ordem?: number },
      );
      return Response.json(treino);
    }
    if (segments.length === 2 && segments[0] === "treinos" && method === "DELETE") {
      return Response.json(await treinoService.deleteTreino(segments[1]));
    }

    if (segments.length === 1 && segments[0] === "tecnicas" && method === "GET") {
      return Response.json(await tecnicaService.listTecnicas());
    }
    if (segments.length === 1 && segments[0] === "tecnicas" && method === "POST") {
      const body = await readBody(request);
      const tecnica = await tecnicaService.createTecnica(body);
      return Response.json(tecnica, { status: 201 });
    }
    if (segments.length === 2 && segments[0] === "tecnicas" && method === "PUT") {
      const body = await readBody(request);
      return Response.json(await tecnicaService.updateTecnica(segments[1], body));
    }
    if (segments.length === 2 && segments[0] === "tecnicas" && method === "DELETE") {
      return Response.json(await tecnicaService.deleteTecnica(segments[1]));
    }

    if (segments.length === 1 && segments[0] === "exercicios" && method === "GET") {
      const exercicios = await exercicioService.listExercicios({
        treinoId: url.searchParams.get("treino_id") || undefined,
        search: url.searchParams.get("search") || undefined,
      });
      return Response.json(exercicios);
    }
    if (segments.length === 1 && segments[0] === "exercicios" && method === "POST") {
      const body = await readBody(request);
      const exercicio = await exercicioService.createExercicio(body);
      return Response.json(exercicio, { status: 201 });
    }
    if (segments.length === 2 && segments[0] === "exercicios" && method === "PUT") {
      const body = await readBody(request);
      return Response.json(
        await exercicioService.updateExercicio(segments[1], body),
      );
    }
    if (segments.length === 2 && segments[0] === "exercicios" && method === "DELETE") {
      return Response.json(await exercicioService.deleteExercicio(segments[1]));
    }

    return Response.json({ erro: "Rota não encontrada" }, { status: 404 });
  } catch (err) {
    return handleApiError(err, "Erro na API admin");
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handleAdmin(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleAdmin(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleAdmin(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleAdmin(request, context);
}
