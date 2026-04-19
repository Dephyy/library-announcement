import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const postIdRaw = Number(formData.get("post_id") ?? "0");
  const authorName = String(formData.get("author_name") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isFinite(postIdRaw) || postIdRaw <= 0 || !authorName || !content) {
    return NextResponse.redirect(new URL(`/announcements/${postIdRaw}?error=1`, request.url));
  }

  try {
    const response = await fetch(`${API_URL}/posts/${postIdRaw}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_name: authorName, content }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL(`/announcements/${postIdRaw}?error=1`, request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL(`/announcements/${postIdRaw}?error=1`, request.url));
  }

  return NextResponse.redirect(new URL(`/announcements/${postIdRaw}?created=1`, request.url));
}