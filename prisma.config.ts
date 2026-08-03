import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

const datasourceUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: path.join("frontend", "prisma", "schema.prisma"),
  migrations: {
    path: path.join("frontend", "prisma", "migrations"),
  },
  datasource: {
    url: datasourceUrl,
  },
});
