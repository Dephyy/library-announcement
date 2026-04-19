import Link from "next/link";

import { IconLibrary, IconSparkles, IconTrendingUp } from "./icons";

/** Placeholder metrics and promo; comment totals can be wired later from an API. */
export function AtheneumRightRail() {
  return (
    <aside
      className="hidden w-full max-w-[16.5rem] shrink-0 flex-col gap-3 xl:sticky xl:top-[3.25rem] xl:max-h-[calc(100dvh-4rem)] xl:overflow-y-auto xl:overscroll-contain xl:flex xl:self-start 2xl:max-w-[17.5rem]"
      aria-label="Community highlights"
    >
      <section className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-primary">Library stats</h3>
          <IconSparkles className="h-4 w-4 text-secondary" />
        </div>
        <ul className="space-y-2 font-sans text-xs">
          <li className="flex justify-between gap-2 text-on-surface-variant">
            <span>Active scholars</span>
            <span className="font-bold text-on-surface">4,281</span>
          </li>
          <li className="flex justify-between gap-2 text-on-surface-variant">
            <span>Archived threads</span>
            <span className="font-bold text-on-surface">12.5k</span>
          </li>
          <li className="flex justify-between gap-2 text-on-surface-variant">
            <span>Open citations</span>
            <span className="font-bold text-on-surface">892</span>
          </li>
        </ul>
        <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-secondary">
          System status: optimal
        </p>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50">
        <h3 className="mb-2 font-display text-sm font-semibold text-primary">Featured</h3>
        <blockquote className="mb-2 border-l-[3px] border-secondary pl-3 font-display text-sm italic leading-snug text-on-surface">
          &ldquo;The only thing that you absolutely have to know is the location of the library.&rdquo;
        </blockquote>
        <p className="text-right font-sans text-xs font-semibold text-on-surface-variant">— Albert Einstein</p>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50">
        <h3 className="mb-2 font-display text-sm font-semibold text-primary">Trending topics</h3>
        <ul className="space-y-1.5">
          {["#FinalsWeek", "#RareBooks", "#CitationHelp", "#StudyRooms"].map((tag) => (
            <li key={tag}>
              <Link
                href={`/announcements?q=${encodeURIComponent(tag.replace("#", ""))}`}
                className="flex items-center justify-between font-sans text-xs text-on-surface transition hover:text-primary"
              >
                <span>{tag}</span>
                <IconTrendingUp className="h-3.5 w-3.5 shrink-0 text-on-surface-variant" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low p-3.5 ring-1 ring-inset ring-outline-variant/50">
        <h3 className="mb-2 font-display text-sm font-semibold text-primary">Top circles</h3>
        <ul className="space-y-2 font-sans text-xs">
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-[0.35rem] bg-primary/15" aria-hidden />
            <span className="text-on-surface">Philosophy Lab</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-[0.35rem] bg-primary-container/40" aria-hidden />
            <span className="text-on-surface">Archives Hub</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-[0.35rem] bg-tertiary/20" aria-hidden />
            <span className="text-on-surface">Data Ethics</span>
          </li>
        </ul>
      </section>

      <section className="rounded-[0.5rem] bg-gradient-to-br from-primary to-primary-container p-3.5 text-center text-white shadow-float">
        <IconLibrary className="mx-auto mb-1 h-7 w-7 text-secondary" />
        <h4 className="mb-1 font-display text-sm font-bold">Librarian office hours</h4>
        <p className="mb-2.5 font-sans text-xs text-white/85">Wednesdays · 2–4 PM · Main Campus</p>
        <Link
          href="/login"
          className="inline-block w-full rounded-[0.5rem] bg-white px-3 py-1.5 font-sans text-xs font-bold text-primary transition hover:bg-white/95"
        >
          Book a slot
        </Link>
      </section>
    </aside>
  );
}
