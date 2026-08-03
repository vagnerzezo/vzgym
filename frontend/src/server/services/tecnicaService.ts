import { prisma } from "@/server/prisma";

type TecnicaInput = {
  nome?: string;
  descricao?: string;
  comoExecutar?: string;
  beneficios?: string;
  quandoUtilizar?: string | null;
  observacoes?: string | null;
};

export async function listTecnicas() {
  return prisma.tecnica.findMany({ orderBy: { nome: "asc" } });
}

export async function getTecnica(id: string) {
  return prisma.tecnica.findUnique({ where: { id } });
}

export async function createTecnica(data: TecnicaInput) {
  const { nome, descricao, comoExecutar, beneficios, quandoUtilizar, observacoes } =
    data;
  if (!nome?.trim()) throw new Error("Nome da técnica é obrigatório");
  if (!descricao?.trim()) throw new Error("Descrição é obrigatória");
  if (!comoExecutar?.trim()) throw new Error("Como executar é obrigatório");
  if (!beneficios?.trim()) throw new Error("Benefícios são obrigatórios");

  return prisma.tecnica.create({
    data: {
      nome: nome.trim(),
      descricao: descricao.trim(),
      comoExecutar: comoExecutar.trim(),
      beneficios: beneficios.trim(),
      quandoUtilizar: quandoUtilizar?.trim() || null,
      observacoes: observacoes?.trim() || null,
    },
  });
}

export async function updateTecnica(id: string, data: TecnicaInput) {
  const fields = [
    "nome",
    "descricao",
    "comoExecutar",
    "beneficios",
    "quandoUtilizar",
    "observacoes",
  ] as const;
  const update: Record<string, unknown> = {};
  for (const field of fields) {
    if (data[field] !== undefined) {
      const value = data[field];
      update[field] =
        typeof value === "string" ? value.trim() || null : value;
    }
  }
  if (update.nome === "") throw new Error("Nome da técnica é obrigatório");

  return prisma.tecnica.update({ where: { id }, data: update });
}

export async function deleteTecnica(id: string) {
  return prisma.tecnica.delete({ where: { id } });
}
