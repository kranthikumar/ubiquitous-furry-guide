"use client";

import { useActionState, useState } from "react";
import { Avatar } from "@/components/avatar";
import {
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  TextField,
  valueOf,
} from "@/components/admin/form-controls";
import { inputClass } from "@/components/admin/ui";
import { SPECIES, type AvatarArt, type Species } from "@/lib/art";
import type { FormState, FormValues } from "../_lib/form";

export type ChannelDefaults = {
  id: string;
  name: string;
  subscribers: number;
  avatar: AvatarArt;
  followedPosition: number | null;
};

const DEFAULT_AVATAR: AvatarArt = {
  species: "fox",
  fur: "#e8762c",
  belly: "#fff4e6",
  eyes: "#3f8f5a",
  shirt: "#2f6fb5",
  bg: "#fde2cf",
};

const COLOURS = [
  ["fur", "Fur"],
  ["belly", "Muzzle & chest"],
  ["eyes", "Eyes"],
  ["shirt", "Shirt"],
  ["bg", "Background"],
] as const;

const AVATAR_FIELDS = new Set<string>(["species", ...COLOURS.map(([k]) => k)]);

/** The avatar as last submitted, falling back to the saved one. */
function avatarFrom(
  values: FormValues | undefined,
  saved: AvatarArt,
): AvatarArt {
  const pick = (key: keyof AvatarArt) =>
    valueOf(values, key, String(saved[key]));
  return {
    species: pick("species") as Species,
    fur: pick("fur"),
    belly: pick("belly"),
    eyes: pick("eyes"),
    shirt: pick("shirt"),
    bg: pick("bg"),
  };
}

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  channel?: ChannelDefaults;
  /** Pre-filled sidebar position for channels not yet in the sidebar. */
  nextPosition: number;
};

export function ChannelForm(props: Props) {
  const [state, formAction, pending] = useActionState(props.action, {});
  return (
    <ChannelFields
      // Rebuild the fields (and the preview) from each failed submission.
      key={JSON.stringify(state.values ?? null)}
      {...props}
      state={state}
      formAction={formAction}
      pending={pending}
    />
  );
}

function ChannelFields({
  channel,
  nextPosition,
  state,
  formAction,
  pending,
}: Props & {
  state: FormState;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  const saved = channel?.avatar ?? DEFAULT_AVATAR;
  const [avatar, setAvatar] = useState(() => avatarFrom(state.values, saved));
  const [followed, setFollowed] = useState(
    state.values
      ? state.values.followed === "on"
      : channel?.followedPosition != null,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
      onChange={(event) => {
        const target = event.target as EventTarget;
        if (
          !(
            target instanceof HTMLInputElement ||
            target instanceof HTMLSelectElement
          )
        ) {
          return;
        }
        const { name, value } = target;
        if (AVATAR_FIELDS.has(name)) {
          setAvatar((current) => ({ ...current, [name]: value }));
        }
      }}
    >
      <FormMessage state={state} />

      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          state={state}
          defaultValue={channel?.name}
          required
        />
        {channel ? (
          <Field
            label="Handle"
            name="id"
            state={state}
            hint="Used in URLs and as @handle; can't be changed."
          >
            {({ id, describedBy }) => (
              <input
                id={id}
                value={channel.id}
                readOnly
                aria-describedby={describedBy}
                className={inputClass}
              />
            )}
          </Field>
        ) : (
          <TextField
            label="Handle"
            name="id"
            state={state}
            placeholder="newchannel"
            hint="Lowercase letters, numbers and dashes."
          />
        )}
        <TextField
          label="Subscribers"
          name="subscribers"
          type="number"
          min={0}
          state={state}
          defaultValue={channel?.subscribers ?? 0}
        />
      </section>

      <section className="grid gap-6 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-[1fr_auto]">
        <div className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold text-ink sm:col-span-2">Avatar</h2>
          <SelectField
            label="Species"
            name="species"
            state={state}
            defaultValue={saved.species}
            options={SPECIES.map((s) => ({
              value: s,
              label: s[0].toUpperCase() + s.slice(1),
            }))}
          />
          {COLOURS.map(([key, label]) => (
            <Field key={key} label={label} name={key} state={state}>
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  name={key}
                  type="color"
                  defaultValue={valueOf(state.values, key, saved[key])}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className="h-10 w-full cursor-pointer rounded-lg border border-line bg-white p-1"
                />
              )}
            </Field>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-ink">Preview</p>
          <Avatar channel={{ avatar }} className="size-32" />
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-line bg-white p-4 sm:p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-ink">Sidebar</h2>
          <p className="text-sm text-muted">
            Channels listed under “Followed Channels” on the site.
          </p>
        </div>
        <label className="flex items-center gap-2 self-center text-sm text-ink">
          <input
            type="checkbox"
            name="followed"
            checked={followed}
            onChange={(e) => setFollowed(e.target.checked)}
            className="size-4 accent-brand"
          />
          Show in the sidebar
        </label>
        <TextField
          label="Position"
          name="followedPosition"
          type="number"
          min={0}
          state={state}
          defaultValue={channel?.followedPosition ?? nextPosition}
          disabled={!followed}
          hint="Lower numbers appear first."
        />
      </section>

      <div className="flex justify-end">
        <SubmitButton pending={pending}>
          {channel ? "Save changes" : "Create channel"}
        </SubmitButton>
      </div>
    </form>
  );
}
