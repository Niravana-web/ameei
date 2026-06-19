import { defineConfig } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. The CLI (db push, migrate,
// seed, studio) reads it from here; the runtime client gets it via the driver adapter
// in src/lib/prisma.ts. .env is NOT auto-loaded here — load it ourselves (Node 20.12+).
try {
  process.loadEnvFile(".env");
} catch {
  // ponytail: no .env file in this environment — DATABASE_URL must already be set.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
