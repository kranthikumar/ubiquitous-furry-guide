import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Thumbnail } from "@/components/thumbnail";
import { VideoCard } from "@/components/video-card";
import { ChannelRow } from "@/components/watch/channel-row";
import { Comments } from "@/components/watch/comments";
import { Description } from "@/components/watch/description";
import { Player } from "@/components/watch/player";
import {
  commentsFor,
  getChannel,
  getVideo,
  parseDuration,
  relatedVideos,
  videos,
} from "@/lib/data";

// Every video is known at build time, so prerender them all and 404 the rest.
export const dynamicParams = false;

export function generateStaticParams() {
  return videos.map((video) => ({ id: video.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/watch/[id]">): Promise<Metadata> {
  const video = getVideo((await params).id);
  if (!video) return {};
  return {
    title: video.title,
    description: video.description.split("\n")[0],
  };
}

const compact = new Intl.NumberFormat("en", { notation: "compact" });

/** Fake captions: the description's sentences, minus hashtags. */
function captionsFrom(description: string) {
  return description
    .replace(/#\w+/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function WatchPage({ params }: PageProps<"/watch/[id]">) {
  const video = getVideo((await params).id);
  if (!video) notFound();

  const channel = getChannel(video.channel);
  const related = relatedVideos(video);

  return (
    <div className="mx-auto grid max-w-[112rem] gap-6 sm:px-6 sm:pt-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:grid-rows-[auto_1fr] 2xl:grid-cols-[minmax(0,1fr)_30rem]">
      <div className="flex min-w-0 flex-col gap-3">
        <Player
          key={video.id}
          frame={<Thumbnail video={video} />}
          duration={parseDuration(video.duration)}
          captions={captionsFrom(video.description)}
          nextHref={related[0] && `/watch/${related[0].id}`}
        />
        <div className="flex flex-col gap-3 px-4 sm:px-0">
          <h1 className="text-lg leading-snug font-bold text-ink sm:text-xl">
            {video.title}
          </h1>
          <ChannelRow channel={channel} />
          <Description
            key={video.id}
            meta={`${compact.format(video.views)} views • ${video.published}`}
            text={video.description}
          />
        </div>
      </div>

      <aside
        aria-labelledby="up-next-heading"
        className="px-4 sm:px-0 xl:col-start-2 xl:row-span-2 xl:row-start-1"
      >
        <h2 id="up-next-heading" className="sr-only">
          Up next
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,12rem),1fr))] gap-x-4 gap-y-6">
          {related.map((other) => (
            <VideoCard key={other.id} video={other} />
          ))}
        </div>
      </aside>

      <div className="px-4 pb-4 sm:px-0">
        <Comments key={video.id} initial={commentsFor(video)} />
      </div>
    </div>
  );
}
