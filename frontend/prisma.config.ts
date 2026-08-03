import path from "path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const root = path.resolve(__dirname, "..");

loadEnv({ path: path.join(root, ".env") });
loadEnv({ path: path.join(__dirname, ".env") });
loadEnv({ path: path.join(__dirname, ".env.local") });

// `prisma generate` (postinstall) não precisa de DB real.
// `migrate deploy` na Vercel usa DIRECT_DATABASE_URL / DATABASE_URL das envs do projeto.
const datasourceUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: path.join(root, "prisma/schema.prisma"),
  migrations: {
    path: path.join(root, "prisma/migrations"),
  },
  datasource: {
    url: datasourceUrl,
  },
});
