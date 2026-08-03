import path from "path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: path.resolve(__dirname, "../.env") });
loadEnv({ path: path.resolve(__dirname, ".env") });
loadEnv({ path: path.resolve(__dirname, ".env.local") });

// generate (postinstall) não precisa de DB real; migrate usa envs da Vercel.
const datasourceUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
  },
  datasource: {
    url: datasourceUrl,
  },
});
