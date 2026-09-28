import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Read .env.local / .env the same way Next.js does.
loadEnvConfig(process.cwd());

// Migrations should use a direct or session-mode connection (port 5432);
// the app's transaction-mode pooler URL is the fallback.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
