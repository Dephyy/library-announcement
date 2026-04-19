import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("library_portal_auth", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}