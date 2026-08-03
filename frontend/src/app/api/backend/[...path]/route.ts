import { handleApiError } from "@/server/errors";
import * as checkInService from "@/server/services/checkInService";
import * as exercicioService from "@/server/services/exercicioService";
import * as tecnicaService from "@/server/services/tecnicaService";
import * as treinoService from "@/server/services/treinoService";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handleBackend(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { path = [] } = await context.params;
  const segments = path.filter(Boolean);
  const method = request.method;
  const url = new URL(request.url);

  try {
    if (segments.length === 1 && segments[0] === "health" && method === "GET") {
      return Response.json({ ok: true });
    }

    if (segments.length === 1 && segments[0] === "treinos" && method === "GET") {
      const treinos = await treinoService.listTreinos();
      return Response.json(treinos);
    }

    if (segments.length === 1 && segments[0] === "tecnicas" && method === "GET") {
      const tecnicas = await tecnicaService.listTecnicas();
      return Response.json(tecnicas);
    }

    if (
      segments.length === 2 &&
      segments[0] === "tecnicas" &&
      method === "GET"
    ) {
      const tecnica = await tecnicaService.getTecnica(segments[1]);
      if (!tecnica) {
        return Response.json({ erro: "Técnica não encontrada" }, { status: 404 });
      }
      return Response.json(tecnica);
    }

    if (segments.length === 1 && segments[0] === "exercicios" && method === "GET") {
      const exercicios = await exercicioService.listExercicios({
        treinoId: url.searchParams.get("treino_id") || undefined,
        search: url.searchParams.get("search") || undefined,
      });
      return Response.json(exercicios);
    }

    if (
      segments.length === 2 &&
      segments[0] === "exercicios" &&
      method === "GET"
    ) {
      const exercicio = await exercicioService.getExercicio(segments[1]);
      if (!exercicio) {
        return Response.json({ erro: "Exercício não encontrado" }, { status: 404 });
      }
      return Response.json(exercicio);
    }

    if (segments[0] === "checkins") {
      if (segments.length === 1 && method === "GET") {
        const checkins = await checkInService.listCheckins({
          treinoId:
            url.searchParams.get("treino_id") ||
            url.searchParams.get("workout_id") ||
            undefined,
          from: url.searchParams.get("from") || undefined,
          to: url.searchParams.get("to") || undefined,
        });
        return Response.json(checkins);
      }

      if (segments.length === 2 && segments[1] === "week" && method === "GET") {
        const checkins = await checkInService.listWeekCheckins({
          date: url.searchParams.get("date") || undefined,
        });
        return Response.json(checkins);
      }

      if (segments.length === 2 && segments[1] === "stats" && method === "GET") {
        const stats = await checkInService.getStats({
          date: url.searchParams.get("date") || undefined,
        });
        return Response.json(stats);
      }

      if (segments.length === 1 && method === "POST") {
        const body = (await request.json().catch(() => ({}))) as Record<
          string,
          string | undefined
        >;
        const checkin = await checkInService.createCheckin({
          treinoId: body.treinoId || body.workout_id || body.workoutId,
          checkinDate: body.checkinDate || body.checkin_date,
        });
        return Response.json(checkin, { status: 201 });
      }
    }

    return Response.json({ erro: "Rota não encontrada" }, { status: 404 });
  } catch (err) {
    return handleApiError(err, "Erro na API");
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handleBackend(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleBackend(request, context);
}
