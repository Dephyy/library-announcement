import { cookies } from "next/headers";
import Link from "next/link";

import { fetchPosts, type PostRecord } from "@/src/services/apiClient";
import { parseAuthCookie } from "@/src/lib/localAuth";

type PortalPostsProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalPostsPage({ searchParams }: PortalPostsProps) {
  const params = searchParams ? await searchParams : {};
  const created = typeof params.created === "string" ? params.created : "";
  const error = typeof params.error === "string" ? params.error : "";
  const cookieStore = await cookies();
  const auth = parseAuthCookie(cookieStore.get("library_portal_auth")?.value);

  let posts: PostRecord[] = [];
  try {
    posts = await fetchPosts({ limit: 15, offset: 0 });
  } catch {
    posts = [];
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary">Portal · Posts</p>
        <h1 className="font-display text-[clamp(1.35rem,2vw+0.5rem,2rem)] font-semibold text-primary">Announcements</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Create forum posts and open threads. {auth ? `Session: ${auth.username} (${auth.role}).` : null}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/portal" className="font-semibold text-primary hover:underline">
          ← Console home
        </Link>
        <span className="text-on-surface-variant" aria-hidden>
          ·
        </span>
        <Link href="/portal/documents" className="font-semibold text-primary hover:underline">
          Documents
        </Link>
        <span className="text-on-surface-variant" aria-hidden>
          ·
        </span>
        <Link href="/" className="font-semibold text-primary hover:underline">
          Public forum
        </Link>
      </div>

      <section className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-5" aria-label="Create post">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary">Create announcement</h2>
        {created === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-emerald-700">Post created successfully.</p>
        ) : null}
        {error === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-primary" role="alert">
            Failed to create post. Check your input and retry.
          </p>
        ) : null}
        <form action="/api/portal/posts/create" method="post" className="space-y-4">
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
            <label htmlFor="content" className="font-sans text-sm font-semibold text-on-surface">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={5}
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="rounded-[0.5rem] bg-primary px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Publish post
          </button>
        </form>
      </section>

      <section className="rounded-[0.5rem] bg-surface-low ring-1 ring-inset ring-outline-variant/50" aria-label="Recent posts">
        <div className="border-b border-outline-variant/40 px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-primary">Recent posts</h2>
        </div>
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center font-sans text-sm text-on-surface-variant">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {posts.map((post) => (
              <li key={post.id} className="px-4 py-4 hover:bg-surface/50">
                <h3 className="font-display text-base font-semibold text-on-surface">{post.title}</h3>
                <p className="mt-1 line-clamp-3 font-sans text-sm text-on-surface-variant">{post.content}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 font-sans text-xs">
                  <Link href={`/announcements/${post.id}`} className="font-semibold text-primary hover:underline">
                    View thread
                  </Link>
                  <span className="rounded-[0.25rem] bg-surface px-2 py-0.5 text-on-surface-variant ring-1 ring-outline-variant/50">
                    {post.comment_count ?? 0} comments
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
