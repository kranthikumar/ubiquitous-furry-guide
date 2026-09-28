import { z } from "zod";
import { SCENES, SPECIES } from "@/lib/art";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import { parseDuration } from "@/lib/format";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Required.")
  .max(80, "At most 80 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single dashes.",
  );

const requiredText = (max: number) =>
  z.string().trim().min(1, "Required.").max(max, `At most ${max} characters.`);

const count = (max = 1e12) =>
  z.coerce
    .number({ error: "Enter a number." })
    .int("Whole numbers only.")
    .min(0, "Can't be negative.")
    .max(max, "Too large.");

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #1f2a44.");

/** Blank → null; otherwise must be an http(s) URL. */
const optionalUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(
    z
      .url({ protocol: /^https?$/, error: "Enter a full http(s):// URL." })
      .max(2000)
      .nullable(),
  );

/** A single-value checkbox list arrives as a string, none as undefined. */
const stringList = z.preprocess(
  (v) => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]),
  z.array(z.string()),
);

const checkbox = z.preprocess((v) => v === "on", z.boolean());

const critter = z.object({
  species: z.enum(SPECIES),
  fur: hex,
  belly: hex,
  eyes: hex,
  shirt: hex,
  x: z.number().optional(),
  y: z.number().optional(),
  scale: z.number().positive().max(5).optional(),
  flip: z.boolean().optional(),
  sketch: z.boolean().optional(),
});

const thumbnailArt = z.object({
  scene: z.enum(SCENES),
  critters: z.array(critter).max(6),
  caption: z.array(z.string().max(24)).max(6).optional(),
});

/** JSON text for the cartoon thumbnail; blank means none. */
const thumbnailArtJson = z
  .string()
  .trim()
  .transform((text, ctx) => {
    if (!text) return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "Not valid JSON." });
      return z.NEVER;
    }
  })
  .pipe(thumbnailArt.nullable());

const duration = z
  .string()
  .trim()
  .transform((text, ctx) => {
    const seconds = parseDuration(text);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Use m:ss or h:mm:ss, e.g. 14:21.",
      });
      return z.NEVER;
    }
    return seconds;
  });

/** <input type="datetime-local"> value, interpreted as UTC. */
const utcDateTime = z
  .string()
  .trim()
  .min(1, "Required.")
  .transform((text, ctx) => {
    const date = new Date(`${text}${text.length === 16 ? ":00" : ""}Z`);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Enter a date and time." });
      return z.NEVER;
    }
    return date;
  });

export const videoSchema = z.object({
  id: slug,
  title: requiredText(200),
  description: z.string().trim().max(5000, "At most 5000 characters."),
  channelId: z.string().min(1, "Choose a channel."),
  views: count(),
  duration,
  categories: stringList,
  publishedAt: utcDateTime,
  thumbnailUrl: optionalUrl,
  videoUrl: optionalUrl,
  thumbnailArt: thumbnailArtJson,
});

export const channelSchema = z.object({
  id: slug,
  name: requiredText(80),
  subscribers: count(),
  species: z.enum(SPECIES, { error: "Choose a species." }),
  fur: hex,
  belly: hex,
  eyes: hex,
  shirt: hex,
  bg: hex,
  followed: checkbox,
  // Not submitted while the "show in sidebar" box is unticked.
  followedPosition: z.preprocess(
    (v) => (v === undefined || v === "" ? 0 : v),
    count(9999),
  ),
});

export const commentSchema = z.object({
  videoId: z.string().min(1, "Choose a video."),
  authorId: z.string().min(1, "Choose an author."),
  body: requiredText(MAX_COMMENT_LENGTH),
  likes: count(),
});

export const categorySchema = z.object({
  slug,
  label: requiredText(40),
  position: count(9999),
});
