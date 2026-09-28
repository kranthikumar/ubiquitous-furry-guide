/**
 * Replaces the database contents with the seed data from src/lib/data.ts.
 * Safe to re-run. Production deploys seed automatically when the database
 * is empty (see scripts/predeploy.ts), so this is mainly for local use.
 *
 *   npm run db:seed
 */
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";

async function main() {
  loadEnvConfig(process.cwd());
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local");

  const client = postgres(url, {
    prepare: false,
    max: 1,
    onnotice: () => {},
  });
  try {
    await seed(drizzle(client, { schema }));
    const [counts] = await client`
      select
        (select count(*) from channels)::int as channels,
        (select count(*) from videos)::int as videos,
        (select count(*) from comments)::int as comments`;
    console.log("Seeded:", counts);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
