/**
 * Connection strings, from either our own variable names or the ones the
 * Supabase ↔ Vercel integration syncs (POSTGRES_URL, ...NON_POOLING).
 */

/** Pooled URL for the running app (Supabase transaction pooler). */
export const APP_URL_VARS = ["DATABASE_URL", "POSTGRES_URL"] as const;

/** Preferred order for migrations and seeding: unpooled first. */
export const MIGRATION_URL_VARS = [
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
  ...APP_URL_VARS,
] as const;

// Query parameters meant for other tools. postgres-js forwards unknown
// parameters to the server, which rejects them.
const FOREIGN_PARAMS = ["supa", "pgbouncer"];

export function cleanUrl(raw: string): string {
  try {
    const url = new URL(raw);
    for (const param of FOREIGN_PARAMS) url.searchParams.delete(param);
    return url.toString();
  } catch {
    return raw;
  }
}

/** Set variables from `names`, in order, as [name, cleaned URL] pairs. */
export function urlsFrom(
  names: readonly string[],
  env: NodeJS.ProcessEnv = process.env,
): [string, string][] {
  return names.flatMap((name) => {
    const value = env[name]?.trim();
    return value ? [[name, cleanUrl(value)] as [string, string]] : [];
  });
}
