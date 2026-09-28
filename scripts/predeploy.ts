/**
 * Runs before `next build` on Vercel (see the vercel-build script):
 * applies pending migrations and, on a brand-new database, loads the seed
 * data. Production deploys only; previews and local builds skip it.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seedIfEmpty } from "../src/db/seed";

const log = (message: string) => console.log(`[predeploy] ${message}`);

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    log(`skipped (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"})`);
    return;
  }
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    // Pages don't read from the database yet, so don't block the deploy.
    log("skipped: DIRECT_URL is not set in Vercel's environment variables");
    return;
  }

  const client = postgres(url, {
    prepare: false,
    max: 1,
    onnotice: () => {},
  });
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
