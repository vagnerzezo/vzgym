-- CreateTable
CREATE TABLE "Treino" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tecnica" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "como_executar" TEXT NOT NULL,
    "beneficios" TEXT NOT NULL,
    "quando_utilizar" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tecnica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL,
    "treino_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "tecnica_id" TEXT,
    "video" TEXT,
    "musculo" TEXT NOT NULL,
    "passo_a_passo" TEXT,
    "dicas" TEXT,
    "observacoes" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Treino_ordem_idx" ON "Treino"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Tecnica_nome_key" ON "Tecnica"("nome");

-- CreateIndex
CREATE INDEX "Exercicio_treino_id_idx" ON "Exercicio"("treino_id");

-- CreateIndex
CREATE INDEX "Exercicio_tecnica_id_idx" ON "Exercicio"("tecnica_id");

-- CreateIndex
CREATE INDEX "Exercicio_ordem_idx" ON "Exercicio"("ordem");

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "Treino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_tecnica_id_fkey" FOREIGN KEY ("tecnica_id") REFERENCES "Tecnica"("id") ON DELETE SET NULL ON UPDATE CASCADE;
