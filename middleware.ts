import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register"];
const adminPaths = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Check if path is public
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For admin paths, we'll do a basic check
  // The actual admin verification will happen on the server side
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Let the actual page handle admin verification
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
