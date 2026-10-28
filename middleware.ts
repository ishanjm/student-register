import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev_super_secret_jwt_key_123"
);

// Protected path prefixes
const PROTECTED_PREFIXES = ["/", "/students", "/admin"];
const PUBLIC_PATHS = ["/login", "/signup", "/api/auth/login", "/api/auth/signup", "/api/auth/refresh"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, Next internals, and public endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/auth/refresh")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  // Check if current route is login or signup
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, ACCESS_SECRET);
        if (payload && payload.status === "approved") {
          // Already logged in and approved -> redirect to dashboard
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        // Expired or invalid token, let them access login/signup
      }
    }
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtected =
    pathname === "/" ||
    pathname.startsWith("/students") ||
    pathname.startsWith("/admin");

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, ACCESS_SECRET);

      // Verify that user is approved by admin
      if (payload.status !== "approved") {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "pending_approval");
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    } catch {
      // Access token invalid or expired
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
