import { config as loadEnv } from "dotenv";
import path from "path";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Monorepo: permite usar o .env da raiz no `next dev`
loadEnv({ path: path.resolve(process.cwd(), "../.env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
