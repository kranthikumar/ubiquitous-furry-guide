import "server-only";
import {
  and,
  arrayContains,
  asc,
  desc,
  eq,
  ilike,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { connection } from "next/server";
import { cache } from "react";
import { timeAgo } from "@/lib/format";
import { GUEST_CHANNEL_ID } from "@/lib/constants";
import type {
  Category,
  ChannelBadge,
  CommentView,
  VideoDetail,
  VideoSummary,
} from "@/lib/types";
import { getDb } from "./index";
import {
  categories,
  channels,
  comments,
  followedChannels,
  videos,
} from "./schema";
import { DEFAULT_GUEST } from "./seed-data";

const channelColumns = {
  id: channels.id,
  name: channels.name,
  subscribers: channels.subscribers,
  avatar: channels.avatar,
};

const summaryColumns = {
  id: videos.id,
  title: videos.title,
  views: videos.views,
  durationSeconds: videos.durationSeconds,
  publishedAt: videos.publishedAt,
  thumbnailArt: videos.thumbnailArt,
  thumbnailUrl: videos.thumbnailUrl,
  channel: channelColumns,
};

type SummaryRow = Omit<VideoSummary, "published"> & { publishedAt: Date };

function toSummary(
  { publishedAt, ...row }: SummaryRow,
  now: Date,
): VideoSummary {
  return { ...row, published: timeAgo(publishedAt, now) };
}

/** Escapes LIKE wildcards so user input matches literally. */
function containsPattern(text: string) {
  return `%${text.replace(/[\\%_]/g, "\\$&")}%`;
}

// Newest first; views then id keep the order stable for equal timestamps.
const feedOrder = [
  desc(videos.publishedAt),
  desc(videos.views),
  asc(videos.id),
];

/** Home feed, optionally filtered by a search query and/or category. */
export async function listVideos({
  query,
  category,
  limit = 60,
}: {
  query?: string;
  category?: string;
  limit?: number;
}): Promise<VideoSummary[]> {
  await connection();
  const pattern = query ? containsPattern(query) : undefined;
  const rows = await getDb()
    .select(summaryColumns)
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(
      and(
        category ? arrayContains(videos.categories, [category]) : undefined,
        pattern
          ? or(ilike(videos.title, pattern), ilike(channels.name, pattern))
          : undefined,
      ),
    )
    .orderBy(...feedOrder)
    .limit(limit);
  const now = new Date();
  return rows.map((row) => toSummary(row, now));
}

/** One video with its channel. Cached per request (page + metadata). */
export const getVideo = cache(
  async (id: string): Promise<VideoDetail | undefined> => {
    await connection();
    const [row] = await getDb()
      .select({
        ...summaryColumns,
        description: videos.description,
        videoUrl: videos.videoUrl,
      })
      .from(videos)
      .innerJoin(channels, eq(videos.channelId, channels.id))
      .where(eq(videos.id, id))
      .limit(1);
    return (
      row && {
        ...toSummary(row, new Date()),
        description: row.description,
        videoUrl: row.videoUrl,
      }
    );
  },
);

/** Other videos, those sharing the most categories with `id` first. */
export async function getRelatedVideos(
  id: string,
  limit = 12,
): Promise<VideoSummary[]> {
  await connection();
  const sharedCategories = sql<number>`cardinality(array(
    select unnest(${videos.categories})
    intersect
    select unnest((select c.categories from videos c where c.id = ${id}))
  ))`;
  const rows = await getDb()
    .select(summaryColumns)
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(ne(videos.id, id))
    .orderBy(desc(sharedCategories), ...feedOrder)
    .limit(limit);
  const now = new Date();
  return rows.map((row) => toSummary(row, now));
}

export async function getComments(videoId: string): Promise<CommentView[]> {
  await connection();
  const rows = await getDb()
    .select({
      id: comments.id,
      body: comments.body,
      likes: comments.likes,
      createdAt: comments.createdAt,
      author: { id: channels.id, name: channels.name, avatar: channels.avatar },
    })
    .from(comments)
    .innerJoin(channels, eq(comments.authorId, channels.id))
    .where(eq(comments.videoId, videoId))
    .orderBy(desc(comments.createdAt))
    .limit(200);
  const now = new Date();
  return rows.map(({ createdAt, ...row }) => ({
    ...row,
    published: timeAgo(createdAt, now),
    createdAt: createdAt.getTime(),
  }));
}

/** Category chips, in admin-defined order. Cached per request. */
export const listCategories = cache(async (): Promise<Category[]> => {
  await connection();
  return getDb()
    .select({ slug: categories.slug, label: categories.label })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.label));
});

const badgeColumns = {
  id: channels.id,
  name: channels.name,
  avatar: channels.avatar,
};

/**
 * The shared guest user everyone comments as. Falls back to the built-in
 * default if its row was deleted (it is recreated on the next comment).
 */
export const getGuest = cache(async (): Promise<ChannelBadge> => {
  await connection();
  const [row] = await getDb()
    .select(badgeColumns)
    .from(channels)
    .where(eq(channels.id, GUEST_CHANNEL_ID))
    .limit(1);
  return (
    row ?? {
      id: DEFAULT_GUEST.handle,
      name: DEFAULT_GUEST.name,
      avatar: DEFAULT_GUEST.avatar,
    }
  );
});

/** Sidebar "Followed Channels", in admin-defined order. */
export const listFollowedChannels = cache(async (): Promise<ChannelBadge[]> => {
  await connection();
  return getDb()
    .select(badgeColumns)
    .from(followedChannels)
    .innerJoin(channels, eq(followedChannels.channelId, channels.id))
    .orderBy(asc(followedChannels.position), asc(channels.name));
});
