require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const prisma = require("../../src/prisma");

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
  {
    nome: "Rest-pause",
    descricao: "Técnica onde, ao atingir a falha, você descansa poucos segundos e continua a série com a mesma carga.",
    comoExecutar: "• Execute a série até a falha\n• Descanse 10 a 15 segundos\n• Faça mais repetições até a falha\n• Repita a pausa mais 1 ou 2 vezes",
    beneficios: "• Mais repetições com carga alta\n• Aumento de volume sem alongar o treino\n• Força e hipertrofia",
    quandoUtilizar: "Use na última série de exercícios compostos, como supino, puxada, hack e leg press.",
  },
  {
    nome: "Pico de contração",
    descricao: "Técnica onde você segura a posição de máxima contração do músculo por alguns segundos em cada repetição.",
    comoExecutar: "• Execute a fase concêntrica normalmente\n• Segure 1 segundo no ponto de máxima contração\n• Desça de forma controlada (2-3s)",
    beneficios: "• Maior conexão mente-músculo\n• Mais tempo sob tensão\n• Estímulo no ponto de encurtamento",
    quandoUtilizar: "Ideal em exercícios isolados como voador e pulldown.",
  },
  {
    nome: "Pausa embaixo",
    descricao: "Técnica onde você faz uma pausa na posição de alongamento, eliminando o reflexo elástico do movimento.",
    comoExecutar: "• Desça de forma controlada\n• Segure 2 segundos na posição de máximo alongamento\n• Suba sem dar impulso",
    beneficios: "• Maior amplitude efetiva\n• Mais tempo sob tensão\n• Evita usar o 'rebote' do tendão",
    quandoUtilizar: "Excelente para panturrilha, onde o rebote costuma roubar o estímulo.",
  },
  {
    nome: "Descida lenta",
    descricao: "Técnica que enfatiza a fase excêntrica (descida), executada de forma lenta e controlada.",
    comoExecutar: "• Suba de forma controlada\n• Desça em 3 a 4 segundos\n• Mantenha a tensão durante toda a descida",
    beneficios: "• Maior dano muscular e hipertrofia\n• Mais controle e segurança\n• Melhora a flexibilidade sob carga",
    quandoUtilizar: "Use em exercícios de posterior como stiff e em movimentos em que o controle é essencial.",
  },
];

const ABDOMINAIS = [
  { nome: "Abdominal polia", series: "3x8-12", tecnica: null, musculo: "Abdômen" },
  { nome: "Abdominal escalador", series: "3x30-40s", tecnica: null, musculo: "Abdômen / Core" },
  { nome: "Prancha lateral", series: "3x máx", tecnica: null, musculo: "Oblíquos / Core" },
  { nome: "Elevação de pernas (barra ou banco)", series: "3x10-15", tecnica: null, musculo: "Abdômen inferior" },
];

// Regras: 1 série de reconhecimento antes do 1º exercício de cada grupo, séries válidas até a falha
// (ou a 1 rep dela), descanso de 60-90s e descida controlada (2-3s).
const TREINOS = [
  {
    nome: "A - Push",
    ordem: 0,
    exercicios: [
      { nome: "Supino inclinado c/ halteres", series: "2x6-10", tecnica: "Rest-pause", musculo: "Peitoral superior", observacoes: "Rest-pause na última série." },
      { nome: "Voador", series: "2x8-12", tecnica: "Pico de contração", musculo: "Peitoral" },
      { nome: "Elevação lateral sentado", series: "3x10-15", tecnica: "Dropset", musculo: "Deltoide lateral", observacoes: "Drop set na última série." },
      { nome: "Elevação frontal", series: "2x8-12", tecnica: null, musculo: "Deltoide anterior" },
      { nome: "Tríceps pulley", series: "2x8-12", tecnica: "Dropset", musculo: "Tríceps", observacoes: "Drop set na última série." },
    ],
  },
  {
    nome: "B - Pull + ABS",
    ordem: 1,
    exercicios: [
      { nome: "Remada curvada", series: "2x6-10", tecnica: null, musculo: "Dorsal / Romboides" },
      { nome: "Puxada alta aberta", series: "2x6-10", tecnica: "Rest-pause", musculo: "Dorsal", observacoes: "Rest-pause na última série." },
      { nome: "Pulldown (braço estendido)", series: "2x10-12", tecnica: "Pico de contração", musculo: "Dorsal" },
      { nome: "Rosca Scott", series: "2x6-10", tecnica: "Dropset", musculo: "Bíceps", observacoes: "Drop set na última série." },
      { nome: "Rosca concentrada", series: "2x8-12", tecnica: null, musculo: "Bíceps" },
      ...ABDOMINAIS,
    ],
  },
  {
    nome: "C - Legs + ABS",
    ordem: 2,
    exercicios: [
      { nome: "Hack", series: "2x6-10", tecnica: "Rest-pause", musculo: "Quadríceps / Glúteos", observacoes: "Rest-pause na última série." },
      { nome: "Mesa flexora", series: "3x6-10", tecnica: null, musculo: "Posterior de coxa" },
      { nome: "Extensora", series: "3x8-12", tecnica: "Dropset", musculo: "Quadríceps", observacoes: "Drop set na última série." },
      { nome: "Adutora", series: "2x8-12", tecnica: null, musculo: "Adutores" },
      { nome: "Panturrilha", series: "3x8-12", tecnica: "Pausa embaixo", musculo: "Panturrilha" },
      ...ABDOMINAIS,
    ],
  },
  {
    nome: "D - Upper + ABS",
    ordem: 3,
    exercicios: [
      { nome: "Supino reto", series: "2x6-10", tecnica: null, musculo: "Peitoral maior" },
      { nome: "Remada cavalinho", series: "2x6-10", tecnica: null, musculo: "Dorsal / Romboides" },
      { nome: "Crossover baixa", series: "2x8-12", tecnica: "Bi-set", musculo: "Peitoral superior", observacoes: "Bi-set com a remada unilateral na polia." },
      { nome: "Remada unilateral na polia", series: "2x8-12", tecnica: "Bi-set", musculo: "Dorsal", observacoes: "Bi-set com o crossover baixa." },
      { nome: "Elevação lateral (polia ou halter)", series: "2x10-15", tecnica: "Dropset", musculo: "Deltoide lateral" },
      { nome: "Tríceps testa + Rosca direta", series: "2x8-12", tecnica: "Bi-set", musculo: "Tríceps / Bíceps" },
      ...ABDOMINAIS,
    ],
  },
  {
    nome: "E - Legs 2",
    ordem: 4,
    exercicios: [
      { nome: "Leg press 45°", series: "2x8-12", tecnica: "Rest-pause", musculo: "Quadríceps / Glúteos", observacoes: "Rest-pause na última série." },
      { nome: "Stiff", series: "2x8-10", tecnica: "Descida lenta", musculo: "Posterior / Glúteos" },
      { nome: "Agachamento búlgaro", series: "2x8-10 (cada)", tecnica: "Unilateral", musculo: "Quadríceps / Glúteos" },
      { nome: "Cadeira flexora", series: "2x10-12", tecnica: "Dropset", musculo: "Posterior de coxa" },
      { nome: "Abdutora", series: "2x10-15", tecnica: null, musculo: "Glúteo médio" },
      { nome: "Panturrilha sentado", series: "3x10-15", tecnica: "Pausa embaixo", musculo: "Panturrilha (sóleo)" },
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

  // Preserva mídia/textos cadastrados pelo painel para exercícios que continuam no plano.
  const normalizar = (nome) => nome.trim().toLowerCase();
  const extrasPorNome = {};
  for (const ex of await prisma.exercicio.findMany()) {
    extrasPorNome[normalizar(ex.nome)] ??= ex;
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
      data: config.exercicios.map((ex, index) => {
        const extras = extrasPorNome[normalizar(ex.nome)];
        return {
          treinoId: treino.id,
          nome: ex.nome,
          series: ex.series,
          tecnicaId: ex.tecnica ? tecnicaMap[ex.tecnica] : null,
          musculo: ex.musculo,
          video: extras?.video || null,
          passoAPasso: extras?.passoAPasso || null,
          dicas: extras?.dicas || null,
          observacoes: ex.observacoes ?? (extras?.observacoes || null),
          ordem: index,
        };
      }),
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
