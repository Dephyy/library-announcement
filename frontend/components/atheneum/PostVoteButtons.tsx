"use client";

import { useState } from "react";

import { castVote } from "@/src/services/apiClient";

import { IconChevronDown, IconChevronUp } from "./icons";

type PostVoteButtonsProps = {
  postId: number;
  initialScore: number;
};

export function PostVoteButtons({ postId, initialScore }: PostVoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  if (postId <= 0) {
    return (
      <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 pt-0.5" aria-hidden>
        <span className="text-xs font-bold text-on-surface-variant">—</span>
      </div>
    );
  }

  async function vote(direction: "up" | "down") {
    setError(false);
    setPending(true);
    try {
      const result = await castVote(postId, direction);
      if (result) {
        setScore(result.score);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 pt-0.5 sm:w-9">
      <button
        type="button"
        disabled={pending}
        onClick={() => vote("up")}
        className="rounded-[0.25rem] p-0.5 text-on-surface-variant transition hover:bg-surface-low hover:text-primary disabled:opacity-50"
        aria-label="Upvote"
      >
        <IconChevronUp className="h-4 w-4" />
      </button>
      <span
        className={`text-xs font-bold leading-none tabular-nums ${error ? "text-red-600" : "text-primary"}`}
        aria-live="polite"
        title={error ? "Vote request failed (is the backend running?)" : undefined}
      >
        {score}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => vote("down")}
        className="rounded-[0.25rem] p-0.5 text-on-surface-variant transition hover:bg-surface-low hover:text-primary disabled:opacity-50"
        aria-label="Downvote"
      >
        <IconChevronDown className="h-4 w-4" />
      </button>
      {error ? (
        <span className="sr-only" role="status">
          Vote failed; check that the API is running.
        </span>
      ) : null}
    </div>
  );
}
