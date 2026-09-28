import Link from "next/link";
import { PlayCircle } from "lucide-react";
import {
  EmptyRow,
  FilterBar,
  filterSelectClass,
  Notice,
  PageHeader,
  Pagination,
  param,
  TableCard,
  td,
  th,
  withParams,
} from "@/components/admin/ui";
import { VideoThumbnail } from "@/components/video-thumbnail";
import {
  categoryOptions,
  channelOptions,
  listAdminVideos,
  pageNumber,
} from "@/db/admin-queries";
import { formatCount, formatDuration } from "@/lib/format";

export const metadata = { title: "Videos" };

export default async function AdminVideos({
  searchParams,
}: PageProps<"/admin/videos">) {
  const params = await searchParams;
  const query = param(params.q);
  const category = param(params.category);
  const channel = param(params.channel);
  const page = pageNumber(param(params.page));

  const [result, categories, channels] = await Promise.all([
    listAdminVideos({ query, category, channel, page }),
    categoryOptions(),
    channelOptions(),
  ]);

  return (
    <>
      <PageHeader
        title="Videos"
        action={{ href: "/admin/videos/new", label: "New video" }}
      />
      <Notice notice={param(params.notice)} />
      <FilterBar
        action="/admin/videos"
        query={query}
        placeholder="Search title or id"
      >
        <select
          name="category"
          defaultValue={category ?? ""}
          aria-label="Category"
          className={filterSelectClass}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          name="channel"
          defaultValue={channel ?? ""}
          aria-label="Channel"
          className={filterSelectClass}
        >
          <option value="">All channels</option>
          {channels.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </FilterBar>

      <TableCard>
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className={th}>Video</th>
            <th className={th}>Channel</th>
            <th className={`${th} text-right`}>Views</th>
            <th className={`${th} text-right`}>Comments</th>
            <th className={th}>Published</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {result.rows.length === 0 && (
            <EmptyRow colSpan={5}>No videos match.</EmptyRow>
          )}
          {result.rows.map((video) => (
            <tr key={video.id} className="hover:bg-surface">
              <td className={td}>
                <Link
                  href={`/admin/videos/${video.id}`}
                  className="flex items-center gap-3"
                >
                  <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-chip">
                    <VideoThumbnail video={video} />
                    <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 text-[10px] text-white tabular-nums">
                      {formatDuration(video.durationSeconds)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 font-medium text-ink hover:underline">
                      {video.title}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      {video.id}
                      {video.hasVideo && (
                        <PlayCircle
                          className="size-3.5 text-brand"
                          aria-label="Has a video file"
                        />
                      )}
                    </span>
                  </span>
                </Link>
              </td>
              <td className={td}>
                <Link
                  href={`/admin/channels/${video.channelId}`}
                  className="text-ink hover:underline"
                >
                  {video.channelName}
                </Link>
              </td>
              <td className={`${td} text-right tabular-nums`}>
                {formatCount(video.views)}
              </td>
              <td className={`${td} text-right tabular-nums`}>
                <Link
                  href={withParams("/admin/comments", { video: video.id })}
                  className="hover:underline"
                >
                  {video.comments}
                </Link>
              </td>
              <td className={`${td} whitespace-nowrap text-muted`}>
                {video.publishedAt.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      <Pagination
        {...result}
        href={(p) =>
          withParams("/admin/videos", { q: query, category, channel, page: p })
        }
      />
    </>
  );
}
