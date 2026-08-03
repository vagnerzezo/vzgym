import { prisma } from "@/server/prisma";

export async function listTreinos() {
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

export async function getTreino(id: string) {
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

export async function createTreino(data: { nome?: string; ordem?: number }) {
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

export async function updateTreino(
  id: string,
  data: { nome?: string; ordem?: number },
) {
  const { nome, ordem } = data;
  const update: { nome?: string; ordem?: number } = {};
  if (nome !== undefined) update.nome = nome.trim();
  if (ordem !== undefined) update.ordem = Number(ordem);

  return prisma.treino.update({ where: { id }, data: update });
}

export async function deleteTreino(id: string) {
  return prisma.treino.delete({ where: { id } });
}
