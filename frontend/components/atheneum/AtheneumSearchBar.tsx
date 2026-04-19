"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { IconSearch } from "./icons";

/** Search bar: targets `/` or `/announcements` based on route; on thread pages, searches `/announcements`. */
export function AtheneumSearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const action =
    pathname === "/" ? "/" : pathname?.startsWith("/announcements") ? "/announcements" : "/announcements";

  return (
    <form
      method="GET"
      action={action}
      className="relative min-w-0 flex-1 max-w-2xl lg:max-w-none"
      role="search"
    >
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant sm:left-3.5" />
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search the archives, threads, and scholarly works…"
        aria-label="Search threads and announcements"
        autoComplete="off"
        className="h-9 w-full min-w-0 rounded-[0.5rem] border-0 bg-surface-low py-2 pl-11 pr-3 text-sm text-on-surface shadow-none ring-1 ring-inset ring-outline-variant transition placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary sm:h-10 sm:pl-12 sm:text-sm"
      />
      <input type="hidden" name="offset" value="0" />
    </form>
  );
}
