import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/form-controls";
import {
  PageHeader,
  secondaryButtonClass,
  withParams,
} from "@/components/admin/ui";
import { getAdminChannel, nextFollowedPosition } from "@/db/admin-queries";
import { GUEST_CHANNEL_ID } from "@/lib/constants";
import { deleteChannel, updateChannel } from "../actions";
import { ChannelForm } from "../channel-form";

export async function generateMetadata({
  params,
}: PageProps<"/admin/channels/[id]">): Promise<Metadata> {
  const channel = await getAdminChannel((await params).id);
  return { title: channel ? `Edit: ${channel.name}` : "Channel not found" };
}

export default async function EditChannel({
  params,
}: PageProps<"/admin/channels/[id]">) {
  const { id } = await params;
  const [channel, nextPosition] = await Promise.all([
    getAdminChannel(id),
    nextFollowedPosition(),
  ]);
  if (!channel) notFound();
  const isGuest = channel.id === GUEST_CHANNEL_ID;

  return (
    <>
      <PageHeader
        title="Edit channel"
        back={{ href: "/admin/channels", label: "Channels" }}
      />
      {isGuest && (
        <p className="mb-4 rounded-lg border border-line bg-white px-3 py-2 text-sm text-muted">
          This is the shared guest everyone comments as (shown in the site
          header). If you delete it, it is recreated with default looks on the
          next comment.
        </p>
      )}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={withParams("/admin/videos", { channel: channel.id })}
          className={secondaryButtonClass}
        >
          Videos ({channel.videos})
        </Link>
        <DeleteButton
          action={deleteChannel.bind(null, channel.id)}
          title="Delete this channel?"
        >
          <p>
            <strong className="text-ink">{channel.name}</strong> will be
            permanently deleted, together with its {channel.videos}{" "}
            {channel.videos === 1 ? "video" : "videos"} and {channel.comments}{" "}
            {channel.comments === 1 ? "comment" : "comments"} (comments it
            posted and comments on its videos).
          </p>
        </DeleteButton>
      </div>
      <ChannelForm
        action={updateChannel.bind(null, channel.id)}
        channel={channel}
        nextPosition={nextPosition}
      />
    </>
  );
}
