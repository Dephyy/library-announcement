import { NextResponse } from "next/server";

const LOCAL_USERS: Record<string, { password: string; role: string }> = {
  admin: { password: "Admin@123", role: "ADMIN" },
  librarian: { password: "Lib@123", role: "LIBRARIAN" },
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = LOCAL_USERS[username];
  if (!user || user.password !== password) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/portal", request.url));
  response.cookies.set("library_portal_auth", `${user.role}:${username}`, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}