const prisma = require("../prisma");

async function listTecnicas() {
  return prisma.tecnica.findMany({ orderBy: { nome: "asc" } });
}

async function getTecnica(id) {
  return prisma.tecnica.findUnique({ where: { id } });
}

async function createTecnica(data) {
  const { nome, descricao, comoExecutar, beneficios, quandoUtilizar, observacoes } = data;
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

async function updateTecnica(id, data) {
  const fields = ["nome", "descricao", "comoExecutar", "beneficios", "quandoUtilizar", "observacoes"];
  const update = {};
  for (const field of fields) {
    if (data[field] !== undefined) {
      update[field] = typeof data[field] === "string" ? data[field].trim() || null : data[field];
    }
  }
  if (update.nome === "") throw new Error("Nome da técnica é obrigatório");

  return prisma.tecnica.update({ where: { id }, data: update });
}

async function deleteTecnica(id) {
  return prisma.tecnica.delete({ where: { id } });
}

module.exports = {
  listTecnicas,
  getTecnica,
  createTecnica,
  updateTecnica,
  deleteTecnica,
};
