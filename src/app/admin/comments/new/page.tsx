import { PageHeader, param, withParams } from "@/components/admin/ui";
import { channelOptions, videoOptions } from "@/db/admin-queries";
import { GUEST_CHANNEL_ID } from "@/lib/constants";
import { createComment } from "../actions";
import { CommentForm } from "../comment-form";

export const metadata = { title: "New comment" };

export default async function NewComment({
  searchParams,
}: PageProps<"/admin/comments/new">) {
  const video = param((await searchParams).video);
  const [videos, channels] = await Promise.all([
    videoOptions(),
    channelOptions(),
  ]);
  return (
    <>
      <PageHeader
        title="New comment"
        back={{
          href: withParams("/admin/comments", { video }),
          label: "Comments",
        }}
      />
      <CommentForm
        action={createComment}
        comment={{ videoId: video, authorId: GUEST_CHANNEL_ID }}
        videos={videos}
        channels={channels}
      />
    </>
  );
}
