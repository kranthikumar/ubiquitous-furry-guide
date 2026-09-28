import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DeleteButton } from "@/components/admin/form-controls";
import {
  PageHeader,
  secondaryButtonClass,
  withParams,
} from "@/components/admin/ui";
import {
  channelOptions,
  getAdminComment,
  videoOptions,
} from "@/db/admin-queries";
import { deleteComment, updateComment } from "../actions";
import { CommentForm } from "../comment-form";

export const metadata = { title: "Edit comment" };

export default async function EditComment({
  params,
}: PageProps<"/admin/comments/[id]">) {
  const { id } = await params;
  const [comment, videos, channels] = await Promise.all([
    getAdminComment(id),
    videoOptions(),
    channelOptions(),
  ]);
  if (!comment) notFound();

  return (
    <>
      <PageHeader
        title="Edit comment"
        back={{
          href: withParams("/admin/comments", { video: comment.videoId }),
          label: "Comments",
        }}
      />
      <p className="mb-4 text-sm text-muted">
        Posted {comment.createdAt.toISOString().slice(0, 16).replace("T", " ")}{" "}
        UTC
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/watch/${comment.videoId}`}
          className={secondaryButtonClass}
        >
          <ExternalLink className="size-4" />
          View video
        </Link>
        <DeleteButton
          action={deleteComment.bind(null, comment.id, comment.videoId)}
          title="Delete this comment?"
        >
          <p className="line-clamp-4 italic">“{comment.body}”</p>
        </DeleteButton>
      </div>
      <CommentForm
        action={updateComment.bind(null, comment.id)}
        comment={comment}
        videos={videos}
        channels={channels}
      />
    </>
  );
}
