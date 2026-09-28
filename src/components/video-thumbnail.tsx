import type { VideoSummary } from "@/lib/types";
import { Thumbnail } from "./thumbnail";

/** The real thumbnail image when one is set, otherwise the cartoon art. */
export function VideoThumbnail({
  video,
}: {
  video: Pick<VideoSummary, "id" | "thumbnailArt" | "thumbnailUrl">;
}) {
  if (video.thumbnailUrl) {
    return (
      // Thumbnails can live on any host, which next/image would need listed
      // in next.config.ts; a plain lazy-loaded <img> avoids that.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={video.thumbnailUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="block size-full object-cover"
      />
    );
  }
  return <Thumbnail id={video.id} art={video.thumbnailArt} />;
}
