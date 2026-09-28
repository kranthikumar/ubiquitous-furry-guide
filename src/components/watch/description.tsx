"use client";

import { useState } from "react";

export function Description({ meta, text }: { meta: string; text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl bg-chip p-3 text-sm text-ink">
      <p className="font-semibold">{meta}</p>
      <p
        id="video-description"
        className={`mt-1 whitespace-pre-line ${expanded ? "" : "line-clamp-2"}`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls="video-description"
        className="mt-1 font-semibold hover:underline"
      >
        {expanded ? "Show less" : "...more"}
      </button>
    </div>
  );
}
