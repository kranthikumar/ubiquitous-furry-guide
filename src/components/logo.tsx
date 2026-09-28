import Link from "next/link";
import { PawIcon } from "./icons";

export function Logo({ className = "text-ink" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-1.5 rounded-lg px-1 py-1 ${className}`}
      aria-label="FurryTube home"
    >
      <PawIcon className="size-7" />
      <span className="text-xl font-bold tracking-tight">FurryTube</span>
    </Link>
  );
}
