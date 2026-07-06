require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { requireAdmin } = require("./middleware/adminAuth");
const treinoService = require("./services/treinoService");
const exercicioService = require("./services/exercicioService");
const tecnicaService = require("./services/tecnicaService");

const app = express();

app.use(cors());
app.use(express.json());

function handleError(res, err, fallback) {
  if (err.code === "P2025") {
    return res.status(404).json({ erro: "Registro não encontrado" });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ erro: "Referência inválida" });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ erro: "Registro duplicado" });
  }
  if (err.message?.includes("obrigat")) {
    return res.status(400).json({ erro: err.message });
  }
  console.error(err);
  return res.status(500).json({ erro: fallback });
}

// --- Public read endpoints ---

app.get("/treinos", async (_req, res) => {
  try {
    const treinos = await treinoService.listTreinos();
    return res.status(200).json(treinos);
  } catch (err) {
    return handleError(res, err, "Erro ao listar treinos");
  }
});

app.get("/tecnicas", async (_req, res) => {
  try {
    const tecnicas = await tecnicaService.listTecnicas();
    return res.status(200).json(tecnicas);
  } catch (err) {
    return handleError(res, err, "Erro ao listar técnicas");
  }
});

app.get("/tecnicas/:id", async (req, res) => {
  try {
    const tecnica = await tecnicaService.getTecnica(req.params.id);
    if (!tecnica) return res.status(404).json({ erro: "Técnica não encontrada" });
    return res.status(200).json(tecnica);
  } catch (err) {
    return handleError(res, err, "Erro ao buscar técnica");
  }
});

app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await exercicioService.listExercicios({
      treinoId: req.query.treino_id,
      search: req.query.search,
    });
    return res.status(200).json(exercicios);
  } catch (err) {
    return handleError(res, err, "Erro ao listar exercícios");
  }
});

app.get("/exercicios/:id", async (req, res) => {
  try {
    const exercicio = await exercicioService.getExercicio(req.params.id);
    if (!exercicio) return res.status(404).json({ erro: "Exercício não encontrado" });
    return res.status(200).json(exercicio);
  } catch (err) {
    return handleError(res, err, "Erro ao buscar exercício");
  }
});

// --- Admin endpoints ---

app.get("/admin/treinos", requireAdmin, async (_req, res) => {
  try {
    const treinos = await treinoService.listTreinos();
    return res.status(200).json(treinos);
  } catch (err) {
    return handleError(res, err, "Erro ao listar treinos");
  }
});

app.post("/admin/treinos", requireAdmin, async (req, res) => {
  try {
    const treino = await treinoService.createTreino(req.body ?? {});
    return res.status(201).json(treino);
  } catch (err) {
    return handleError(res, err, "Erro ao criar treino");
  }
});

app.put("/admin/treinos/:id", requireAdmin, async (req, res) => {
  try {
    const treino = await treinoService.updateTreino(req.params.id, req.body ?? {});
    return res.status(200).json(treino);
  } catch (err) {
    return handleError(res, err, "Erro ao atualizar treino");
  }
});

app.delete("/admin/treinos/:id", requireAdmin, async (req, res) => {
  try {
    const treino = await treinoService.deleteTreino(req.params.id);
    return res.status(200).json(treino);
  } catch (err) {
    return handleError(res, err, "Erro ao excluir treino");
  }
});

app.get("/admin/tecnicas", requireAdmin, async (_req, res) => {
  try {
    const tecnicas = await tecnicaService.listTecnicas();
    return res.status(200).json(tecnicas);
  } catch (err) {
    return handleError(res, err, "Erro ao listar técnicas");
  }
});

app.post("/admin/tecnicas", requireAdmin, async (req, res) => {
  try {
    const tecnica = await tecnicaService.createTecnica(req.body ?? {});
    return res.status(201).json(tecnica);
  } catch (err) {
    return handleError(res, err, "Erro ao criar técnica");
  }
});

app.put("/admin/tecnicas/:id", requireAdmin, async (req, res) => {
  try {
    const tecnica = await tecnicaService.updateTecnica(req.params.id, req.body ?? {});
    return res.status(200).json(tecnica);
  } catch (err) {
    return handleError(res, err, "Erro ao atualizar técnica");
  }
});

app.delete("/admin/tecnicas/:id", requireAdmin, async (req, res) => {
  try {
    const tecnica = await tecnicaService.deleteTecnica(req.params.id);
    return res.status(200).json(tecnica);
  } catch (err) {
    return handleError(res, err, "Erro ao excluir técnica");
  }
});

app.get("/admin/exercicios", requireAdmin, async (req, res) => {
  try {
    const exercicios = await exercicioService.listExercicios({
      treinoId: req.query.treino_id,
      search: req.query.search,
    });
    return res.status(200).json(exercicios);
  } catch (err) {
    return handleError(res, err, "Erro ao listar exercícios");
  }
});

app.post("/admin/exercicios", requireAdmin, async (req, res) => {
  try {
    const exercicio = await exercicioService.createExercicio(req.body ?? {});
    return res.status(201).json(exercicio);
  } catch (err) {
    return handleError(res, err, "Erro ao criar exercício");
  }
});

app.put("/admin/exercicios/:id", requireAdmin, async (req, res) => {
  try {
    const exercicio = await exercicioService.updateExercicio(req.params.id, req.body ?? {});
    return res.status(200).json(exercicio);
  } catch (err) {
    return handleError(res, err, "Erro ao atualizar exercício");
  }
});

app.delete("/admin/exercicios/:id", requireAdmin, async (req, res) => {
  try {
    const exercicio = await exercicioService.deleteExercicio(req.params.id);
    return res.status(200).json(exercicio);
  } catch (err) {
    return handleError(res, err, "Erro ao excluir exercício");
  }
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const port = Number(process.env.PORT) || 3002;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`vzgym API rodando em http://${host}:${port}`);
});
