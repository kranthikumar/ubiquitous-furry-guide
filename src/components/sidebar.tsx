"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FollowedChannels,
  libraryNav,
  NavItems,
  NavSection,
  primaryNav,
  SiteFooter,
} from "./nav";

const railItems = [...primaryNav, { ...libraryNav[0], label: "You" }];

/** Full sidebar (≥1024px) and compact icon rail (768–1023px). Hidden on phones. */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-18 shrink-0 flex-col gap-1 overflow-y-auto px-1 py-2 md:flex lg:hidden"
      >
        {railItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1.5 rounded-lg py-4 text-[10px] ${active ? "bg-brand text-white" : "text-ink hover:bg-chip"}`}
            >
              <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Main"
        className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 flex-col overflow-y-auto border-r border-line px-3 [scrollbar-width:thin] lg:flex"
      >
        <NavSection>
          <NavItems items={primaryNav} />
        </NavSection>
        <NavSection>
          <NavItems items={libraryNav} />
        </NavSection>
        <FollowedChannels />
        <SiteFooter />
      </nav>
    </>
  );
}
