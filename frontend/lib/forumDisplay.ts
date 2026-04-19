/** Deterministic placeholder scores when backend has no score (fallback only). */
export function placeholderVoteScore(id: number): number {
  return ((Math.abs(id) * 7919) % 97) + 3;
}

export function inferTag(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("hour")) return "HOURS";
  if (t.includes("closed") || t.includes("holiday")) return "ALERT";
  return "ANNOUNCEMENT";
}

/** Prefer persisted `score` from API; placeholder only for legacy rows. */
export function displayScore(post: { id: number; score?: number }): number {
  if (post.id === 0) return 0;
  if (typeof post.score === "number") return post.score;
  return placeholderVoteScore(post.id);
}
