import Link from "next/link";

import { ForumFeedCard } from "@/components/atheneum/ForumFeedCard";
import { fetchPosts, type PostRecord } from "@/src/services/apiClient";

type AnnouncementsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryValue = typeof params.q === "string" ? params.q : "";
  const limitValueRaw = typeof params.limit === "string" ? Number(params.limit) : 10;
  const offsetValueRaw = typeof params.offset === "string" ? Number(params.offset) : 0;
  const limitValue = Number.isFinite(limitValueRaw) ? Math.min(Math.max(limitValueRaw, 1), 30) : 10;
  const offsetValue = Number.isFinite(offsetValueRaw) ? Math.max(offsetValueRaw, 0) : 0;
  const sortRaw = typeof params.sort === "string" ? params.sort : "new";
  const sort: "new" | "top" | "hot" =
    sortRaw === "top" || sortRaw === "hot" || sortRaw === "new" ? sortRaw : "new";

  let posts: PostRecord[] = [];
  try {
    posts = await fetchPosts({ q: queryValue, limit: limitValue, offset: offsetValue, sort });
  } catch {
    posts = [];
  }

  const prevOffset = Math.max(offsetValue - limitValue, 0);
  const nextOffset = offsetValue + limitValue;
  const hasPrev = offsetValue > 0;
  const hasNext = posts.length === limitValue;
  const qPart = queryValue ? `q=${encodeURIComponent(queryValue)}&` : "";
  const prevHref = `/announcements?${qPart}limit=${limitValue}&offset=${prevOffset}&sort=${sort}`;
  const nextHref = `/announcements?${qPart}limit=${limitValue}&offset=${nextOffset}&sort=${sort}`;

  const feedSortHref = (nextSort: "new" | "top" | "hot") => {
    const sp = new URLSearchParams();
    if (queryValue) sp.set("q", queryValue);
    sp.set("limit", String(limitValue));
    sp.set("offset", "0");
    sp.set("sort", nextSort);
    return `/announcements?${sp.toString()}`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mb-2 font-display text-[clamp(1.35rem,2vw+0.5rem,2rem)] font-semibold leading-tight text-primary">
          All announcements
        </h1>
        <p className="font-sans text-sm leading-relaxed text-on-surface-variant sm:text-[0.9375rem]">
          Browse the full forum feed. Use the search bar and filters below.
        </p>
      </header>

      <section
        className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-5"
        aria-label="Filters"
      >
        <h2 className="mb-3 font-display text-base font-semibold text-primary">Page size</h2>
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="q" value={queryValue} />
          <input type="hidden" name="sort" value={sort} />
          <div className="flex min-w-[7rem] flex-col gap-0.5">
            <label htmlFor="limit" className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">
              Items per page
            </label>
            <input
              id="limit"
              name="limit"
              type="number"
              min={1}
              max={30}
              defaultValue={String(limitValue)}
              className="h-9 rounded-[0.5rem] border-0 bg-surface px-2.5 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <input type="hidden" name="offset" value="0" />
          <button
            type="submit"
            className="h-9 rounded-[0.5rem] bg-primary px-4 font-sans text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Apply
          </button>
        </form>
      </section>

      <section aria-labelledby="announcements-feed">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 id="announcements-feed" className="font-display text-xl font-semibold text-on-surface sm:text-2xl">
            Forum feed
          </h2>
          <div
            className="flex w-full max-w-full gap-0.5 overflow-x-auto rounded-[0.5rem] bg-surface-low p-0.5 font-sans text-[0.65rem] font-medium text-on-surface-variant sm:w-auto sm:gap-1 sm:p-1 sm:text-xs"
            role="group"
            aria-label="Sort discussions"
          >
            {(
              [
                ["hot", "Hot"],
                ["new", "New"],
                ["top", "Top"],
              ] as const
            ).map(([key, label]) => (
              <Link
                key={key}
                href={feedSortHref(key)}
                className={`shrink-0 rounded-[0.35rem] px-2.5 py-1 sm:px-3 ${
                  sort === key
                    ? "bg-surface text-primary shadow-sm ring-1 ring-outline-variant/50"
                    : "hover:bg-surface/80"
                }`}
                aria-current={sort === key ? "true" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[0.5rem] bg-surface-low px-2 ring-1 ring-inset ring-outline-variant/50 sm:px-3 md:px-4">
          {posts.length === 0 ? (
            <p className="py-10 text-center font-sans text-sm text-on-surface-variant">No announcements found.</p>
          ) : (
            <div className="divide-y divide-outline-variant/40">
              {posts.map((post) => (
                <ForumFeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
        <nav className="mt-5 flex gap-3" aria-label="Pagination">
          {hasPrev ? (
            <Link
              href={prevHref}
              className="rounded-[0.5rem] bg-surface px-4 py-2 font-sans text-sm font-semibold text-primary ring-1 ring-outline-variant/60 hover:bg-surface-low"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-[0.5rem] px-4 py-2 font-sans text-sm text-on-surface-variant">Previous</span>
          )}
          {hasNext ? (
            <Link
              href={nextHref}
              className="rounded-[0.5rem] bg-surface px-4 py-2 font-sans text-sm font-semibold text-primary ring-1 ring-outline-variant/60 hover:bg-surface-low"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-[0.5rem] px-4 py-2 font-sans text-sm text-on-surface-variant">Next</span>
          )}
        </nav>
      </section>
    </div>
  );
}
