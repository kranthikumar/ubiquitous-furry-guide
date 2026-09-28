"use client";

import { useActionState } from "react";
import {
  FormMessage,
  SubmitButton,
  TextField,
} from "@/components/admin/form-controls";
import type { FormState } from "../_lib/form";

export type CategoryDefaults = {
  slug: string;
  label: string;
  position: number;
};

export function CategoryForm({
  action,
  category,
  nextPosition,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  category?: CategoryDefaults;
  nextPosition: number;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      key={JSON.stringify(state.values ?? null)}
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
    >
      <FormMessage state={state} />
      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-3">
        <TextField
          label="Label"
          name="label"
          state={state}
          defaultValue={category?.label}
          placeholder="Species Focus"
          required
        />
        <TextField
          label="Slug"
          name="slug"
          state={state}
          defaultValue={category?.slug}
          placeholder="species"
          hint={
            category
              ? "Used in ?category= links. Changing it updates every tagged video."
              : "Used in ?category= links."
          }
        />
        <TextField
          label="Position"
          name="position"
          type="number"
          min={0}
          state={state}
          defaultValue={category?.position ?? nextPosition}
          hint="Chip order on the home page; lower first."
        />
      </section>
      <div className="flex justify-end">
        <SubmitButton pending={pending}>
          {category ? "Save changes" : "Create category"}
        </SubmitButton>
      </div>
    </form>
  );
}
