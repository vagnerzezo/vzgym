export type Tecnica = {
  id: string;
  nome: string;
  descricao: string;
  comoExecutar: string;
  beneficios: string;
  quandoUtilizar: string | null;
  observacoes: string | null;
};

export type Exercicio = {
  id: string;
  treinoId: string;
  treino?: Treino;
  nome: string;
  series: string;
  tecnicaId: string | null;
  tecnica: Tecnica | null;
  video: string | null;
  musculo: string;
  passoAPasso: string | null;
  dicas: string | null;
  observacoes: string | null;
  ordem: number;
};

export type Treino = {
  id: string;
  nome: string;
  ordem: number;
  exercicios: Exercicio[];
};

export type ExercicioFormData = {
  treinoId: string;
  nome: string;
  series: string;
  tecnicaId: string;
  video: string;
  musculo: string;
  passoAPasso: string;
  dicas: string;
  observacoes: string;
};

export type TecnicaFormData = {
  nome: string;
  descricao: string;
  comoExecutar: string;
  beneficios: string;
  quandoUtilizar: string;
  observacoes: string;
};

export type TreinoFormData = {
  nome: string;
  ordem: number;
};

export type TrainingCheckin = {
  id: string;
  userId: string;
  treinoId: string | null;
  checkinDate: string;
  weekday: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CheckInStats = {
  monthTotal: number;
  weekTotal: number;
  currentStreak: number;
  monthPercent: number;
  bestStreak: number;
  weekStart: string;
  weekEnd: string;
  monthStart: string;
  monthEnd: string;
};
