import { prisma } from "@/server/prisma";

const includeRelations = {
  treino: true,
  tecnica: true,
} as const;

type ExercicioInput = {
  treinoId?: string;
  nome?: string;
  series?: string;
  tecnicaId?: string | null;
  video?: string | null;
  musculo?: string;
  passoAPasso?: string | null;
  dicas?: string | null;
  observacoes?: string | null;
  ordem?: number;
};

export async function listExercicios(
  filters: { treinoId?: string; search?: string } = {},
) {
  const { treinoId, search } = filters;
  const where: Record<string, unknown> = {};

  if (treinoId) where.treinoId = treinoId;
  if (search?.trim()) {
    where.OR = [
      { nome: { contains: search.trim(), mode: "insensitive" } },
      { musculo: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  return prisma.exercicio.findMany({
    where,
    orderBy: [{ treino: { ordem: "asc" } }, { ordem: "asc" }],
    include: includeRelations,
  });
}

export async function getExercicio(id: string) {
  return prisma.exercicio.findUnique({
    where: { id },
    include: includeRelations,
  });
}

export async function createExercicio(data: ExercicioInput) {
  const {
    treinoId,
    nome,
    series,
    tecnicaId,
    video,
    musculo,
    passoAPasso,
    dicas,
    observacoes,
    ordem,
  } = data;

  if (!treinoId) throw new Error("Grupo de treino é obrigatório");
  if (!nome?.trim()) throw new Error("Nome do exercício é obrigatório");
  if (!series?.trim()) throw new Error("Séries são obrigatórias");
  if (!musculo?.trim()) throw new Error("Músculo principal é obrigatório");

  const maxOrdem = await prisma.exercicio.aggregate({
    where: { treinoId },
    _max: { ordem: true },
  });

  return prisma.exercicio.create({
    data: {
      treinoId,
      nome: nome.trim(),
      series: series.trim(),
      tecnicaId: tecnicaId || null,
      video: video?.trim() || null,
      musculo: musculo.trim(),
      passoAPasso: passoAPasso?.trim() || null,
      dicas: dicas?.trim() || null,
      observacoes: observacoes?.trim() || null,
      ordem: ordem ?? (maxOrdem._max.ordem ?? -1) + 1,
    },
    include: includeRelations,
  });
}

export async function updateExercicio(id: string, data: ExercicioInput) {
  const fields = [
    "treinoId",
    "nome",
    "series",
    "tecnicaId",
    "video",
    "musculo",
    "passoAPasso",
    "dicas",
    "observacoes",
    "ordem",
  ] as const;

  const update: Record<string, unknown> = {};

  for (const field of fields) {
    if (data[field] !== undefined) {
      const value = data[field];
      if (typeof value === "string") {
        update[field] = value.trim() || (field === "tecnicaId" ? null : value.trim());
      } else {
        update[field] = value;
      }
    }
  }

  if (update.tecnicaId === "") update.tecnicaId = null;
  if (update.nome === "") throw new Error("Nome do exercício é obrigatório");

  return prisma.exercicio.update({
    where: { id },
    data: update,
    include: includeRelations,
  });
}

export async function deleteExercicio(id: string) {
  return prisma.exercicio.delete({ where: { id } });
}
