require("dotenv").config();
const prisma = require("../src/prisma");

const TECNICAS = [
  {
    nome: "Dropset",
    descricao: "Técnica onde você aumenta o volume do treino, realizando repetições máximas com pesos decrescentes sem descanso entre as trocas.",
    comoExecutar: "• Série com peso pesado: 6 repetições até a falha\n• Reduza para peso médio: 8 repetições até a falha\n• Reduza para peso leve: 12 repetições até a falha",
    beneficios: "• Aumento de volume total\n• Maior estresse metabólico\n• Hipertrofia muscular",
    quandoUtilizar: "Ideal na última série de exercícios isolados ou ao final do treino.",
  },
  {
    nome: "Bi-set",
    descricao: "Técnica onde você executa dois exercícios em sequência, sem descanso entre eles.",
    comoExecutar: "• Execute o primeiro exercício até completar as repetições\n• Imediatamente execute o segundo exercício\n• Descanse apenas após concluir os dois\n• Repita por todas as séries",
    beneficios: "• Economia de tempo\n• Maior intensidade\n• Estímulo em músculos complementares",
    quandoUtilizar: "Use para combinar exercícios antagonistas ou do mesmo grupo muscular.",
  },
  {
    nome: "Pirâmide",
    descricao: "Consiste em aumentar o peso a cada série, reduzindo as repetições progressivamente.",
    comoExecutar: "• Série 1: peso moderado, 12 repetições\n• Série 2: aumente a carga, 10 repetições\n• Série 3: aumente a carga, 8 repetições\n• Série 4+: continue até 4-6 repetições",
    beneficios: "• Ganho de força\n• Hipertrofia\n• Progressão de carga controlada",
    quandoUtilizar: "Excelente para exercícios compostos como supino, agachamento e remada.",
  },
  {
    nome: "Cluster",
    descricao: "Técnica onde você usa um peso pesado (para ~6 reps), mas divide a série em mini-séries com pausas curtas.",
    comoExecutar: "• Execute 4 repetições\n• Descanse 10 segundos\n• Execute +3 repetições\n• Descanse 10 segundos\n• Execute +3 repetições",
    beneficios: "• Trabalha com cargas mais pesadas\n• Aumenta volume com peso elevado\n• Desenvolve força e hipertrofia",
    quandoUtilizar: "Indicado para exercícios como barra fixa e movimentos com carga pesada.",
  },
  {
    nome: "Padrão",
    descricao: "Execução convencional com carga constante e repetições entre 10 e 12 por série.",
    comoExecutar: "• Mantenha a mesma carga em todas as séries\n• Execute 10 a 12 repetições por série\n• Descanse 60 a 90 segundos entre séries",
    beneficios: "• Boa base para hipertrofia\n• Fácil progressão\n• Controle de volume",
    quandoUtilizar: "Use na maioria dos exercícios como padrão de treino.",
  },
  {
    nome: "Tri-set",
    descricao: "Técnica onde você executa três exercícios em sequência, sem descanso entre eles.",
    comoExecutar: "• Execute o primeiro exercício\n• Sem descanso, execute o segundo\n• Sem descanso, execute o terceiro\n• Descanse após completar os três\n• Repita por todas as séries",
    beneficios: "• Alta intensidade metabólica\n• Economia de tempo\n• Estímulo muscular intenso",
    quandoUtilizar: "Ideal para finalizar treinos de ABS ou grupos musculares específicos.",
  },
  {
    nome: "6x12",
    descricao: "Técnica onde você usa um peso pesado para 6 repetições, reduz 50% da carga e faz mais 12 repetições.",
    comoExecutar: "• Execute 6 repetições com peso pesado\n• Reduza a carga em 50%\n• Execute +12 repetições com o peso reduzido\n• Descanse e repita por todas as séries",
    beneficios: "• Combina força e resistência\n• Alto volume em pouco tempo\n• Intensidade elevada",
    quandoUtilizar: "Funciona bem em exercícios isolados como flexora, bíceps e tríceps.",
  },
  {
    nome: "Unilateral",
    descricao: "Técnica onde você executa o exercício de maneira isolada, um lado de cada vez.",
    comoExecutar: "• Execute todas as repetições de um lado\n• Descanse brevemente ou alterne\n• Execute o mesmo número de repetições no outro lado\n• Mantenha simetria entre os lados",
    beneficios: "• Corrige desequilíbrios musculares\n• Maior foco no músculo trabalhado\n• Melhora controle motor",
    quandoUtilizar: "Use quando houver assimetria ou para exercícios como serrote e remada unilateral.",
  },
];

const TREINOS = [
  {
    nome: "A - Peito e ABS",
    ordem: 0,
    exercicios: [
      { nome: "Mobilidade superior", series: "5-10min", tecnica: null, musculo: "Mobilidade / Aquecimento" },
      { nome: "Manguito", series: "4x", tecnica: "Padrão", musculo: "Manguito rotador" },
      { nome: "Supino reto", series: "5x", tecnica: "Pirâmide", musculo: "Peitoral maior" },
      { nome: "Crucifixo inclinado", series: "4x", tecnica: "Dropset", musculo: "Peitoral superior" },
      { nome: "Supino inclinado máquina", series: "4x", tecnica: "Padrão", musculo: "Peitoral superior" },
      { nome: "Crossover X flexão solo", series: "4x", tecnica: "Bi-set", musculo: "Peitoral / Tríceps" },
      { nome: "Alternado inferior peitoral", series: "4x", tecnica: "Padrão", musculo: "Peitoral inferior" },
      { nome: "ABS polia alta", series: "4x", tecnica: "Tri-set", musculo: "Abdômen" },
      { nome: "Abdominal supra com anilha", series: "4x", tecnica: "Tri-set", musculo: "Abdômen superior" },
      { nome: "Remador", series: "4x", tecnica: "Tri-set", musculo: "Abdômen / Core" },
    ],
  },
  {
    nome: "B - Pernas",
    ordem: 1,
    exercicios: [
      { nome: "Mobilidade inferior", series: "5-10min", tecnica: null, musculo: "Mobilidade / Aquecimento" },
      { nome: "Agachamento", series: "4x", tecnica: "Pirâmide", musculo: "Quadríceps / Glúteos" },
      { nome: "Cadeira extensora", series: "4x", tecnica: "Dropset", musculo: "Quadríceps" },
      { nome: "Levantamento terra", series: "4x", tecnica: "Pirâmide", musculo: "Posterior / Glúteos / Lombar" },
      { nome: "Flexora deitada", series: "4x", tecnica: "6x12", musculo: "Posterior de coxa" },
      { nome: "Leg 45", series: "4x", tecnica: "Padrão", musculo: "Quadríceps / Glúteos" },
      { nome: "Panturrilha em pé", series: "4x", tecnica: "Padrão", musculo: "Panturrilha" },
    ],
  },
  {
    nome: "C - Costas",
    ordem: 2,
    exercicios: [
      { nome: "Mobilidade superior", series: "5-10min", tecnica: null, musculo: "Mobilidade / Aquecimento" },
      { nome: "Barra fixa", series: "4x", tecnica: "Cluster", musculo: "Dorsal / Bíceps" },
      { nome: "Serrote", series: "4x", tecnica: "Unilateral", musculo: "Dorsal" },
      { nome: "Remada pronada com barra", series: "4x", tecnica: "Pirâmide", musculo: "Dorsal / Romboides" },
      { nome: "Puxada alta", series: "4x", tecnica: "Padrão", musculo: "Dorsal" },
      { nome: "Pulldown", series: "3x", tecnica: "Padrão", musculo: "Dorsal" },
      { nome: "Puxada alta triângulo", series: "3x", tecnica: "Pirâmide", musculo: "Dorsal / Bíceps" },
    ],
  },
  {
    nome: "D - Ombro e ABS",
    ordem: 3,
    exercicios: [
      { nome: "Mobilidade superior", series: "5-10min", tecnica: null, musculo: "Mobilidade / Aquecimento" },
      { nome: "Desenvolvimento halter", series: "5x", tecnica: "Pirâmide", musculo: "Deltoide" },
      { nome: "Elevação lateral", series: "4x", tecnica: "Dropset", musculo: "Deltoide lateral" },
      { nome: "Remada alta barra W + Elevação frontal", series: "4x", tecnica: "Bi-set", musculo: "Deltoide / Trapézio" },
      { nome: "Posterior ombro halter + Elevação lateral", series: "4x", tecnica: "Bi-set", musculo: "Deltoide posterior / Lateral" },
      { nome: "Posterior ombro polia unilateral", series: "4x", tecnica: "Unilateral", musculo: "Deltoide posterior" },
      { nome: "Elevação de pernas", series: "4x", tecnica: "Tri-set", musculo: "Abdômen inferior" },
      { nome: "Rolinho", series: "4x", tecnica: "Tri-set", musculo: "Abdômen / Core" },
      { nome: "Prancha", series: "4x", tecnica: "Tri-set", musculo: "Core / Estabilizadores" },
    ],
  },
  {
    nome: "E - Braço",
    ordem: 4,
    exercicios: [
      { nome: "Mobilidade superior", series: "5-10min", tecnica: null, musculo: "Mobilidade / Aquecimento" },
      { nome: "Bíceps corda x Tríceps corda", series: "4x", tecnica: "Pirâmide", musculo: "Bíceps / Tríceps" },
      { nome: "Barra reta bíceps x Flexão diamante", series: "4x", tecnica: "Padrão", musculo: "Bíceps / Tríceps" },
      { nome: "Bíceps rosca halter x Francês", series: "4x", tecnica: "Pirâmide", musculo: "Bíceps / Tríceps" },
      { nome: "Bíceps polia reta x Tríceps coice", series: "4x", tecnica: "6x12", musculo: "Bíceps / Tríceps" },
    ],
  },
];

async function main() {
  const tecnicaMap = {};

  for (const t of TECNICAS) {
    const row = await prisma.tecnica.upsert({
      where: { nome: t.nome },
      update: {
        descricao: t.descricao,
        comoExecutar: t.comoExecutar,
        beneficios: t.beneficios,
        quandoUtilizar: t.quandoUtilizar,
      },
      create: t,
    });
    tecnicaMap[t.nome] = row.id;
  }

  await prisma.exercicio.deleteMany();

  const treinosExistentes = await prisma.treino.findMany();
  const ordensUsadas = new Set(TREINOS.map((t) => t.ordem));

  for (const antigo of treinosExistentes) {
    if (!ordensUsadas.has(antigo.ordem)) {
      await prisma.treino.delete({ where: { id: antigo.id } });
    }
  }

  for (const config of TREINOS) {
    let treino = await prisma.treino.findFirst({ where: { ordem: config.ordem } });

    if (treino) {
      treino = await prisma.treino.update({
        where: { id: treino.id },
        data: { nome: config.nome },
      });
    } else {
      treino = await prisma.treino.create({
        data: { nome: config.nome, ordem: config.ordem },
      });
    }

    await prisma.exercicio.createMany({
      data: config.exercicios.map((ex, index) => ({
        treinoId: treino.id,
        nome: ex.nome,
        series: ex.series,
        tecnicaId: ex.tecnica ? tecnicaMap[ex.tecnica] : null,
        musculo: ex.musculo,
        ordem: index,
      })),
    });
  }

  const totalExercicios = await prisma.exercicio.count();
  const totalTecnicas = await prisma.tecnica.count();
  const totalTreinos = await prisma.treino.count();

  console.log(`Seed concluído: ${totalTreinos} treinos, ${totalTecnicas} técnicas, ${totalExercicios} exercícios.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
