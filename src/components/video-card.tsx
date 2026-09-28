import Link from "next/link";
import { getChannel, type Video } from "@/lib/data";
import { Avatar } from "./avatar";
import { Thumbnail } from "./thumbnail";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export function VideoCard({ video }: { video: Video }) {
  const channel = getChannel(video.channel);
  const href = `/watch/${video.id}`;
  return (
    <article className="group flex flex-col gap-3">
      <Link
        href={href}
        prefetch={false}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-video overflow-hidden rounded-xl bg-chip"
      >
        <div className="size-full transition-transform duration-300 group-hover:scale-[1.03]">
          <Thumbnail video={video} />
        </div>
        <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white tabular-nums">
          {video.duration}
        </span>
      </Link>
      <div className="flex gap-3">
        <Avatar channel={channel} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] leading-5 font-medium text-ink">
            <Link href={href} prefetch={false} title={video.title}>
              {video.title}
            </Link>
          </h3>
          <p className="mt-1 truncate text-sm text-muted">{channel.name}</p>
          <p className="text-sm text-muted">
            {compact.format(video.views)} views • {video.published}
          </p>
        </div>
      </div>
    </article>
  );
}
