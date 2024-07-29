import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifymail";

  const token = request.cookies.get("token")?.value || "";

  // if the user has token he/she shouldn't see public pages. e.g login, signup, verifymail
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // is the user isn't logged in redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/login", "/signup", "/verifymail", "/profile"],
};
