import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "deftar-session";

interface SessionData {
  sessionId: string;
  retailerId: string;
}

interface SessionResult {
  session: SessionData | null;
  error: NextResponse | null;
}

/**
 * Validate the current session from request cookies.
 * Use in API routes: `const { session, error } = await requireSession()`
 */
export async function requireSession(): Promise<SessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  // Dynamic import keeps Prisma out of client bundles
  const { default: prisma } = await import("@/lib/prisma");

  const dbSession = await prisma.session.findUnique({
    where: { token },
    select: { id: true, retailerId: true, expiresAt: true },
  });

  if (!dbSession || dbSession.expiresAt < new Date()) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      ),
    };
  }

  return {
    session: { sessionId: dbSession.id, retailerId: dbSession.retailerId },
    error: null,
  };
}

/**
 * Set the session cookie after successful login.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Clear the session cookie on logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };
