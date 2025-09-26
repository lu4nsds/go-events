import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { canAccessRoute, getRedirectRoute, UserRole } from "./lib/permissions";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check if route needs authentication
  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname === "/meus-eventos" ||
    pathname.startsWith("/api/auth/me") ||
    pathname.startsWith("/api/auth/logout");

  if (!needsAuth) {
    return NextResponse.next();
  }

  // Check authentication
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token using jose
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole =
      (payload.role as string) || (payload.isAdmin ? "ADMIN" : "USER");

    // Check permissions for the route
    if (!canAccessRoute(userRole as UserRole, pathname)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }

      // Redirect to appropriate route based on user role
      const redirectPath = getRedirectRoute(userRole as UserRole, pathname);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Add user information to headers for API routes
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId as string);
    response.headers.set("x-user-role", userRole);
    response.headers.set("x-user-email", payload.email as string);

    return response;
  } catch (error) {
    console.error("Erro ao verificar token:", error);

    // Clear invalid token
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Token inválido" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/meus-eventos",
    "/api/auth/me",
    "/api/auth/logout",
  ],
};
