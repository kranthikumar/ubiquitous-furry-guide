"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";

type Props = { id: string; autoFocus?: boolean };

function SearchFields({
  id,
  defaultValue,
  autoFocus,
}: Props & { defaultValue: string }) {
  return (
    <Form action="/" role="search" className="flex min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <input
        // Remount when the URL's query changes so the field shows it.
        key={defaultValue}
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="Search Furry Videos, Channels, Creations..."
        className="h-10 min-w-0 flex-1 rounded-l-full border border-line bg-white px-4 text-base text-ink shadow-inner placeholder:text-muted focus:border-brand focus:outline-none sm:text-sm"
      />
      <button
        type="submit"
        className="grid h-10 w-16 shrink-0 place-items-center rounded-r-full border border-l-0 border-line bg-chip text-ink hover:bg-chip-hover"
        aria-label="Search"
      >
        <Search className="size-5" strokeWidth={1.75} />
      </button>
    </Form>
  );
}

function SearchFromUrl(props: Props) {
  const q = useSearchParams().get("q") ?? "";
  return <SearchFields {...props} defaultValue={q} />;
}

export function SearchForm(props: Props) {
  return (
    <Suspense fallback={<SearchFields {...props} defaultValue="" />}>
      <SearchFromUrl {...props} />
    </Suspense>
  );
}
