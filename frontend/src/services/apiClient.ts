const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function fetchBackendHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export type PostRecord = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  comment_count?: number;
  /** Net votes from backend (defaults to 0). */
  score?: number;
};

type PostListResponse = {
  results: PostRecord[];
};

export type SessionContext = {
  is_authenticated: boolean;
  username: string | null;
  role: string | null;
};

export type DocumentRecord = {
  id: number;
  title: string;
  category: string;
  keywords: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

export type CommentRecord = {
  id: number;
  post_id: number;
  author_name: string;
  content: string;
  created_at: string;
};

export type NotificationRecord = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

type ListQuery = {
  q?: string;
  limit?: number;
  offset?: number;
  /** Backend: new | top | hot */
  sort?: "new" | "top" | "hot";
};

function buildQuery(params: ListQuery): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (typeof params.limit === "number") search.set("limit", String(params.limit));
  if (typeof params.offset === "number") search.set("offset", String(params.offset));
  if (params.sort) search.set("sort", params.sort);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchPosts(params: ListQuery = {}): Promise<PostRecord[]> {
  const response = await fetch(`${API_URL}/posts/${buildQuery(params)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Post list request failed");
  }

  const data = (await response.json()) as PostListResponse;
  return data.results ?? [];
}

export async function fetchPostById(postId: number): Promise<PostRecord | null> {
  const response = await fetch(`${API_URL}/posts/${postId}/`, {
    cache: "no-store",
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Post detail request failed");
  }
  return response.json();
}

export async function fetchSession(): Promise<SessionContext> {
  const response = await fetch(`${API_URL}/auth/session/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Session request failed");
  }

  return response.json();
}

type DocumentListResponse = {
  results: DocumentRecord[];
};

export async function fetchDocuments(params: ListQuery = {}): Promise<DocumentRecord[]> {
  const response = await fetch(`${API_URL}/documents/${buildQuery(params)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Document list request failed");
  }

  const data = (await response.json()) as DocumentListResponse;
  return data.results ?? [];
}

type CommentListResponse = {
  results: CommentRecord[];
};

export async function fetchComments(postId: number): Promise<CommentRecord[]> {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Comments request failed");
  }
  const data = (await response.json()) as CommentListResponse;
  return data.results ?? [];
}

type NotificationListResponse = {
  results: NotificationRecord[];
};

/** Fetches library notifications (proxied in browser via `/api/notifications` for same-origin). */
export async function fetchNotifications(): Promise<{
  items: NotificationRecord[];
  ok: boolean;
}> {
  const response = await fetch("/api/notifications", { cache: "no-store" });
  if (!response.ok) {
    return { items: [], ok: false };
  }
  const data = (await response.json()) as NotificationListResponse;
  return { items: data.results ?? [], ok: true };
}

export type VoteResponse = {
  id: number;
  score: number;
  comment_count: number;
};

export async function castVote(postId: number, direction: "up" | "down"): Promise<VoteResponse | null> {
  const response = await fetch("/api/forum/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post_id: postId, direction }),
  });
  if (!response.ok) {
    return null;
  }
  return response.json() as Promise<VoteResponse>;
}
