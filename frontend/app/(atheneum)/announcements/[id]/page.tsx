import Link from "next/link";

import { IconChat } from "@/components/atheneum/icons";
import { PostVoteButtons } from "@/components/atheneum/PostVoteButtons";
import { displayScore, inferTag } from "@/lib/forumDisplay";
import {
  fetchComments,
  fetchPostById,
  type CommentRecord,
} from "@/src/services/apiClient";

type AnnouncementDetailProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnnouncementDetailPage({ params, searchParams }: AnnouncementDetailProps) {
  const route = await params;
  const postId = Number(route.id);
  const search = searchParams ? await searchParams : {};
  const created = typeof search.created === "string" ? search.created : "";
  const error = typeof search.error === "string" ? search.error : "";

  const post = Number.isFinite(postId) ? await fetchPostById(postId) : null;
  let comments: CommentRecord[] = [];
  if (post) {
    try {
      comments = await fetchComments(post.id);
    } catch {
      comments = [];
    }
  }

  if (!post) {
    return (
      <div className="rounded-[0.5rem] bg-surface-low p-6 ring-1 ring-inset ring-outline-variant/50 sm:p-8">
        <h2 className="mb-2 font-display text-xl font-semibold text-primary sm:text-2xl">Announcement not found</h2>
        <p className="mb-6 font-sans text-on-surface-variant">The requested thread does not exist.</p>
        <Link href="/announcements" className="font-semibold text-primary hover:underline">
          Back to announcements
        </Link>
      </div>
    );
  }

  const tag = inferTag(post.title);
  const initialScore = displayScore(post);

  return (
    <div className="space-y-6 sm:space-y-8">
      <nav className="font-sans text-xs text-on-surface-variant sm:text-sm" aria-label="Breadcrumb">
        <Link href="/announcements" className="hover:text-primary hover:underline">
          Announcements
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-on-surface">Thread</span>
      </nav>

      <article className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          <span className="rounded-[0.25rem] bg-primary/10 px-2 py-0.5 text-primary">{tag}</span>
          <span>Library</span>
          {post.created_at ? (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
            </>
          ) : null}
        </div>
        <div className="flex gap-4 sm:gap-6">
          <PostVoteButtons postId={post.id} initialScore={initialScore} />
          <div className="min-w-0 flex-1">
            <h1 className="mb-4 break-words font-display text-2xl font-semibold leading-tight text-on-surface sm:text-3xl">
              {post.title}
            </h1>
            <p className="whitespace-pre-wrap break-words font-display text-base leading-relaxed text-on-surface">
              {post.content}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 font-sans text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <IconChat className="h-[1.125rem] w-[1.125rem] shrink-0" />
                {post.comment_count ?? 0} comments
              </span>
            </div>
          </div>
        </div>
      </article>

      <section
        className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-6"
        aria-labelledby="reply-heading"
      >
        <h2 id="reply-heading" className="mb-4 font-display text-xl font-semibold text-primary">
          Join discussion
        </h2>
        {created === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-emerald-700">Comment posted successfully.</p>
        ) : null}
        {error === "1" ? (
          <p className="mb-4 font-sans text-sm font-medium text-primary" role="alert">
            Could not post comment. Please try again.
          </p>
        ) : null}
        <form action="/api/forum/comments/create" method="post" className="space-y-4">
          <input type="hidden" name="post_id" value={String(post.id)} />
          <div className="flex flex-col gap-1">
            <label htmlFor="author_name" className="font-sans text-sm font-semibold text-on-surface">
              Name
            </label>
            <input
              id="author_name"
              name="author_name"
              required
              placeholder="Your name"
              autoComplete="name"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="font-sans text-sm font-semibold text-on-surface">
              Comment
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={4}
              placeholder="Share your thoughts…"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="rounded-[0.5rem] bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Post comment
          </button>
        </form>
      </section>

      <section
        className="rounded-[0.5rem] bg-surface-low p-4 ring-1 ring-inset ring-outline-variant/50 sm:p-6"
        aria-labelledby="comments-heading"
      >
        <h2 id="comments-heading" className="mb-4 font-display text-xl font-semibold text-primary">
          Comments
        </h2>
        {comments.length === 0 ? (
          <p className="font-sans text-on-surface-variant">No comments yet. Be the first to reply.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {comments.map((comment) => (
              <li key={comment.id} className="py-4 first:pt-0">
                <p className="font-semibold text-on-surface">{comment.author_name}</p>
                <p className="mt-1 font-display text-on-surface">{comment.content}</p>
                <p className="mt-2 font-sans text-xs text-on-surface-variant">
                  <time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleString()}</time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
