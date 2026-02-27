"use client";

import { useSession, SessionContext } from "@/lib/hooks/use-session";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, error, retry } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-0">
        <div
          className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-0 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-text-primary font-semibold">Unable to load session</p>
          <p className="text-sm text-text-muted">Check your connection and try again.</p>
          <button
            type="button"
            onClick={retry}
            className="min-h-12 px-6 rounded-xl bg-brand text-white font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If not loading and no session, useSession already redirected to /login
  if (!session) {
    return null;
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
