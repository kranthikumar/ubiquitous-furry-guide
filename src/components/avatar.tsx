import type { Channel } from "@/lib/data";
import { CritterFigure } from "./critter";

export function Avatar({
  channel,
  className = "size-9",
}: {
  channel: Channel;
  className?: string;
}) {
  const { bg, ...critter } = channel.avatar;
  return (
    <svg
      viewBox="-50 -58 100 100"
      className={`shrink-0 rounded-full ${className}`}
      style={{ background: bg }}
      aria-hidden="true"
    >
      <CritterFigure critter={{ ...critter, x: 0, y: 4, scale: 0.72 }} />
    </svg>
  );
}
