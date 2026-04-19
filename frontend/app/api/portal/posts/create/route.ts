import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    return NextResponse.redirect(new URL("/portal/posts?error=1", request.url));
  }

  try {
    const response = await fetch(`${API_URL}/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/portal/posts?error=1", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/portal/posts?error=1", request.url));
  }

  return NextResponse.redirect(new URL("/portal/posts?created=1", request.url));
}
