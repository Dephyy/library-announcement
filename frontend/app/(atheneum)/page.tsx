import type { ComponentType } from "react";
import Link from "next/link";

import { ForumFeedCard } from "@/components/atheneum/ForumFeedCard";
import {
  IconBook,
  IconGroups,
  IconHeartHandshake,
  IconMegaphone,
} from "@/components/atheneum/icons";
import { fetchPosts, type PostRecord } from "@/src/services/apiClient";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const queryValue = typeof params.q === "string" ? params.q : "";
  const limitValueRaw = typeof params.limit === "string" ? Number(params.limit) : 5;
  const offsetValueRaw = typeof params.offset === "string" ? Number(params.offset) : 0;
  const limitValue = Number.isFinite(limitValueRaw) ? Math.min(Math.max(limitValueRaw, 1), 20) : 5;
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

  const feedSortHref = (nextSort: "new" | "top" | "hot") => {
    const sp = new URLSearchParams();
    if (queryValue) sp.set("q", queryValue);
    sp.set("limit", String(limitValue));
    sp.set("offset", "0");
    sp.set("sort", nextSort);
    return `/?${sp.toString()}`;
  };

  const prevOffset = Math.max(offsetValue - limitValue, 0);
  const nextOffset = offsetValue + limitValue;
  const hasPrev = offsetValue > 0;
  const hasNext = posts.length === limitValue;
  const qPart = queryValue ? `q=${encodeURIComponent(queryValue)}&` : "";
  const prevHref = `/?${qPart}limit=${limitValue}&offset=${prevOffset}&sort=${sort}`;
  const nextHref = `/?${qPart}limit=${limitValue}&offset=${nextOffset}&sort=${sort}`;

  const bento: {
    href: string;
    title: string;
    desc: string;
    className: string;
    Icon: ComponentType<{ className?: string }>;
    iconClass: string;
  }[] = [
    {
      href: "/announcements",
      title: "Announcements",
      desc: "Official notices and hours.",
      className:
        "bg-gradient-to-br from-primary to-primary-container text-white ring-0 shadow-sm",
      Icon: IconMegaphone,
      iconClass: "text-white",
    },
    {
      href: "/announcements?q=study",
      title: "Study Groups",
      desc: "Find partners for your courses.",
      className: "bg-[#f5f0e8] text-on-surface ring-1 ring-outline-variant/40",
      Icon: IconGroups,
      iconClass: "text-secondary",
    },
    {
      href: "/documents",
      title: "Catalog",
      desc: "E-books, databases, and finding aids.",
      className: "bg-[#e8edf5] text-on-surface ring-1 ring-outline-variant/40",
      Icon: IconBook,
      iconClass: "text-tertiary",
    },
    {
      href: "/login",
      title: "Contribute",
      desc: "Share resources with peers.",
      className:
        "border border-dashed border-outline-variant bg-surface text-on-surface ring-0 ring-inset",
      Icon: IconHeartHandshake,
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <header className="space-y-2">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-secondary">
          Library Services
        </p>
        <h1 className="font-display text-[clamp(1.5rem,2.5vw+0.5rem,2.35rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-primary">
          Greetings, Student.
        </h1>
        <p className="max-w-2xl font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-on-surface-variant sm:text-xs">
          Exploring the intersection of data and tradition.
        </p>
        <p className="max-w-2xl font-display text-sm leading-relaxed text-on-surface-variant sm:text-[0.9375rem]">
          Official library notices, schedules, and service advisories from Batangas State University.
        </p>
      </header>

      <section aria-label="Quick access">
        <h2 className="sr-only">Quick access</h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4 xl:gap-3">
          {bento.map((card) => {
            const Icon = card.Icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative flex min-h-[5.5rem] flex-col justify-between overflow-hidden rounded-[0.5rem] p-3.5 transition hover:-translate-y-px hover:shadow-card sm:min-h-[5.75rem] sm:p-4 ${card.className}`}
              >
                <Icon className={`mb-2 h-7 w-7 sm:h-8 sm:w-8 ${card.iconClass}`} />
                <div>
                  <h3
                    className={`mb-0.5 font-display text-sm font-semibold leading-snug sm:text-base ${
                      card.className.includes("from-primary") ? "text-white" : "text-on-surface"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`font-display text-xs leading-snug sm:text-[0.8125rem] ${
                      card.className.includes("from-primary") ? "text-white/85" : "text-on-surface-variant"
                    }`}
                  >
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50 sm:p-4"
        aria-label="Filters"
      >
        <h2 className="mb-1 font-display text-sm font-semibold text-primary sm:text-base">
          Search &amp; pagination
        </h2>
        <p className="mb-3 font-sans text-xs text-on-surface-variant sm:text-sm">
          Use the search bar for keywords; adjust page size here.
        </p>
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
              max={20}
              defaultValue={String(limitValue)}
              className="h-9 rounded-[0.5rem] border-0 bg-surface px-2.5 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <input type="hidden" name="offset" value="0" />
          <button
            type="submit"
            className="h-9 rounded-[0.5rem] bg-primary px-3 font-sans text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Apply
          </button>
        </form>
      </section>

      <section aria-labelledby="feed-heading">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 id="feed-heading" className="font-display text-lg font-semibold text-on-surface sm:text-xl">
            Trending discussions
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
            <p className="py-8 text-center font-sans text-sm text-on-surface-variant">
              No announcements available yet.
            </p>
          ) : (
            <div className="divide-y divide-outline-variant/40">
              {posts.map((post) => (
                <ForumFeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
        <nav className="mt-4 flex gap-3" aria-label="Pagination">
          {hasPrev ? (
            <a
              href={prevHref}
              className="rounded-[0.5rem] bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-primary ring-1 ring-outline-variant/60 hover:bg-surface-low sm:px-4 sm:text-sm"
            >
              Previous
            </a>
          ) : (
            <span className="rounded-[0.5rem] px-3 py-1.5 font-sans text-xs text-on-surface-variant sm:px-4 sm:text-sm">
              Previous
            </span>
          )}
          {hasNext ? (
            <a
              href={nextHref}
              className="rounded-[0.5rem] bg-surface px-3 py-1.5 font-sans text-xs font-semibold text-primary ring-1 ring-outline-variant/60 hover:bg-surface-low sm:px-4 sm:text-sm"
            >
              Next
            </a>
          ) : (
            <span className="rounded-[0.5rem] px-3 py-1.5 font-sans text-xs text-on-surface-variant sm:px-4 sm:text-sm">
              Next
            </span>
          )}
        </nav>
      </section>

      <section
        className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50 sm:p-4"
        aria-label="Route map"
      >
        <h2 className="mb-1 font-display text-sm font-semibold text-primary sm:text-base">Route map</h2>
        <p className="mb-2.5 font-sans text-xs text-on-surface-variant sm:text-sm">
          Smoke-test links for local development.
        </p>
        <div className="flex flex-wrap gap-2 font-sans text-sm">
          <Link href="/announcements" className="font-semibold text-primary hover:underline">
            /announcements
          </Link>
          <Link href="/documents" className="font-semibold text-primary hover:underline">
            /documents
          </Link>
          <Link href="/login" className="font-semibold text-primary hover:underline">
            /login
          </Link>
          <Link href="/portal" className="font-semibold text-primary hover:underline">
            /portal (protected)
          </Link>
          <Link href="/health" className="font-semibold text-primary hover:underline">
            /health
          </Link>
        </div>
      </section>
    </div>
  );
}
