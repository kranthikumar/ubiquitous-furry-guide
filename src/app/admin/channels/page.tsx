import Link from "next/link";
import { Avatar } from "@/components/avatar";
import {
  EmptyRow,
  FilterBar,
  Notice,
  PageHeader,
  Pagination,
  param,
  TableCard,
  td,
  th,
  withParams,
} from "@/components/admin/ui";
import { listAdminChannels, pageNumber } from "@/db/admin-queries";
import { formatCount } from "@/lib/format";

export const metadata = { title: "Channels" };

export default async function AdminChannels({
  searchParams,
}: PageProps<"/admin/channels">) {
  const params = await searchParams;
  const query = param(params.q);
  const page = pageNumber(param(params.page));
  const result = await listAdminChannels({ query, page });

  return (
    <>
      <PageHeader
        title="Channels"
        action={{ href: "/admin/channels/new", label: "New channel" }}
      />
      <Notice notice={param(params.notice)} />
      <FilterBar
        action="/admin/channels"
        query={query}
        placeholder="Search name or handle"
      />
      <TableCard>
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className={th}>Channel</th>
            <th className={`${th} text-right`}>Subscribers</th>
            <th className={`${th} text-right`}>Videos</th>
            <th className={th}>Sidebar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {result.rows.length === 0 && (
            <EmptyRow colSpan={4}>No channels match.</EmptyRow>
          )}
          {result.rows.map((channel) => (
            <tr key={channel.id} className="hover:bg-surface">
              <td className={td}>
                <Link
                  href={`/admin/channels/${channel.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar channel={channel} className="size-9" />
                  <span>
                    <span className="block font-medium text-ink hover:underline">
                      {channel.name}
                    </span>
                    <span className="block text-xs text-muted">
                      @{channel.id}
                    </span>
                  </span>
                </Link>
              </td>
              <td className={`${td} text-right tabular-nums`}>
                {formatCount(channel.subscribers)}
              </td>
              <td className={`${td} text-right tabular-nums`}>
                <Link
                  href={withParams("/admin/videos", { channel: channel.id })}
                  className="hover:underline"
                >
                  {channel.videos}
                </Link>
              </td>
              <td className={td}>
                {channel.followedPosition != null ? (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                    #{channel.followedPosition}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      <Pagination
        {...result}
        href={(p) => withParams("/admin/channels", { q: query, page: p })}
      />
    </>
  );
}
