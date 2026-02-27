import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "deftar-session";

/**
 * Lightweight middleware: check that the session cookie exists.
 * Full validation happens in API routes via requireSession().
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login (auth page)
     * - /offline (offline fallback)
     * - /api/auth/* (auth endpoints)
     * - /icons/* (PWA icons)
     * - /manifest.json (PWA manifest)
     * - /favicon.ico
     * - /_next/* (Next.js internals)
     */
    "/((?!login|offline|api/auth|icons|manifest\\.json|favicon\\.ico|_next).*)",
  ],
};
