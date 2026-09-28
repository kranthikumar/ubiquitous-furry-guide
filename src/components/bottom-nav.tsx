"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { libraryNav, primaryNav } from "./nav";

const [home, shorts, subscriptions] = primaryNav;
const you = { ...libraryNav[0], label: "You" };

/** Phone-only tab bar, standing in for the sidebar below 768px. */
export function BottomNav() {
  const pathname = usePathname();
  const tab = (item: typeof home) => {
    const active = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        prefetch={false}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] ${active ? "font-semibold text-brand" : "text-ink"}`}
      >
        <Icon className="size-6" strokeWidth={active ? 2.25 : 1.5} />
        {item.label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(3.5rem+env(safe-area-inset-bottom))] border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {tab(home)}
      {tab(shorts)}
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-brand text-white"
          aria-label="Create"
        >
          <Plus className="size-6" />
        </button>
      </div>
      {tab(subscriptions)}
      {tab(you)}
    </nav>
  );
}
