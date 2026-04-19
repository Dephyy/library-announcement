import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function POST(request: Request) {
  let body: { post_id?: number; direction?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const postId = Number(body.post_id);
  const direction = body.direction;
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ detail: "Invalid post_id" }, { status: 400 });
  }
  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ detail: "direction must be up or down" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/posts/${postId}/vote/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ detail: "Backend unreachable" }, { status: 503 });
  }
}
