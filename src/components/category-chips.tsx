import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  active,
  query,
}: {
  categories: Category[];
  active?: string;
  query?: string;
}) {
  const chips = [{ slug: undefined, label: "All" }, ...categories];
  return (
    <nav
      aria-label="Categories"
      className="sticky top-14 z-30 bg-surface/95 backdrop-blur"
    >
      <ul className="flex gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
        {chips.map(({ slug, label }) => {
          const selected = slug === active;
          return (
            <li key={label} className="shrink-0">
              <Link
                href={{
                  pathname: "/",
                  query: {
                    ...(query && { q: query }),
                    ...(slug && { category: slug }),
                  },
                }}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={`block rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                  selected
                    ? "bg-brand text-white"
                    : "bg-chip text-ink hover:bg-chip-hover"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
