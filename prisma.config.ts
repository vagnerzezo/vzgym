import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

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
  schema: path.join("frontend", "prisma", "schema.prisma"),
  migrations: {
    path: path.join("frontend", "prisma", "migrations"),
  },
  datasource: {
    url: resolveMigrateUrl(),
  },
});
