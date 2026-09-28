"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { comments } from "@/db/schema";
import {
  databaseError,
  formValues,
  invalid,
  type FormState,
} from "../_lib/form";
import { commentSchema } from "../_lib/schemas";
import { withParams } from "../_lib/url";

/** Back to the comment list, filtered to the comment's video. */
const listFor = (videoId: string, notice: string) =>
  withParams("/admin/comments", { video: videoId, notice });

export async function createComment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  try {
    await getDb().insert(comments).values(parsed.data);
  } catch (error) {
    return databaseError(error, values);
  }
  redirect(listFor(parsed.data.videoId, "created"));
}

export async function updateComment(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  try {
    const updated = await getDb()
      .update(comments)
      .set(parsed.data)
      .where(eq(comments.id, id))
      .returning({ id: comments.id });
    if (updated.length === 0) {
      return { message: "This comment no longer exists.", values };
    }
  } catch (error) {
    return databaseError(error, values);
  }
  redirect(listFor(parsed.data.videoId, "updated"));
}

export async function deleteComment(
  id: string,
  videoId: string,
): Promise<void> {
  await getDb().delete(comments).where(eq(comments.id, id));
  redirect(listFor(videoId, "deleted"));
}
