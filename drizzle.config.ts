import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { MIGRATION_URL_VARS, urlsFrom } from "./src/db/url";

// Read .env.local / .env the same way Next.js does.
loadEnvConfig(process.cwd());

// Prefer an unpooled connection for migrations; see src/db/url.ts.
const [[, url] = []] = urlsFrom(MIGRATION_URL_VARS);
if (!url) {
  throw new Error(`Set one of ${MIGRATION_URL_VARS.join(", ")} in .env.local`);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
