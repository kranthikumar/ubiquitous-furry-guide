import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { Critter, Scene } from "../lib/data";

/** Colours and pose of a channel's cartoon avatar. */
export type AvatarArt = Critter & { bg: string };

/** How to draw a placeholder thumbnail until real ones are uploaded. */
export type ThumbnailArt = {
  scene: Scene;
  critters: Critter[];
  caption?: string[];
};

// Supabase exposes the public schema through its Data API, so every table
// enables row-level security. With no policies, only direct database
// connections (which this app uses) can read or write.

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const channels = pgTable("channels", {
  /** The channel handle, e.g. "fuzzbuttvlogs"; used in URLs. */
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subscribers: integer("subscribers").notNull().default(0),
  avatar: jsonb("avatar").$type<AvatarArt>().notNull(),
  createdAt: createdAt(),
}).enableRLS();

export const videos = pgTable(
  "videos",
  {
    /** URL slug, e.g. "blfc-day-1". */
    id: text("id").primaryKey(),
    channelId: text("channel_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    views: bigint("views", { mode: "number" }).notNull().default(0),
    durationSeconds: integer("duration_seconds").notNull(),
    categories: text("categories")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    /** Placeholder artwork; null once a real thumbnail exists. */
    thumbnailArt: jsonb("thumbnail_art").$type<ThumbnailArt>(),
    /** Real media, for when uploads exist. */
    thumbnailUrl: text("thumbnail_url"),
    videoUrl: text("video_url"),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [
    index("videos_channel_id_idx").on(t.channelId),
    index("videos_published_at_idx").on(t.publishedAt.desc()),
    index("videos_categories_idx").using("gin", t.categories),
  ],
).enableRLS();

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: text("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    /** Comments are posted as a channel until user accounts exist. */
    authorId: text("author_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    likes: integer("likes").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("comments_video_id_idx").on(t.videoId, t.createdAt.desc())],
).enableRLS();
