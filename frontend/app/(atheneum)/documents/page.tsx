import Link from "next/link";

import { fetchDocuments, type DocumentRecord } from "@/src/services/apiClient";

type DocumentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryValue = typeof params.q === "string" ? params.q : "";
  const limitValueRaw = typeof params.limit === "string" ? Number(params.limit) : 10;
  const offsetValueRaw = typeof params.offset === "string" ? Number(params.offset) : 0;
  const limitValue = Number.isFinite(limitValueRaw) ? Math.min(Math.max(limitValueRaw, 1), 30) : 10;
  const offsetValue = Number.isFinite(offsetValueRaw) ? Math.max(offsetValueRaw, 0) : 0;

  let documents: DocumentRecord[] = [];
  try {
    documents = await fetchDocuments({ q: queryValue, limit: limitValue, offset: offsetValue });
  } catch {
    documents = [];
  }

  const prevOffset = Math.max(offsetValue - limitValue, 0);
  const nextOffset = offsetValue + limitValue;
  const hasPrev = offsetValue > 0;
  const hasNext = documents.length === limitValue;
  const qPart = queryValue ? `q=${encodeURIComponent(queryValue)}&` : "";
  const prevHref = `/documents?${qPart}limit=${limitValue}&offset=${prevOffset}`;
  const nextHref = `/documents?${qPart}limit=${limitValue}&offset=${nextOffset}`;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary">Repository</p>
        <h1 className="font-display text-[clamp(1.35rem,2vw+0.5rem,2rem)] font-semibold text-primary">
          Digital catalog
        </h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Search titles, categories, and keywords. Same experience as the forum home.
        </p>
      </header>

      <section
        className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-5"
        aria-label="Search documents"
      >
        <h2 className="mb-3 font-display text-base font-semibold text-primary">Search &amp; filters</h2>
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-[12rem] flex-1 flex-col gap-1">
            <label htmlFor="q" className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">
              Keyword
            </label>
            <input
              id="q"
              name="q"
              defaultValue={queryValue}
              placeholder="Title, category, keywords…"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex w-28 flex-col gap-1">
            <label htmlFor="limit" className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">
              Per page
            </label>
            <input
              id="limit"
              name="limit"
              defaultValue={String(limitValue)}
              inputMode="numeric"
              className="rounded-[0.5rem] border-0 bg-surface px-2 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <input type="hidden" name="offset" value="0" />
          <button
            type="submit"
            className="h-10 rounded-[0.5rem] bg-primary px-4 font-sans text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low ring-1 ring-inset ring-outline-variant/50" aria-label="Documents list">
        <div className="border-b border-outline-variant/40 px-4 py-3 sm:px-5">
          <h2 className="font-display text-lg font-semibold text-on-surface">Documents</h2>
        </div>
        {documents.length === 0 ? (
          <p className="px-4 py-10 text-center font-sans text-sm text-on-surface-variant sm:px-5">No documents found.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {documents.map((document) => (
              <li key={document.id} className="px-4 py-4 transition-colors hover:bg-surface/60 sm:px-5">
                <h3 className="font-display text-base font-semibold text-on-surface">{document.title}</h3>
                <p className="mt-1 font-sans text-sm text-on-surface-variant">
                  {document.category} · {document.mime_type}
                </p>
                <a
                  href={document.file_url}
                  className="mt-2 inline-block font-sans text-sm font-semibold text-primary hover:underline"
                >
                  Open file
                </a>
                <div className="mt-2 flex flex-wrap gap-2 font-sans text-xs text-on-surface-variant">
                  <span className="rounded-[0.25rem] bg-surface px-2 py-0.5 ring-1 ring-outline-variant/50">
                    Keywords: {document.keywords || "—"}
                  </span>
                  <span className="rounded-[0.25rem] bg-surface px-2 py-0.5 ring-1 ring-outline-variant/50">
                    {document.file_size} bytes
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav className="flex gap-3" aria-label="Pagination">
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
    </div>
  );
}
