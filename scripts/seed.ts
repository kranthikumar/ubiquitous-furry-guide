/**
 * Loads the seed data from src/lib/data.ts into the database.
 * Safe to re-run: it replaces the seeded rows each time.
 *
 *   npm run db:seed
 */
import { loadEnvConfig } from "@next/env";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { channels, commentsFor, parseDuration, videos } from "../src/lib/data";

const UNIT_MINUTES: Record<string, number> = {
  minute: 1,
  hour: 60,
  day: 60 * 24,
  week: 60 * 24 * 7,
  month: 60 * 24 * 30,
  year: 60 * 24 * 365,
};

/** "3 days ago" → minutes; unrecognised text counts as now. */
function minutesAgo(label: string): number {
  const match = /^(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago$/.exec(
    label.trim(),
  );
  return match ? Number(match[1]) * UNIT_MINUTES[match[2]] : 0;
}

function dateMinutesAgo(minutes: number, now: Date): Date {
  return new Date(now.getTime() - minutes * 60_000);
}

export async function seed(db: PostgresJsDatabase<typeof schema>) {
  const now = new Date();
  await db.transaction(async (tx) => {
    // Channels cascade to their videos and comments.
    await tx.delete(schema.channels);

    await tx.insert(schema.channels).values(
      channels.map((channel) => ({
        id: channel.handle,
        name: channel.name,
        subscribers: channel.subscribers,
        avatar: channel.avatar,
      })),
    );

    await tx.insert(schema.videos).values(
      videos.map((video) => ({
        id: video.id,
        channelId: video.channel,
        title: video.title,
        description: video.description,
        views: video.views,
        durationSeconds: parseDuration(video.duration),
        categories: video.categories,
        thumbnailArt: {
          scene: video.scene,
          critters: video.critters,
          caption: video.caption,
        },
        publishedAt: dateMinutesAgo(minutesAgo(video.published), now),
      })),
    );

    await tx.insert(schema.comments).values(
      videos.flatMap((video) =>
        commentsFor(video).map((comment) => ({
          videoId: video.id,
          authorId: comment.author,
          body: comment.text,
          likes: comment.likes,
          createdAt: dateMinutesAgo(comment.age, now),
        })),
      ),
    );
  });
}

async function main() {
  loadEnvConfig(process.cwd());
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local");

  const client = postgres(url, { prepare: false, max: 1 });
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
