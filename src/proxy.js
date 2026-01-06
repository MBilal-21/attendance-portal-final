// /src/proxy.js
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // don't run middleware for next internals or static/public assets
  const STATIC_EXT_REGEX = /\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|json|map)$/i;
  if (
    pathname === "/" || 
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname.startsWith("/assets") || // optional folder for illustrations
    STATIC_EXT_REGEX.test(pathname)   // files from public/ (e.g. /logo.svg)
  ) {
    return NextResponse.next();
  }

  // Read token from cookie
  const token = req.cookies.get(process.env.COOKIE_NAME || "token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = verifyToken(token);
    const role = decoded.role;

    // ROLE BASED DASHBOARD PROTECTION
    if (pathname.startsWith("/admin") && role !== "admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/teacher") && role !== "teacher") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/student") && role !== "student") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Allow access
    const response = NextResponse.next({
      request: {
        headers: new Headers(req.headers),
      },
    });

    // Pass user info in headers (optional)
    response.headers.set("x-user-id", decoded.id);
    response.headers.set("x-user-role", role);

    return response;
  } catch (err) {
    // Invalid token → redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

// Use a simple matcher (catch-all) and rely on the early-return above to skip public/static assets.
// This avoids invalid capturing-group regex errors in Next.js matcher.
export const config = {
  matcher: ["/:path*"],
};
