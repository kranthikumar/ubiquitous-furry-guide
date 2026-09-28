import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";
export { param, withParams } from "@/app/admin/_lib/url";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

/** Shared look for inputs and selects (without width). */
const fieldClass =
  "rounded-lg border border-line bg-white px-3 py-2 text-base text-ink placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none sm:text-sm aria-[invalid=true]:border-paw [&[readonly]]:bg-chip [&[readonly]]:text-muted";

export const inputClass = `w-full ${fieldClass}`;

/** Selects in a filter bar size to their content. */
export const filterSelectClass = `w-auto max-w-full sm:max-w-72 ${fieldClass}`;

export const buttonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-chip";

export function PageHeader({
  title,
  back,
  action,
}: {
  title: string;
  back?: { href: string; label: string };
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {back && (
          <Link
            href={back.href}
            className="mb-1 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ChevronLeft className="size-4" />
            {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
      </div>
      {action && (
        <Link href={action.href} className={buttonClass}>
          <Plus className="size-4" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

const notices: Record<string, string> = {
  created: "Created.",
  updated: "Saved.",
  deleted: "Deleted.",
};

/** Confirmation after a redirect, from ?notice=created|updated|deleted. */
export function Notice({ notice }: { notice?: string }) {
  const text = notice && notices[notice];
  if (!text) return null;
  return (
    <p
      role="status"
      className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
    >
      <CheckCircle2 className="size-4" />
      {text}
    </p>
  );
}

/**
 * GET filter bar: a search box plus optional extra controls (selects).
 * Submitting resets to page 1.
 */
export function FilterBar({
  action,
  query,
  placeholder,
  children,
}: {
  action: string;
  query?: string;
  placeholder: string;
  children?: ReactNode;
}) {
  return (
    <Form
      action={action}
      className="mb-4 flex flex-wrap items-center gap-2"
      role="search"
    >
      <label className="relative min-w-0 flex-1 basis-56">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className={`${inputClass} pl-9`}
        />
      </label>
      {children}
      <button type="submit" className={secondaryButtonClass}>
        Filter
      </button>
    </Form>
  );
}

export function Pagination({
  page,
  pages,
  total,
  href,
}: {
  page: number;
  pages: number;
  total: number;
  /** Builds the URL for a page number, keeping the current filters. */
  href: (page: number) => string;
}) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-between gap-3 text-sm text-muted"
    >
      <span>
        {total} {total === 1 ? "result" : "results"}
      </span>
      {pages > 1 && (
        <span className="flex items-center gap-2">
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              className={secondaryButtonClass}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Link>
          ) : null}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={href(page + 1)}
              className={secondaryButtonClass}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </span>
      )}
    </nav>
  );
}

/** Horizontally scrollable table wrapper, so wide tables work on phones. */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export const th =
  "px-3 py-2.5 text-xs font-semibold tracking-wide text-muted uppercase";
export const td = "px-3 py-2.5 align-middle";

export function EmptyRow({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-10 text-center text-muted">
        {children}
      </td>
    </tr>
  );
}
