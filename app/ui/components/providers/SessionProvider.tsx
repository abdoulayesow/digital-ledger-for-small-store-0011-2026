"use client";

import { useEffect } from "react";
import { useSession, SessionContext } from "@/lib/hooks/use-session";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useServiceWorker } from "@/lib/hooks/use-service-worker";
import { startSync, stopSync } from "@/lib/sync/engine";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, error, retry } = useSession();
  const { t } = useI18n();

  // Register service worker for PWA installability + offline caching
  useServiceWorker();

  // Start background sync when session is available
  useEffect(() => {
    if (!session) return;
    startSync();
    return () => stopSync();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-0">
        <div
          className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label={t.common.loading}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-0 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-text-primary font-semibold">{t.common.sessionError}</p>
          <p className="text-sm text-text-muted">{t.common.connectionCheck}</p>
          <button
            type="button"
            onClick={retry}
            className="min-h-12 px-6 rounded-xl bg-brand text-white font-semibold cursor-pointer"
          >
            {t.common.retry}
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
