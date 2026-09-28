"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  LayoutDashboard,
  MessageSquare,
  Tags,
  Users,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Videos", icon: Film },
  { href: "/admin/channels", label: "Channels", icon: Users },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

/** Vertical nav on wide screens, a scrollable tab row on phones. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:flex-col md:px-3 md:py-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${
                  active
                    ? "bg-brand font-medium text-white"
                    : "text-ink hover:bg-chip"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
