import { cookies } from "next/headers";
import Link from "next/link";

import {
  fetchBackendHealth,
  fetchDocuments,
  fetchPosts,
  type DocumentRecord,
  type PostRecord,
} from "@/src/services/apiClient";
import { parseAuthCookie } from "@/src/lib/localAuth";

export default async function PortalPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("library_portal_auth")?.value;
  const auth = parseAuthCookie(authCookie);

  let backendStatus = "unreachable";
  let posts: PostRecord[] = [];
  let documents: DocumentRecord[] = [];

  try {
    const health = await fetchBackendHealth();
    backendStatus = health.status;
  } catch {
    backendStatus = "unreachable";
  }

  try {
    posts = await fetchPosts({ limit: 8, offset: 0 });
  } catch {
    posts = [];
  }

  try {
    documents = await fetchDocuments({ limit: 8, offset: 0 });
  } catch {
    documents = [];
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary">Management console</p>
        <h1 className="font-display text-[clamp(1.35rem,2vw+0.5rem,2rem)] font-semibold text-primary">
          Admin &amp; librarian workspace
        </h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Monitor the API and review content. Navigation matches the public Library Services shell.
        </p>
        {auth ? (
          <p className="font-sans text-xs text-on-surface">
            Signed in as <strong className="text-primary">{auth.username}</strong> ({auth.role})
          </p>
        ) : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="System status">
        <article className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">Portal</p>
          <p className="mt-1 font-display text-lg font-semibold text-emerald-700">Authenticated</p>
        </article>
        <article className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">Backend</p>
          <p
            className={`mt-1 font-display text-lg font-semibold ${backendStatus === "ok" ? "text-emerald-700" : "text-primary"}`}
          >
            {backendStatus}
          </p>
        </article>
        <article className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">Posts loaded</p>
          <p className="mt-1 font-display text-lg font-semibold text-on-surface">{posts.length}</p>
        </article>
        <article className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-on-surface-variant">Documents</p>
          <p className="mt-1 font-display text-lg font-semibold text-on-surface">{documents.length}</p>
        </article>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/portal/posts"
          className="rounded-[0.5rem] bg-primary px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Manage posts
        </Link>
        <Link
          href="/portal/documents"
          className="rounded-[0.5rem] bg-surface px-4 py-2 font-sans text-sm font-semibold text-primary ring-1 ring-outline-variant/60 hover:bg-surface-low"
        >
          Manage documents
        </Link>
        <Link
          href="/"
          className="rounded-[0.5rem] px-4 py-2 font-sans text-sm font-semibold text-primary hover:underline"
        >
          Public forum
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[0.5rem] bg-surface-low ring-1 ring-inset ring-outline-variant/50" aria-label="Posts preview">
          <div className="border-b border-outline-variant/40 px-4 py-3">
            <h2 className="font-display text-base font-semibold text-primary">Posts preview</h2>
          </div>
          {posts.length === 0 ? (
            <p className="px-4 py-8 text-center font-sans text-sm text-on-surface-variant">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/40">
              {posts.map((post) => (
                <li key={post.id} className="px-4 py-3 hover:bg-surface/50">
                  <h3 className="font-display text-sm font-semibold text-on-surface">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 font-sans text-xs text-on-surface-variant">{post.content}</p>
                  {post.created_at ? (
                    <p className="mt-1 font-sans text-[0.65rem] text-on-surface-variant">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[0.5rem] bg-surface-low ring-1 ring-inset ring-outline-variant/50" aria-label="Documents preview">
          <div className="border-b border-outline-variant/40 px-4 py-3">
            <h2 className="font-display text-base font-semibold text-primary">Documents preview</h2>
          </div>
          {documents.length === 0 ? (
            <p className="px-4 py-8 text-center font-sans text-sm text-on-surface-variant">No documents yet.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/40">
              {documents.map((document) => (
                <li key={document.id} className="px-4 py-3 hover:bg-surface/50">
                  <h3 className="font-display text-sm font-semibold text-on-surface">{document.title}</h3>
                  <p className="mt-1 font-sans text-xs text-on-surface-variant">
                    {document.category} · {document.mime_type}
                  </p>
                  <a href={document.file_url} className="mt-1 inline-block text-xs font-semibold text-primary hover:underline">
                    Open file
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50" aria-label="Session">
        <h2 className="mb-3 font-display text-base font-semibold text-primary">Session</h2>
        <form action="/api/local-auth/logout" method="post">
          <button
            type="submit"
            className="rounded-[0.5rem] border border-outline-variant bg-surface px-4 py-2 font-sans text-sm font-semibold text-primary hover:bg-surface-low"
          >
            Log out
          </button>
        </form>
      </section>
    </div>
  );
}
