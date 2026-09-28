import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  categories,
  channels,
  commentsFor,
  DEFAULT_GUEST,
  followedChannels,
  parseDuration,
  videos,
} from "./seed-data";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

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

/** Replaces all site content with the seed data. */
export async function seed(db: Database) {
  const now = new Date();
  await db.transaction(async (tx) => {
    // Channels cascade to videos, comments and followed channels.
    await tx.delete(schema.channels);
    await tx.delete(schema.categories);

    await tx.insert(schema.categories).values(
      categories.map((category, index) => ({
        ...category,
        position: index + 1,
      })),
    );

    await tx.insert(schema.channels).values(
      [...channels, DEFAULT_GUEST].map((channel) => ({
        id: channel.handle,
        name: channel.name,
        subscribers: channel.subscribers,
        avatar: channel.avatar,
      })),
    );

    await tx.insert(schema.followedChannels).values(
      followedChannels.map((channelId, index) => ({
        channelId,
        position: index + 1,
      })),
    );

    await tx.insert(schema.videos).values(
      videos.map((video, index) => ({
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
        // A second apart per video, so videos with the same label ("1 hour
        // ago") keep the seed order in the newest-first feed.
        publishedAt: new Date(
          dateMinutesAgo(minutesAgo(video.published), now).getTime() -
            index * 1000,
        ),
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

/**
 * Seeds only when there are no videos yet, so real data is never touched.
 * (Checks videos, not channels: a migration creates the guest channel.)
 */
export async function seedIfEmpty(db: Database): Promise<boolean> {
  const existing = await db
    .select({ id: schema.videos.id })
    .from(schema.videos)
    .limit(1);
  if (existing.length > 0) return false;
  await seed(db);
  return true;
}
