"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { categories, videos } from "@/db/schema";
import {
  databaseError,
  formValues,
  invalid,
  type FormState,
} from "../_lib/form";
import { categorySchema } from "../_lib/schemas";

const duplicateSlug = {
  field: "slug",
  message: "Another category already uses this slug.",
};

export async function createCategory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  try {
    await getDb().insert(categories).values(parsed.data);
  } catch (error) {
    return databaseError(error, values, duplicateSlug);
  }
  redirect("/admin/categories?notice=created");
}

/** Saves the category; a new slug is also applied to every tagged video. */
export async function updateCategory(
  slug: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;
  try {
    const found = await getDb().transaction(async (tx) => {
      const updated = await tx
        .update(categories)
        .set(data)
        .where(eq(categories.slug, slug))
        .returning({ slug: categories.slug });
      if (updated.length === 0) return false;
      if (data.slug !== slug) {
        await tx
          .update(videos)
          .set({
            categories: sql`array_replace(${videos.categories}, ${slug}, ${data.slug})`,
          })
          .where(sql`${slug} = any(${videos.categories})`);
      }
      return true;
    });
    if (!found) return { message: "This category no longer exists.", values };
  } catch (error) {
    return databaseError(error, values, duplicateSlug);
  }
  redirect("/admin/categories?notice=updated");
}

/** Deletes the category and untags it from every video. */
export async function deleteCategory(slug: string): Promise<void> {
  await getDb().transaction(async (tx) => {
    await tx
      .update(videos)
      .set({ categories: sql`array_remove(${videos.categories}, ${slug})` })
      .where(sql`${slug} = any(${videos.categories})`);
    await tx.delete(categories).where(eq(categories.slug, slug));
  });
  redirect("/admin/categories?notice=deleted");
}
