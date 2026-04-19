import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/notifications/`, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ results: [], error: "upstream_failed" }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], error: "unreachable" }, { status: 503 });
  }
}
