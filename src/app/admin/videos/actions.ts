"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { getDb } from "@/db";
import { categories, videos } from "@/db/schema";
import {
  databaseError,
  formValues,
  invalid,
  slugify,
  type FormState,
  type FormValues,
} from "../_lib/form";
import { videoSchema } from "../_lib/schemas";

const duplicateId = {
  field: "id",
  message: "Another video already uses this id.",
};

/** Validates the form; unknown category slugs are reported, not saved. */
async function parseVideo(values: FormValues, id: string) {
  const parsed = videoSchema.safeParse({ ...values, id });
  if (!parsed.success) return { error: invalid(parsed.error, values) };

  const known = new Set(
    (await getDb().select({ slug: categories.slug }).from(categories)).map(
      (c) => c.slug,
    ),
  );
  const unknown = parsed.data.categories.filter((slug) => !known.has(slug));
  if (unknown.length) {
    return {
      error: {
        errors: { categories: [`Unknown categories: ${unknown.join(", ")}`] },
        values,
      } satisfies FormState,
    };
  }
  return { data: toRow(parsed.data) };
}

function toRow({ duration, ...data }: z.infer<typeof videoSchema>) {
  return { ...data, durationSeconds: duration };
}

export async function createVideo(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const id =
    String(values.id ?? "").trim() || slugify(String(values.title ?? ""));
  const result = await parseVideo(values, id);
  if (result.error) return result.error;
  try {
    await getDb().insert(videos).values(result.data);
  } catch (error) {
    return databaseError(error, values, duplicateId);
  }
  redirect("/admin/videos?notice=created");
}

export async function updateVideo(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const result = await parseVideo(values, id);
  if (result.error) return result.error;
  // The id is fixed after creation; undefined leaves it untouched.
  const changes = { ...result.data, id: undefined };
  try {
    const updated = await getDb()
      .update(videos)
      .set(changes)
      .where(eq(videos.id, id))
      .returning({ id: videos.id });
    if (updated.length === 0) {
      return { message: "This video no longer exists.", values };
    }
  } catch (error) {
    return databaseError(error, values);
  }
  redirect("/admin/videos?notice=updated");
}

/** Deletes the video and (by cascade) its comments. */
export async function deleteVideo(id: string): Promise<void> {
  await getDb().delete(videos).where(eq(videos.id, id));
  redirect("/admin/videos?notice=deleted");
}
