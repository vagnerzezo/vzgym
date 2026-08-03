-- CreateTable
CREATE TABLE "training_checkins" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL DEFAULT 'default',
    "workout_id" TEXT,
    "checkin_date" DATE NOT NULL,
    "weekday" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_checkins_user_id_idx" ON "training_checkins"("user_id");

-- CreateIndex
CREATE INDEX "training_checkins_workout_id_idx" ON "training_checkins"("workout_id");

-- CreateIndex
CREATE INDEX "training_checkins_checkin_date_idx" ON "training_checkins"("checkin_date");

-- CreateIndex
CREATE UNIQUE INDEX "training_checkins_user_id_checkin_date_key" ON "training_checkins"("user_id", "checkin_date");

-- AddForeignKey
ALTER TABLE "training_checkins" ADD CONSTRAINT "training_checkins_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Treino"("id") ON DELETE SET NULL ON UPDATE CASCADE;
