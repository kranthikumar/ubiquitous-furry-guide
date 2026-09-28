/**
 * Runs before `next build` on Vercel (see the vercel-build script):
 * applies pending migrations and, on a brand-new database, loads the seed
 * data. Production deploys only; previews and local builds skip it.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connectForScripts } from "../src/db/connect";
import * as schema from "../src/db/schema";
import { seedIfEmpty } from "../src/db/seed";

const log = (message: string) => console.log(`[predeploy] ${message}`);

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    log(`skipped (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"})`);
    return;
  }
  const connection = await connectForScripts();
  if (!connection) {
    // Pages don't read from the database yet, so don't block the deploy.
    log("skipped: no database URL in Vercel's environment variables");
    return;
  }
  const { client, source } = connection;
  log(`connected using ${source}`);

  try {
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: "drizzle" });
    log("migrations up to date");
    log(
      (await seedIfEmpty(db))
        ? "seeded empty database"
        : "seed skipped: database already has data",
    );
    const [counts] = await client`
      select
        (select count(*) from channels)::int as channels,
        (select count(*) from videos)::int as videos,
        (select count(*) from comments)::int as comments`;
    log(`rows: ${JSON.stringify(counts)}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  // Drizzle wraps driver errors; the cause says what actually went wrong
  // (bad password, unreachable host, failing SQL).
  const cause = error instanceof Error && error.cause ? error.cause : error;
  console.error(
    "[predeploy] failed:",
    cause instanceof Error ? cause.message : cause,
  );
  process.exit(1);
});
