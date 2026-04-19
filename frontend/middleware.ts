import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/portal")) {
    const authCookie = request.cookies.get("library_portal_auth")?.value;
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
