import Link from "next/link";
import { SearchX } from "lucide-react";
import { CategoryChips } from "@/components/category-chips";
import { VideoCard } from "@/components/video-card";
import { listCategories, listVideos } from "@/db/queries";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const query = first(params.q)?.trim() || undefined;
  const requested = first(params.category);
  const categories = await listCategories();
  const category = categories.some((c) => c.slug === requested)
    ? requested
    : undefined;
  const results = await listVideos({ query, category });

  return (
    <>
      <CategoryChips categories={categories} active={category} query={query} />
      <section aria-labelledby="videos-heading" className="px-4 pt-2 sm:px-6">
        <h1 id="videos-heading" className="sr-only">
          {query ? `Search results for “${query}”` : "Recommended videos"}
        </h1>
        {results.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-x-4 gap-y-8">
            {results.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <SearchX className="size-12 text-muted" strokeWidth={1.5} />
            <p className="text-lg font-medium text-ink">No videos found</p>
            <p className="text-sm text-muted">
              Try a different search or category.
            </p>
            <Link
              href="/"
              className="mt-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Back to all videos
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
