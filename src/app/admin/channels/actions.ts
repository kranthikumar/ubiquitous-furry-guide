"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { getDb } from "@/db";
import { channels, followedChannels } from "@/db/schema";
import type { AvatarArt } from "@/lib/art";
import {
  databaseError,
  formValues,
  invalid,
  type FormState,
} from "../_lib/form";
import { channelSchema } from "../_lib/schemas";

type ChannelInput = z.infer<typeof channelSchema>;
type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

function avatarOf(data: ChannelInput): AvatarArt {
  const { species, fur, belly, eyes, shirt, bg } = data;
  return { species, fur, belly, eyes, shirt, bg };
}

/** Adds, moves or removes the channel in the sidebar's followed list. */
async function syncFollowed(tx: Tx, id: string, data: ChannelInput) {
  if (data.followed) {
    await tx
      .insert(followedChannels)
      .values({ channelId: id, position: data.followedPosition })
      .onConflictDoUpdate({
        target: followedChannels.channelId,
        set: { position: data.followedPosition },
      });
  } else {
    await tx.delete(followedChannels).where(eq(followedChannels.channelId, id));
  }
}

export async function createChannel(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = channelSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;
  try {
    await getDb().transaction(async (tx) => {
      await tx.insert(channels).values({
        id: data.id,
        name: data.name,
        subscribers: data.subscribers,
        avatar: avatarOf(data),
      });
      await syncFollowed(tx, data.id, data);
    });
  } catch (error) {
    return databaseError(error, values, {
      field: "id",
      message: "Another channel already uses this handle.",
    });
  }
  redirect("/admin/channels?notice=created");
}

export async function updateChannel(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData);
  const parsed = channelSchema.safeParse({ ...values, id });
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;
  try {
    const found = await getDb().transaction(async (tx) => {
      const updated = await tx
        .update(channels)
        .set({
          name: data.name,
          subscribers: data.subscribers,
          avatar: avatarOf(data),
        })
        .where(eq(channels.id, id))
        .returning({ id: channels.id });
      if (updated.length === 0) return false;
      await syncFollowed(tx, id, data);
      return true;
    });
    if (!found) return { message: "This channel no longer exists.", values };
  } catch (error) {
    return databaseError(error, values);
  }
  redirect("/admin/channels?notice=updated");
}

/** Deletes the channel with its videos, comments and sidebar entry. */
export async function deleteChannel(id: string): Promise<void> {
  await getDb().delete(channels).where(eq(channels.id, id));
  redirect("/admin/channels?notice=deleted");
}
