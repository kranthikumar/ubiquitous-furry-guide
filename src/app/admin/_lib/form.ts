import type { z } from "zod";

/** What admin form actions hand back to `useActionState`. */
export type FormState = {
  /** Field name → messages. */
  errors?: Record<string, string[]>;
  /** Form-level error, e.g. a database failure. */
  message?: string;
  /** The submitted values, so the form can show them again after an error. */
  values?: FormValues;
};

export type FormValues = Record<string, string | string[]>;

/** Plain values from a submitted form; repeated keys become arrays. */
export function formValues(formData: FormData): FormValues {
  const values: FormValues = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue; // React's own fields
    const all = formData
      .getAll(key)
      .filter((v): v is string => typeof v === "string");
    values[key] = all.length > 1 ? all : (all[0] ?? "");
  }
  return values;
}

/** Validation errors keyed by top-level field, with nested paths spelled out. */
export function invalid(error: z.ZodError, values: FormValues): FormState {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const [field = "form", ...rest] = issue.path.map(String);
    const where = rest.length ? `${rest.join(".")}: ` : "";
    (errors[field] ??= []).push(where + issue.message);
  }
  return { errors, values };
}

type PgError = { code?: string; constraint_name?: string };

/** Turns a database error into a message the admin can act on. */
export function databaseError(
  error: unknown,
  values: FormValues,
  duplicate?: { field: string; message: string },
): FormState {
  const cause = ((error as { cause?: unknown })?.cause ?? error) as PgError;
  if (cause?.code === "23505" && duplicate) {
    return { errors: { [duplicate.field]: [duplicate.message] }, values };
  }
  if (cause?.code === "23503") {
    return {
      message: "A linked record no longer exists. Reload and try again.",
      values,
    };
  }
  console.error("[admin] database error", error);
  return { message: "Saving failed. Please try again.", values };
}

/** "My Great Video!" → "my-great-video". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** Value for <input type="datetime-local">, in UTC. */
export function toDateTimeLocal(date: Date): string {
  return date.toISOString().slice(0, 16);
}
