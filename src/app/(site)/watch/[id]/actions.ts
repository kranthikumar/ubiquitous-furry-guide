"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { getDb } from "@/db";
import { channels, comments, videos } from "@/db/schema";
import { DEFAULT_GUEST } from "@/db/seed-data";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";

export type AddCommentResult = { ok: true } | { ok: false; error: string };

/**
 * Posts a comment as the shared guest "You" channel. There are no accounts
 * yet, so anyone can comment; input is validated and length-limited.
 */
export async function addComment(
  videoId: unknown,
  body: unknown,
): Promise<AddCommentResult> {
  if (typeof videoId !== "string" || typeof body !== "string") {
    return { ok: false, error: "Invalid comment." };
  }
  const text = body.trim();
  if (!text) return { ok: false, error: "Comment can't be empty." };
  if (text.length > MAX_COMMENT_LENGTH) {
    return {
      ok: false,
      error: `Comments can be at most ${MAX_COMMENT_LENGTH} characters.`,
    };
  }

  const db = getDb();
  const [video] = await db
    .select({ id: videos.id })
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1);
  if (!video) return { ok: false, error: "That video no longer exists." };

  await db.transaction(async (tx) => {
    // Recreate the guest channel if it was deleted in the admin.
    await tx
      .insert(channels)
      .values({
        id: DEFAULT_GUEST.handle,
        name: DEFAULT_GUEST.name,
        subscribers: 0,
        avatar: DEFAULT_GUEST.avatar,
      })
      .onConflictDoNothing();
    await tx
      .insert(comments)
      .values({ videoId, authorId: DEFAULT_GUEST.handle, body: text });
  });

  // Re-render the page so the saved comment replaces the optimistic one.
  refresh();
  return { ok: true };
}
