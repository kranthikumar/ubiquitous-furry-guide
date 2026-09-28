"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  History,
  House,
  Library,
  SquarePlay,
  ThumbsUp,
  TvMinimalPlay,
  Zap,
} from "lucide-react";
import { followedChannels, getChannel } from "@/lib/data";
import { Avatar } from "./avatar";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
export type NavItem = { href: string; label: string; icon: Icon };
export type Tone = "light" | "dark";

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/shorts", label: "FurShorts", icon: Zap },
  { href: "/subscriptions", label: "Subscriptions", icon: TvMinimalPlay },
];

export const libraryNav: NavItem[] = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/history", label: "History", icon: History },
  { href: "/your-videos", label: "Your Videos", icon: SquarePlay },
  { href: "/watch-later", label: "Watch Later", icon: Clock },
  { href: "/liked", label: "Liked Videos", icon: ThumbsUp },
];

const toneStyles = {
  light: {
    item: "text-ink hover:bg-chip",
    active: "bg-brand text-white hover:bg-brand-hover",
    divider: "border-line",
    heading: "text-ink",
    footer: "text-muted",
  },
  dark: {
    item: "text-white hover:bg-white/10",
    active: "bg-white/15 text-white",
    divider: "border-white/15",
    heading: "text-white",
    footer: "text-white/60",
  },
} as const;

export function NavLink({
  item,
  tone = "light",
}: {
  item: NavItem;
  tone?: Tone;
}) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const styles = toneStyles[tone];
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 items-center gap-5 rounded-lg px-3 text-sm ${active ? `${styles.active} font-medium` : styles.item}`}
    >
      <Icon className="size-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function NavItems({ items, tone }: { items: NavItem[]; tone?: Tone }) {
  return items.map((item) => (
    <li key={item.href}>
      <NavLink item={item} tone={tone} />
    </li>
  ));
}

export function NavSection({
  title,
  children,
  tone = "light",
}: {
  title?: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  const styles = toneStyles[tone];
  return (
    <section className={`border-b py-3 last:border-b-0 ${styles.divider}`}>
      {title && (
        <h2
          className={`px-3 pb-1 pt-1 text-base font-semibold ${styles.heading}`}
        >
          {title}
        </h2>
      )}
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </section>
  );
}

export function ShowMoreButton({
  expanded,
  onClick,
  tone = "light",
  controls,
}: {
  expanded?: boolean;
  onClick?: () => void;
  tone?: Tone;
  controls?: string;
}) {
  const Icon = expanded ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={onClick ? expanded : undefined}
      aria-controls={controls}
      className={`flex h-10 w-full items-center gap-5 rounded-lg px-3 text-left text-sm ${toneStyles[tone].item}`}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      {expanded ? "Show less" : "Show more"}
    </button>
  );
}

const VISIBLE_CHANNELS = 4;

export function FollowedChannels({ tone = "light" }: { tone?: Tone }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded
    ? followedChannels
    : followedChannels.slice(0, VISIBLE_CHANNELS);
  const listId = `followed-channels-${tone}`;
  return (
    <section className={`border-b py-3 ${toneStyles[tone].divider}`}>
      <h2
        className={`px-3 pb-1 pt-1 text-base font-semibold ${toneStyles[tone].heading}`}
      >
        Followed Channels
      </h2>
      <ul id={listId} className="flex flex-col gap-0.5">
        {shown.map((handle) => {
          const channel = getChannel(handle);
          return (
            <li key={handle}>
              <Link
                href={`/channel/${handle}`}
                prefetch={false}
                className={`flex h-10 items-center gap-4 rounded-lg px-3 text-sm ${toneStyles[tone].item}`}
              >
                <Avatar channel={channel} className="size-6" />
                <span className="truncate">{channel.name}</span>
              </Link>
            </li>
          );
        })}
        {followedChannels.length > VISIBLE_CHANNELS && (
          <li>
            <ShowMoreButton
              tone={tone}
              expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              controls={listId}
            />
          </li>
        )}
      </ul>
    </section>
  );
}

const footerGroups = [
  [
    "About",
    "Press",
    "Copyright",
    "Contact us",
    "Creators",
    "Advertise",
    "Developers",
  ],
  [
    "Terms",
    "Privacy",
    "Policy & Safety",
    "How FurryTube works",
    "Test new features",
  ],
];

export function SiteFooter({ tone = "light" }: { tone?: Tone }) {
  return (
    <footer
      className={`px-3 py-4 text-xs font-medium ${toneStyles[tone].footer}`}
    >
      {footerGroups.map((group, i) => (
        <p key={i} className="mb-3 flex flex-wrap gap-x-2 gap-y-0.5">
          {group.map((label) => (
            <a key={label} href="#" className="hover:underline">
              {label}
            </a>
          ))}
        </p>
      ))}
      <p className="font-normal">© 2026 FurryTube LLC</p>
    </footer>
  );
}
