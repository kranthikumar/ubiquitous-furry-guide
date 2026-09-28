"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Menu, Search, Video } from "lucide-react";
import type { ChannelBadge } from "@/lib/types";
import { Avatar } from "./avatar";
import { PawIcon } from "./icons";
import { Logo } from "./logo";
import { SearchForm } from "./search-form";

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-full text-ink hover:bg-chip";

export function Header({
  onMenuClick,
  guest,
}: {
  onMenuClick: () => void;
  guest: ChannelBadge;
}) {
  // Below 640px the search box is replaced by an icon that expands it
  // across the whole header.
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <>
      {mobileSearch && (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 bg-surface/95 px-2 backdrop-blur sm:hidden">
          <button
            type="button"
            className={iconButton}
            onClick={() => setMobileSearch(false)}
            aria-label="Close search"
          >
            <ArrowLeft className="size-6" strokeWidth={1.75} />
          </button>
          <SearchForm id="mobile-search" autoFocus />
        </header>
      )}
      <header
        className={`sticky top-0 z-40 h-14 items-center justify-between gap-4 bg-surface/95 px-2 backdrop-blur sm:flex sm:px-4 ${mobileSearch ? "hidden" : "flex"}`}
      >
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={iconButton}
            onClick={onMenuClick}
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <Menu className="size-6" strokeWidth={1.75} />
          </button>
          <Logo />
        </div>

        <div className="hidden max-w-xl flex-1 sm:flex">
          <SearchForm id="site-search" />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className={`${iconButton} sm:hidden`}
            onClick={() => setMobileSearch(true)}
            aria-label="Open search"
          >
            <Search className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-chip md:flex"
          >
            <PawIcon className="size-4" />
            Create
          </button>
          <button
            type="button"
            className={`${iconButton} hidden sm:grid`}
            aria-label="Go live"
          >
            <Video className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="ml-1 rounded-full"
            aria-label="Your account"
          >
            <Avatar channel={guest} className="size-8" />
          </button>
        </div>
      </header>
    </>
  );
}
