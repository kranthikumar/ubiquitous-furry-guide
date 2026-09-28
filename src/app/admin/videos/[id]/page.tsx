import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DeleteButton } from "@/components/admin/form-controls";
import {
  PageHeader,
  secondaryButtonClass,
  withParams,
} from "@/components/admin/ui";
import { VideoThumbnail } from "@/components/video-thumbnail";
import {
  categoryOptions,
  channelOptions,
  getAdminVideo,
  listAdminComments,
} from "@/db/admin-queries";
import { deleteVideo, updateVideo } from "../actions";
import { VideoForm } from "../video-form";

export async function generateMetadata({
  params,
}: PageProps<"/admin/videos/[id]">): Promise<Metadata> {
  const video = await getAdminVideo((await params).id);
  return { title: video ? `Edit: ${video.title}` : "Video not found" };
}

export default async function EditVideo({
  params,
}: PageProps<"/admin/videos/[id]">) {
  const { id } = await params;
  const [video, channels, categories, comments] = await Promise.all([
    getAdminVideo(id),
    channelOptions(),
    categoryOptions(),
    listAdminComments({ video: id, page: 1 }),
  ]);
  if (!video) notFound();

  return (
    <>
      <PageHeader
        title="Edit video"
        back={{ href: "/admin/videos", label: "Videos" }}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={`/watch/${video.id}`} className={secondaryButtonClass}>
          <ExternalLink className="size-4" />
          View on site
        </Link>
        <Link
          href={withParams("/admin/comments", { video: video.id })}
          className={secondaryButtonClass}
        >
          Comments ({comments.total})
        </Link>
        <DeleteButton
          action={deleteVideo.bind(null, video.id)}
          title="Delete this video?"
        >
          <p>
            <strong className="text-ink">{video.title}</strong> and its{" "}
            {comments.total} {comments.total === 1 ? "comment" : "comments"}{" "}
            will be permanently deleted.
          </p>
        </DeleteButton>
      </div>
      <VideoForm
        action={updateVideo.bind(null, video.id)}
        video={video}
        channels={channels}
        categories={categories}
        preview={<VideoThumbnail video={video} />}
      />
    </>
  );
}
