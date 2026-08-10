import path from "path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: path.resolve(__dirname, "../.env") });
loadEnv({ path: path.resolve(__dirname, ".env") });
loadEnv({ path: path.resolve(__dirname, ".env.local") });

// generate (postinstall) não precisa de DB real; migrate usa envs da Vercel.
// Migrations precisam de conexão direct (advisory lock). Neon pooler quebra isso.
function resolveMigrateUrl(): string {
  const candidates = [
    process.env.DIRECT_DATABASE_URL,
    process.env.DATABASE_URL,
  ].filter((value): value is string => Boolean(value));

  for (const url of candidates) {
    if (!url.includes("-pooler.")) {
      return url;
    }
  }

  const pooled = candidates[0];
  if (pooled) {
    return pooled.replace("-pooler.", ".");
  }

  return "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
}

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
  },
  datasource: {
    url: resolveMigrateUrl(),
  },
});
