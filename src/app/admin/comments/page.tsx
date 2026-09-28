import Link from "next/link";
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
import {
  listAdminComments,
  pageNumber,
  videoOptions,
} from "@/db/admin-queries";
import { formatCount } from "@/lib/format";

export const metadata = { title: "Comments" };

export default async function AdminComments({
  searchParams,
}: PageProps<"/admin/comments">) {
  const params = await searchParams;
  const query = param(params.q);
  const video = param(params.video);
  const page = pageNumber(param(params.page));
  const [result, videos] = await Promise.all([
    listAdminComments({ query, video, page }),
    videoOptions(),
  ]);

  return (
    <>
      <PageHeader
        title="Comments"
        action={{
          href: withParams("/admin/comments/new", { video }),
          label: "New comment",
        }}
      />
      <Notice notice={param(params.notice)} />
      <FilterBar
        action="/admin/comments"
        query={query}
        placeholder="Search comment text"
      >
        <select
          name="video"
          defaultValue={video ?? ""}
          aria-label="Video"
          className={filterSelectClass}
        >
          <option value="">All videos</option>
          {videos.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </FilterBar>
      <TableCard>
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className={th}>Comment</th>
            <th className={th}>Author</th>
            <th className={th}>Video</th>
            <th className={`${th} text-right`}>Likes</th>
            <th className={th}>Posted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {result.rows.length === 0 && (
            <EmptyRow colSpan={5}>No comments match.</EmptyRow>
          )}
          {result.rows.map((comment) => (
            <tr key={comment.id} className="hover:bg-surface">
              <td className={`${td} max-w-sm`}>
                <Link
                  href={`/admin/comments/${comment.id}`}
                  className="line-clamp-2 text-ink hover:underline"
                >
                  {comment.body}
                </Link>
              </td>
              <td className={`${td} whitespace-nowrap`}>
                <Link
                  href={`/admin/channels/${comment.authorId}`}
                  className="hover:underline"
                >
                  {comment.authorName}
                </Link>
              </td>
              <td className={`${td} max-w-56`}>
                <Link
                  href={withParams("/admin/comments", {
                    video: comment.videoId,
                  })}
                  className="line-clamp-1 text-muted hover:underline"
                >
                  {comment.videoTitle}
                </Link>
              </td>
              <td className={`${td} text-right tabular-nums`}>
                {formatCount(comment.likes)}
              </td>
              <td className={`${td} whitespace-nowrap text-muted`}>
                {comment.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      <Pagination
        {...result}
        href={(p) =>
          withParams("/admin/comments", { q: query, video, page: p })
        }
      />
    </>
  );
}
