import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { PawIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · FurryTube Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-white px-4">
        <Link href="/admin" className="flex items-center gap-2 text-ink">
          <PawIcon className="size-6" />
          <span className="font-bold">FurryTube</span>
          <span className="rounded bg-chip px-1.5 py-0.5 text-xs font-medium text-muted">
            Admin
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          View site
          <ExternalLink className="size-4" />
        </Link>
      </header>
      <p className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        <ShieldAlert className="size-4 shrink-0" />
        This admin has no login yet: anyone with the URL can change or delete
        content. Add authentication before sharing it.
      </p>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b border-line bg-white md:w-56 md:shrink-0 md:border-r md:border-b-0">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
