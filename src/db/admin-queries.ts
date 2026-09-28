import "server-only";
import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "./index";
import {
  categories,
  channels,
  comments,
  followedChannels,
  videos,
} from "./schema";

export const PAGE_SIZE = 25;

export type Page<T> = { rows: T[]; total: number; page: number; pages: number };

/** Clamps a ?page= value to a positive integer. */
export function pageNumber(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function containsPattern(text: string) {
  return `%${text.replace(/[\\%_]/g, "\\$&")}%`;
}

async function paged<T>(
  page: number,
  rowsQuery: (offset: number) => Promise<T[]>,
  totalQuery: () => Promise<{ n: number }[]>,
): Promise<Page<T>> {
  const [rows, [{ n: total }]] = await Promise.all([
    rowsQuery((page - 1) * PAGE_SIZE),
    totalQuery(),
  ]);
  return {
    rows,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function dashboardCounts() {
  await connection();
  const [row] = await getDb().execute<{
    videos: number;
    channels: number;
    comments: number;
    categories: number;
    followed: number;
  }>(sql`
    select
      (select count(*)::int from ${videos}) as videos,
      (select count(*)::int from ${channels}) as channels,
      (select count(*)::int from ${comments}) as comments,
      (select count(*)::int from ${categories}) as categories,
      (select count(*)::int from ${followedChannels}) as followed`);
  return row;
}

// ---------------------------------------------------------------- videos

export async function listAdminVideos({
  query,
  category,
  channel,
  page,
}: {
  query?: string;
  category?: string;
  channel?: string;
  page: number;
}) {
  await connection();
  const db = getDb();
  const where = and(
    query
      ? or(
          ilike(videos.title, containsPattern(query)),
          ilike(videos.id, containsPattern(query)),
        )
      : undefined,
    category ? arrayContains(videos.categories, [category]) : undefined,
    channel ? eq(videos.channelId, channel) : undefined,
  );
  return paged(
    page,
    (offset) =>
      db
        .select({
          id: videos.id,
          title: videos.title,
          views: videos.views,
          durationSeconds: videos.durationSeconds,
          publishedAt: videos.publishedAt,
          thumbnailArt: videos.thumbnailArt,
          thumbnailUrl: videos.thumbnailUrl,
          hasVideo: sql<boolean>`${videos.videoUrl} is not null`,
          channelId: videos.channelId,
          channelName: channels.name,
          comments: sql<number>`(select count(*)::int from ${comments} where ${comments.videoId} = ${videos.id})`,
        })
        .from(videos)
        .innerJoin(channels, eq(videos.channelId, channels.id))
        .where(where)
        .orderBy(desc(videos.publishedAt), asc(videos.id))
        .limit(PAGE_SIZE)
        .offset(offset),
    () => db.select({ n: count() }).from(videos).where(where),
  );
}

export async function getAdminVideo(id: string) {
  await connection();
  const [row] = await getDb()
    .select()
    .from(videos)
    .where(eq(videos.id, id))
    .limit(1);
  return row;
}

// -------------------------------------------------------------- channels

export async function listAdminChannels({
  query,
  page,
}: {
  query?: string;
  page: number;
}) {
  await connection();
  const db = getDb();
  const where = query
    ? or(
        ilike(channels.name, containsPattern(query)),
        ilike(channels.id, containsPattern(query)),
      )
    : undefined;
  return paged(
    page,
    (offset) =>
      db
        .select({
          id: channels.id,
          name: channels.name,
          subscribers: channels.subscribers,
          avatar: channels.avatar,
          followedPosition: followedChannels.position,
          videos: sql<number>`(select count(*)::int from ${videos} where ${videos.channelId} = ${channels.id})`,
        })
        .from(channels)
        .leftJoin(followedChannels, eq(followedChannels.channelId, channels.id))
        .where(where)
        .orderBy(asc(channels.name))
        .limit(PAGE_SIZE)
        .offset(offset),
    () => db.select({ n: count() }).from(channels).where(where),
  );
}

export async function getAdminChannel(id: string) {
  await connection();
  const [row] = await getDb()
    .select({
      id: channels.id,
      name: channels.name,
      subscribers: channels.subscribers,
      avatar: channels.avatar,
      followedPosition: followedChannels.position,
      videos: sql<number>`(select count(*)::int from ${videos} where ${videos.channelId} = ${channels.id})`,
      comments: sql<number>`(select count(*)::int from ${comments} where ${comments.authorId} = ${channels.id} or ${comments.videoId} in (select ${videos.id} from ${videos} where ${videos.channelId} = ${channels.id}))`,
    })
    .from(channels)
    .leftJoin(followedChannels, eq(followedChannels.channelId, channels.id))
    .where(eq(channels.id, id))
    .limit(1);
  return row;
}

/** Next free sidebar position, for pre-filling new followed channels. */
export async function nextFollowedPosition() {
  await connection();
  const [row] = await getDb()
    .select({ max: sql<number | null>`max(${followedChannels.position})` })
    .from(followedChannels);
  return (row?.max ?? 0) + 1;
}

// -------------------------------------------------------------- comments

export async function listAdminComments({
  query,
  video,
  page,
}: {
  query?: string;
  video?: string;
  page: number;
}) {
  await connection();
  const db = getDb();
  const where = and(
    query ? ilike(comments.body, containsPattern(query)) : undefined,
    video ? eq(comments.videoId, video) : undefined,
  );
  return paged(
    page,
    (offset) =>
      db
        .select({
          id: comments.id,
          body: comments.body,
          likes: comments.likes,
          createdAt: comments.createdAt,
          videoId: comments.videoId,
          videoTitle: videos.title,
          authorId: comments.authorId,
          authorName: channels.name,
        })
        .from(comments)
        .innerJoin(videos, eq(comments.videoId, videos.id))
        .innerJoin(channels, eq(comments.authorId, channels.id))
        .where(where)
        .orderBy(desc(comments.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset),
    () => db.select({ n: count() }).from(comments).where(where),
  );
}

export async function getAdminComment(id: string) {
  // Comment ids are UUIDs; anything else can't exist (and would make
  // Postgres raise a cast error).
  if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
  await connection();
  const [row] = await getDb()
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);
  return row;
}

// ------------------------------------------------------------ categories

export async function listAdminCategories() {
  await connection();
  return getDb()
    .select({
      slug: categories.slug,
      label: categories.label,
      position: categories.position,
      videos: sql<number>`(select count(*)::int from ${videos} where ${categories.slug} = any(${videos.categories}))`,
    })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.label));
}

export async function getAdminCategory(slug: string) {
  await connection();
  const [row] = await getDb()
    .select({
      slug: categories.slug,
      label: categories.label,
      position: categories.position,
      videos: sql<number>`(select count(*)::int from ${videos} where ${categories.slug} = any(${videos.categories}))`,
    })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return row;
}

export async function nextCategoryPosition() {
  await connection();
  const [row] = await getDb()
    .select({ max: sql<number | null>`max(${categories.position})` })
    .from(categories);
  return (row?.max ?? 0) + 1;
}

// ------------------------------------------------------ select options

export type Option = { value: string; label: string };

export async function channelOptions(): Promise<Option[]> {
  await connection();
  return getDb()
    .select({ value: channels.id, label: channels.name })
    .from(channels)
    .orderBy(asc(channels.name));
}

export async function videoOptions(): Promise<Option[]> {
  await connection();
  return getDb()
    .select({ value: videos.id, label: videos.title })
    .from(videos)
    .orderBy(asc(videos.title));
}

export async function categoryOptions(): Promise<Option[]> {
  await connection();
  return getDb()
    .select({ value: categories.slug, label: categories.label })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.label));
}
