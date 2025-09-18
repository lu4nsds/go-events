import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/lib/auth";

const publicPaths = ["/", "/login", "/register"];
const adminPaths = ["/admin"];
const protectedPaths = ["/meus-eventos"];

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

  // Verify token
  const user = verifyToken(token);
  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  // Check admin access
  if (adminPaths.some((path) => pathname.startsWith(path)) && !user.isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
