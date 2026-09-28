"use client";

import { useActionState, type ReactNode } from "react";
import {
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/admin/form-controls";
import { inputClass } from "@/components/admin/ui";
import type { Option } from "@/db/admin-queries";
import type { ThumbnailArt } from "@/lib/art";
import { formatDuration } from "@/lib/format";
import { toDateTimeLocal, type FormState } from "../_lib/form";

export type VideoDefaults = {
  id: string;
  title: string;
  description: string;
  channelId: string;
  views: number;
  durationSeconds: number;
  categories: string[];
  publishedAt: Date;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  thumbnailArt: ThumbnailArt | null;
};

export function VideoForm({
  action,
  video,
  channels,
  categories,
  preview,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  /** Saved values when editing; omitted when creating. */
  video?: VideoDefaults;
  channels: Option[];
  categories: Option[];
  preview?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = state.values;
  const submittedCategories = v
    ? ([] as string[]).concat(v.categories ?? [])
    : undefined;
  const checkedCategories = new Set(
    submittedCategories ?? video?.categories ?? [],
  );

  return (
    <form
      // Rebuild the fields from each failed submission so nothing is lost.
      key={JSON.stringify(v ?? null)}
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
    >
      <FormMessage state={state} />

      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            label="Title"
            name="title"
            state={state}
            defaultValue={video?.title}
            required
          />
        </div>
        {video ? (
          <Field
            label="ID"
            name="id"
            state={state}
            hint="Used in the URL; can't be changed."
          >
            {({ id, describedBy }) => (
              <input
                id={id}
                value={video.id}
                readOnly
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        ) : (
          <TextField
            label="ID"
            name="id"
            state={state}
            placeholder="my-new-video"
            hint="Used in the URL (/watch/…). Leave blank to generate it from the title."
          />
        )}
        <SelectField
          label="Channel"
          name="channelId"
          state={state}
          defaultValue={video?.channelId}
          options={channels}
          placeholder="Choose a channel…"
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Description"
            name="description"
            state={state}
            defaultValue={video?.description}
            rows={6}
          />
        </div>
        <TextField
          label="Views"
          name="views"
          type="number"
          min={0}
          state={state}
          defaultValue={video?.views ?? 0}
        />
        <TextField
          label="Duration"
          name="duration"
          state={state}
          defaultValue={video ? formatDuration(video.durationSeconds) : ""}
          placeholder="14:21"
          hint="m:ss or h:mm:ss"
        />
        <TextField
          label="Published at (UTC)"
          name="publishedAt"
          type="datetime-local"
          state={state}
          defaultValue={toDateTimeLocal(video?.publishedAt ?? new Date())}
        />
        <Field label="Categories" name="categories" state={state}>
          {({ describedBy }) => (
            <div
              role="group"
              aria-describedby={describedBy}
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm has-checked:border-brand has-checked:bg-brand has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-brand/40"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category.value}
                    defaultChecked={checkedCategories.has(category.value)}
                    className="sr-only"
                  />
                  {category.label}
                </label>
              ))}
            </div>
          )}
        </Field>
      </section>

      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-ink">Media</h2>
          <TextField
            label="Thumbnail image URL"
            name="thumbnailUrl"
            type="url"
            state={state}
            defaultValue={video?.thumbnailUrl}
            placeholder="https://…/thumbnail.jpg"
            hint="Optional. Without it, the cartoon art below is shown."
          />
          <TextField
            label="Video file URL"
            name="videoUrl"
            type="url"
            state={state}
            defaultValue={video?.videoUrl}
            placeholder="https://…/video.mp4"
            hint="Optional. A direct link to an .mp4 or .webm file; without it the simulated player is used."
          />
          <details className="group" open={Boolean(state.errors?.thumbnailArt)}>
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Cartoon thumbnail art (JSON)
            </summary>
            <div className="mt-3">
              <TextAreaField
                label="Art"
                name="thumbnailArt"
                state={state}
                defaultValue={
                  video?.thumbnailArt
                    ? JSON.stringify(video.thumbnailArt, null, 2)
                    : ""
                }
                rows={10}
                spellCheck={false}
                className={`${inputClass} font-mono text-xs`}
                hint='Scene, characters and caption, e.g. {"scene":"forest","critters":[{"species":"fox","fur":"#e8762c","belly":"#fff4e6","eyes":"#3f8f5a","shirt":"#2f6fb5","x":160,"y":96}]}. Leave blank for none.'
              />
            </div>
          </details>
        </div>
        {preview && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-ink">Current thumbnail</p>
            <div className="aspect-video overflow-hidden rounded-lg bg-chip">
              {preview}
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <SubmitButton pending={pending}>
          {video ? "Save changes" : "Create video"}
        </SubmitButton>
      </div>
    </form>
  );
}
