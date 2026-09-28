import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { APP_URL_VARS, urlsFrom } from "./url";

type Database = PostgresJsDatabase<typeof schema>;

// Reuse one client across hot reloads in development instead of opening a
// new pool on every file change.
const globalForDb = globalThis as unknown as { db?: Database };

/**
 * The app's database handle, created on first use so that merely importing
 * a page (e.g. during a build without database settings) doesn't fail.
 */
export function getDb(): Database {
  if (globalForDb.db) return globalForDb.db;

  const [[, url] = []] = urlsFrom(APP_URL_VARS);
  if (!url) {
    throw new Error(
      `No database URL: set ${APP_URL_VARS.join(" or ")} (see .env.example).`,
    );
  }
  // Supabase's transaction-mode pooler (port 6543) doesn't support prepared
  // statements, so they must be disabled.
  const db = drizzle(postgres(url, { prepare: false }), { schema });
  globalForDb.db = db;
  return db;
}
