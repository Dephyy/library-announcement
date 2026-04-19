import Link from "next/link";

import type { PostRecord } from "@/src/services/apiClient";
import { displayScore, inferTag } from "@/lib/forumDisplay";

import { IconChat } from "./icons";
import { PostVoteButtons } from "./PostVoteButtons";

type ForumFeedCardProps = {
  post: PostRecord;
};

const EXCERPT_MAX = 120;

export function ForumFeedCard({ post }: ForumFeedCardProps) {
  const excerpt =
    post.content.length > EXCERPT_MAX
      ? `${post.content.slice(0, EXCERPT_MAX).trim()}…`
      : post.content;
  const initialScore = displayScore(post);
  const tag = inferTag(post.title);
  const time = post.created_at
    ? new Date(post.created_at).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <article className="group rounded-[0.5rem] px-2 py-4 transition-colors first:pt-2 hover:bg-surface sm:px-3">
      <div className="flex gap-2 sm:gap-3">
        <PostVoteButtons postId={post.id} initialScore={initialScore} />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
            <span className="rounded-[0.25rem] bg-primary/10 px-1.5 py-0.5 text-primary">{tag}</span>
            <span>Library</span>
            <span aria-hidden>·</span>
            <time dateTime={post.created_at ?? undefined}>{time}</time>
          </div>
          <h3 className="mb-1 break-words font-display text-base font-semibold leading-snug text-on-surface sm:text-[1.125rem]">
            <Link href={`/announcements/${post.id}`} className="hover:text-primary hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="mb-2 line-clamp-2 break-words font-display text-sm leading-relaxed text-on-surface-variant">
            {excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3 font-sans text-xs text-on-surface-variant sm:text-sm">
            <span className="flex items-center gap-1">
              <IconChat className="h-3.5 w-3.5 shrink-0" />
              {post.comment_count ?? 0} comments
            </span>
            <Link
              href={`/announcements/${post.id}`}
              className="font-semibold text-primary hover:underline"
            >
              Open discussion
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
