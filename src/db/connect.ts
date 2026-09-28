import postgres from "postgres";
import { MIGRATION_URL_VARS, urlsFrom } from "./url";

export type ScriptConnection = {
  client: postgres.Sql;
  /** Which environment variable the URL came from (never the URL itself). */
  source: string;
};

/**
 * Opens a single-connection client for migrations and seeding, trying each
 * configured URL in MIGRATION_URL_VARS order until one answers. Returns
 * null when none are set; throws with every attempt's error if all fail.
 */
export async function connectForScripts(): Promise<ScriptConnection | null> {
  const candidates = urlsFrom(MIGRATION_URL_VARS);
  if (candidates.length === 0) return null;

  const failures: string[] = [];
  for (const [source, url] of candidates) {
    const client = postgres(url, {
      prepare: false,
      max: 1,
      connect_timeout: 15,
      onnotice: () => {},
    });
    try {
      await client`select 1`;
      return { client, source };
    } catch (error) {
      failures.push(`${source}: ${(error as Error).message}`);
      await client.end({ timeout: 1 });
    }
  }
  throw new Error(
    `Could not connect to the database.\n  ${failures.join("\n  ")}`,
  );
}
