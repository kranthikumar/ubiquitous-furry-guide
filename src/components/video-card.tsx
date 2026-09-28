import Link from "next/link";
import { formatCount, formatDuration } from "@/lib/format";
import type { VideoSummary } from "@/lib/types";
import { Avatar } from "./avatar";
import { Thumbnail } from "./thumbnail";

export function VideoCard({ video }: { video: VideoSummary }) {
  const href = `/watch/${video.id}`;
  return (
    <article className="group flex flex-col gap-3">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-video overflow-hidden rounded-xl bg-chip"
      >
        <div className="size-full transition-transform duration-300 group-hover:scale-[1.03]">
          <Thumbnail id={video.id} art={video.thumbnailArt} />
        </div>
        <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white tabular-nums">
          {formatDuration(video.durationSeconds)}
        </span>
      </Link>
      <div className="flex gap-3">
        <Avatar channel={video.channel} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] leading-5 font-medium text-ink">
            <Link href={href} title={video.title}>
              {video.title}
            </Link>
          </h3>
          <p className="mt-1 truncate text-sm text-muted">
            {video.channel.name}
          </p>
          <p className="text-sm text-muted">
            {formatCount(video.views)} views • {video.published}
          </p>
        </div>
      </div>
    </article>
  );
}
