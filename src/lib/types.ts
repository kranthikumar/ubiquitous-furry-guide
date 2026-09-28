// Shapes the database layer hands to pages and components. Plain data only,
// so they cross the server/client boundary unchanged.
import type { AvatarArt, ThumbnailArt } from "@/lib/art";

export type ChannelSummary = {
  /** The channel handle, e.g. "fuzzbuttvlogs". */
  id: string;
  name: string;
  subscribers: number;
  avatar: AvatarArt;
};

/** Just enough of a channel to show its name and avatar. */
export type ChannelBadge = Pick<ChannelSummary, "id" | "name" | "avatar">;

export type Category = { slug: string; label: string };

export type VideoSummary = {
  id: string;
  title: string;
  views: number;
  durationSeconds: number;
  /** Relative label computed at request time, e.g. "3 days ago". */
  published: string;
  thumbnailArt: ThumbnailArt | null;
  /** Real thumbnail image; falls back to thumbnailArt when null. */
  thumbnailUrl: string | null;
  channel: ChannelSummary;
};

export type VideoDetail = VideoSummary & {
  description: string;
  /** Real video file; the simulated player is used when null. */
  videoUrl: string | null;
};

export type CommentView = {
  id: string;
  body: string;
  likes: number;
  /** Relative label, e.g. "5 minutes ago". */
  published: string;
  /** Milliseconds since the epoch, for sorting. */
  createdAt: number;
  author: ChannelBadge;
};
