"use client";

import { useActionState } from "react";
import {
  FormMessage,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/admin/form-controls";
import type { Option } from "@/db/admin-queries";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import type { FormState } from "../_lib/form";

export type CommentDefaults = {
  videoId: string;
  authorId: string;
  body: string;
  likes: number;
};

export function CommentForm({
  action,
  comment,
  videos,
  channels,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  /** Saved values when editing; initial selections when creating. */
  comment: Partial<CommentDefaults>;
  videos: Option[];
  channels: Option[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const editing = comment.body !== undefined;
  return (
    <form
      key={JSON.stringify(state.values ?? null)}
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
    >
      <FormMessage state={state} />
      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-2">
        <SelectField
          label="Video"
          name="videoId"
          state={state}
          defaultValue={comment.videoId}
          options={videos}
          placeholder="Choose a video…"
        />
        <SelectField
          label="Author"
          name="authorId"
          state={state}
          defaultValue={comment.authorId}
          options={channels}
          placeholder="Choose a channel…"
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Comment"
            name="body"
            state={state}
            defaultValue={comment.body}
            rows={5}
            maxLength={MAX_COMMENT_LENGTH}
          />
        </div>
        <TextField
          label="Likes"
          name="likes"
          type="number"
          min={0}
          state={state}
          defaultValue={comment.likes ?? 0}
        />
      </section>
      <div className="flex justify-end">
        <SubmitButton pending={pending}>
          {editing ? "Save changes" : "Post comment"}
        </SubmitButton>
      </div>
    </form>
  );
}
