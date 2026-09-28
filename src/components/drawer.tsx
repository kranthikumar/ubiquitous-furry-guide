"use client";

import { useEffect, useRef } from "react";
import {
  Clapperboard,
  Download,
  Flag,
  Menu,
  Music,
  ShoppingBag,
  SquarePlay,
} from "lucide-react";
import type { ChannelBadge } from "@/lib/types";
import { PawIcon } from "./icons";
import { Logo } from "./logo";
import {
  FollowedChannels,
  libraryNav,
  NavItems,
  NavSection,
  primaryNav,
  ShowMoreButton,
  SiteFooter,
  type NavItem,
} from "./nav";

function RedPaw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-paw">
      <PawIcon {...props} className="size-3 text-white" />
    </span>
  );
}

const youNav: NavItem[] = [
  { href: "/your-videos", label: "Your videos", icon: SquarePlay },
  { href: "/downloads", label: "Downloads", icon: Download },
];

const moreNav: NavItem[] = [
  { href: "/premium", label: "FurryTube Premium", icon: RedPaw },
  { href: "/music", label: "FurryTube Music", icon: RedPaw },
  { href: "/kids", label: "FurryTube Kids", icon: RedPaw },
];

const exploreNav: NavItem[] = [
  { href: "/shopping", label: "Shopping", icon: ShoppingBag },
  { href: "/explore/music", label: "Music", icon: Music },
  { href: "/movies", label: "Movies & TV", icon: Clapperboard },
];

const reportNav: NavItem[] = [
  { href: "/report-history", label: "Report history", icon: Flag },
];

/**
 * Slide-out menu opened from the header's hamburger button. On desktop it
 * sits beside the sidebar; below 1024px, where the full sidebar is hidden,
 * it also carries the main navigation.
 */
export function Drawer({
  open,
  onClose,
  followed,
}: {
  open: boolean;
  onClose: () => void;
  followed: ChannelBadge[];
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Menu"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog element itself is a click on the backdrop;
        // a click on any link inside should also dismiss the menu.
        const target = event.target as HTMLElement;
        if (target === ref.current || target.closest("a")) onClose();
      }}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] overflow-hidden bg-drawer p-0 text-white backdrop:bg-black/50 open:animate-drawer-in md:left-18 lg:left-60"
    >
      <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-3 [scrollbar-color:var(--color-white)_transparent] [scrollbar-width:thin]">
        <div className="-mx-3 flex h-14 shrink-0 items-center gap-2 px-4 md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-white/10"
            aria-label="Close menu"
          >
            <Menu className="size-6" />
          </button>
          <Logo className="text-white" />
        </div>

        <div className="lg:hidden">
          <NavSection tone="dark">
            <NavItems items={primaryNav} tone="dark" />
          </NavSection>
          <NavSection tone="dark">
            <NavItems items={libraryNav} tone="dark" />
          </NavSection>
          <FollowedChannels channels={followed} tone="dark" />
        </div>

        <NavSection tone="dark">
          <NavItems items={youNav} tone="dark" />
          <li>
            <ShowMoreButton tone="dark" />
          </li>
        </NavSection>
        <NavSection title="More from FurryTube" tone="dark">
          <NavItems items={moreNav} tone="dark" />
        </NavSection>
        <NavSection title="Explore" tone="dark">
          <NavItems items={exploreNav} tone="dark" />
          <li>
            <ShowMoreButton tone="dark" />
          </li>
        </NavSection>
        <NavSection tone="dark">
          <NavItems items={reportNav} tone="dark" />
        </NavSection>
        <SiteFooter tone="dark" />
      </div>
    </dialog>
  );
}
