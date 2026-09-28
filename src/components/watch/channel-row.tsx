"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, Check, Share2 } from "lucide-react";
import { formatCount } from "@/lib/format";
import type { ChannelSummary } from "@/lib/types";
import { Avatar } from "../avatar";

export function ChannelRow({ channel }: { channel: ChannelSummary }) {
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const subscribers = channel.subscribers + (subscribed ? 1 : 0);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; there's nothing useful to do.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
      <Link
        href={`/channel/${channel.id}`}
        prefetch={false}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar channel={channel} className="size-10" />
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">
            {channel.name}
          </span>
          <span className="block text-xs text-muted">
            {formatCount(subscribers)} subscribers
          </span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href={`/channel/${channel.id}/join`}
          prefetch={false}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-chip"
        >
          Join
        </Link>
        <button
          type="button"
          onClick={() => setSubscribed((s) => !s)}
          aria-pressed={subscribed}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${
            subscribed
              ? "bg-chip text-ink hover:bg-chip-hover"
              : "bg-ink text-white hover:bg-brand"
          }`}
        >
          {subscribed && <BellRing className="size-4" />}
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <button
        type="button"
        onClick={share}
        className="ml-auto flex items-center gap-1.5 rounded-full bg-chip px-4 py-2 text-sm font-medium text-ink hover:bg-chip-hover"
      >
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      </button>
    </div>
  );
}
