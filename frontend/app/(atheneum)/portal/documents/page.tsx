import { cookies } from "next/headers";
import Link from "next/link";

import { fetchDocuments, type DocumentRecord } from "@/src/services/apiClient";
import { parseAuthCookie } from "@/src/lib/localAuth";

type PortalDocumentsProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalDocumentsPage({ searchParams }: PortalDocumentsProps) {
  const params = searchParams ? await searchParams : {};
  const created = typeof params.created === "string" ? params.created : "";
  const error = typeof params.error === "string" ? params.error : "";
  const cookieStore = await cookies();
  const auth = parseAuthCookie(cookieStore.get("library_portal_auth")?.value);

  let documents: DocumentRecord[] = [];
  try {
    documents = await fetchDocuments({ limit: 15, offset: 0 });
  } catch {
    documents = [];
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary">Portal · Documents</p>
        <h1 className="font-display text-[clamp(1.35rem,2vw+0.5rem,2rem)] font-semibold text-primary">Repository entries</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Register metadata and upload content for the public catalog.{" "}
          {auth ? `Session: ${auth.username} (${auth.role}).` : null}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/portal" className="font-semibold text-primary hover:underline">
          ← Console home
        </Link>
        <span className="text-on-surface-variant" aria-hidden>
          ·
        </span>
        <Link href="/portal/posts" className="font-semibold text-primary hover:underline">
          Posts
        </Link>
        <span className="text-on-surface-variant" aria-hidden>
          ·
        </span>
        <Link href="/documents" className="font-semibold text-primary hover:underline">
          Public documents
        </Link>
      </div>

      <section className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-5" aria-label="Create document">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">New document entry</h2>
        {created === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-emerald-700">Document created successfully.</p>
        ) : null}
        {error === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-primary" role="alert">
            Failed to create document. Check your input and retry.
          </p>
        ) : null}
        <form action="/api/portal/documents/create" method="post" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="font-sans text-sm font-semibold text-on-surface">
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="category" className="font-sans text-sm font-semibold text-on-surface">
                Category
              </label>
              <input
                id="category"
                name="category"
                required
                className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="keywords" className="font-sans text-sm font-semibold text-on-surface">
              Keywords (comma separated)
            </label>
            <input
              id="keywords"
              name="keywords"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="file_name" className="font-sans text-sm font-semibold text-on-surface">
                File name
              </label>
              <input
                id="file_name"
                name="file_name"
                required
                placeholder="handbook.pdf"
                className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="mime_type" className="font-sans text-sm font-semibold text-on-surface">
                MIME type
              </label>
              <input
                id="mime_type"
                name="mime_type"
                defaultValue="application/pdf"
                required
                className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="file_size" className="font-sans text-sm font-semibold text-on-surface">
              File size (bytes)
            </label>
            <input
              id="file_size"
              name="file_size"
              inputMode="numeric"
              defaultValue="1024"
              required
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="file_content" className="font-sans text-sm font-semibold text-on-surface">
              File content (local test)
            </label>
            <textarea
              id="file_content"
              name="file_content"
              rows={5}
              defaultValue="Sample library document content"
              required
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="rounded-[0.5rem] bg-primary px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Upload document
          </button>
        </form>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low ring-1 ring-inset ring-outline-variant/50" aria-label="Recent documents">
        <div className="border-b border-outline-variant/40 px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-primary">Recent documents</h2>
        </div>
        {documents.length === 0 ? (
          <p className="px-4 py-10 text-center font-sans text-sm text-on-surface-variant">No documents yet.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {documents.map((document) => (
              <li key={document.id} className="px-4 py-4 hover:bg-surface/50">
                <h3 className="font-display text-base font-semibold text-on-surface">{document.title}</h3>
                <p className="mt-1 font-sans text-sm text-on-surface-variant">
                  {document.category} · {document.mime_type}
                </p>
                <a href={document.file_url} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
                  Open file
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
