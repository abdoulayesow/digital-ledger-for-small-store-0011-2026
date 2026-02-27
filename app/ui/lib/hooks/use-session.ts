"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Language } from "@/lib/db/schema";

export interface SessionInfo {
  retailerId: string;
  phone: string;
  language: Language;
  shopName: string | null;
}

let cachedSession: SessionInfo | null = null;
let cachedAt: number = 0;

const REVALIDATION_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const SessionContext = createContext<SessionInfo | null>(null);

/**
 * Get the session from SessionContext.
 * Must be used inside <SessionProvider>.
 */
export function useSessionContext(): SessionInfo | null {
  return useContext(SessionContext);
}

/**
 * Fetch the current session from /api/auth/session.
 * Caches in memory to avoid refetching on every navigation.
 * Returns null while loading, or the session data.
 * On 401, redirects to /login.
 * Revalidates when tab becomes visible after 15+ minutes.
 */
export function useSession(): {
  session: SessionInfo | null;
  loading: boolean;
  error: boolean;
  retry: () => void;
} {
  const [session, setSession] = useState<SessionInfo | null>(cachedSession);
  const [loading, setLoading] = useState(cachedSession === null);
  const [error, setError] = useState(false);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/auth/session");
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        const info: SessionInfo = {
          retailerId: data.retailer.id,
          phone: data.retailer.phone,
          language: data.retailer.language,
          shopName: data.retailer.shopName,
        };
        cachedSession = info;
        cachedAt = Date.now();
        setSession(info);
      } else {
        setError(true);
      }
    } catch {
      // Network error — offline, don't redirect
      if (!cachedSession) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cachedSession) {
      fetchSession();
    }
  }, [fetchSession]);

  // Revalidate on tab focus when cache is stale
  useEffect(() => {
    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        cachedAt > 0 &&
        Date.now() - cachedAt > REVALIDATION_INTERVAL
      ) {
        fetchSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchSession]);

  return { session, loading, error, retry: fetchSession };
}

/**
 * Clear the cached session (call on logout).
 */
export function clearSessionCache(): void {
  cachedSession = null;
  cachedAt = 0;
}
