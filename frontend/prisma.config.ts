import path from "path";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

const root = path.resolve(__dirname, "..");

loadEnv({ path: path.join(root, ".env") });
loadEnv({ path: path.join(__dirname, ".env") });
loadEnv({ path: path.join(__dirname, ".env.local") });

export default defineConfig({
  schema: path.join(root, "prisma/schema.prisma"),
  migrations: {
    path: path.join(root, "prisma/migrations"),
  },
  datasource: {
    url: env("DIRECT_DATABASE_URL"),
  },
});
