const prisma = require("../prisma");

const includeRelations = {
  treino: true,
  tecnica: true,
};

async function listExercicios(filters = {}) {
  const { treinoId, search } = filters;
  const where = {};

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

async function getExercicio(id) {
  return prisma.exercicio.findUnique({
    where: { id },
    include: includeRelations,
  });
}

async function createExercicio(data) {
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

async function updateExercicio(id, data) {
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
  ];
  const update = {};

  for (const field of fields) {
    if (data[field] !== undefined) {
      if (typeof data[field] === "string") {
        update[field] = data[field].trim() || (field === "tecnicaId" ? null : data[field].trim());
      } else {
        update[field] = data[field];
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

async function deleteExercicio(id) {
  return prisma.exercicio.delete({ where: { id } });
}

module.exports = {
  listExercicios,
  getExercicio,
  createExercicio,
  updateExercicio,
  deleteExercicio,
};
