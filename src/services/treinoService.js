const prisma = require("../prisma");

async function listTreinos() {
  return prisma.treino.findMany({
    orderBy: { ordem: "asc" },
    include: {
      exercicios: {
        orderBy: { ordem: "asc" },
        include: { tecnica: true },
      },
    },
  });
}

async function getTreino(id) {
  return prisma.treino.findUnique({
    where: { id },
    include: {
      exercicios: {
        orderBy: { ordem: "asc" },
        include: { tecnica: true },
      },
    },
  });
}

async function createTreino(data) {
  const { nome, ordem } = data;
  if (!nome?.trim()) throw new Error("Nome do treino é obrigatório");

  const maxOrdem = await prisma.treino.aggregate({ _max: { ordem: true } });
  return prisma.treino.create({
    data: {
      nome: nome.trim(),
      ordem: ordem ?? (maxOrdem._max.ordem ?? -1) + 1,
    },
  });
}

async function updateTreino(id, data) {
  const { nome, ordem } = data;
  const update = {};
  if (nome !== undefined) update.nome = nome.trim();
  if (ordem !== undefined) update.ordem = Number(ordem);

  return prisma.treino.update({ where: { id }, data: update });
}

async function deleteTreino(id) {
  return prisma.treino.delete({ where: { id } });
}

module.exports = {
  listTreinos,
  getTreino,
  createTreino,
  updateTreino,
  deleteTreino,
};
