import Link from "next/link";
import { Film, MessageSquare, Tags, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { dashboardCounts } from "@/db/admin-queries";

export default async function AdminDashboard() {
  const counts = await dashboardCounts();
  const cards = [
    {
      href: "/admin/videos",
      label: "Videos",
      value: counts.videos,
      icon: Film,
    },
    {
      href: "/admin/channels",
      label: "Channels",
      value: counts.channels,
      icon: Users,
      note: `${counts.followed} in sidebar`,
    },
    {
      href: "/admin/comments",
      label: "Comments",
      value: counts.comments,
      icon: MessageSquare,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      value: counts.categories,
      icon: Tags,
    },
  ];
  return (
    <>
      <PageHeader title="Dashboard" />
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4">
        {cards.map(({ href, label, value, icon: Icon, note }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4 hover:border-brand"
            >
              <span className="flex items-center gap-2 text-sm text-muted">
                <Icon className="size-4" />
                {label}
              </span>
              <span className="text-3xl font-bold text-ink tabular-nums">
                {value}
              </span>
              {note && <span className="text-xs text-muted">{note}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
