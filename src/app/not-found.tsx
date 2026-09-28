import Link from "next/link";
import { PawIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-24 text-center">
      <PawIcon className="size-12 text-muted" />
      <h1 className="text-lg font-medium text-ink">
        This page hasn’t been built yet
      </h1>
      <p className="text-sm text-muted">
        FurryTube is a work in progress. Only the home page exists so far.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
