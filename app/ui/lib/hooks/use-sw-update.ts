"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DISMISSED_KEY = "btiki-update-dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useSWUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const regRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Check if dismissed within cooldown
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) {
      setDismissed(true);
      return;
    }

    let cancelled = false;

    const onUpdateFound = () => {
      const reg = regRef.current;
      if (!reg) return;
      const newWorker = reg.installing;
      if (!newWorker || cancelled) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          setWaitingWorker(newWorker);
        }
      });
    };

    navigator.serviceWorker.ready.then((registration) => {
      if (cancelled) return;
      regRef.current = registration;

      // Check if a worker is already waiting
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
      }

      // Listen for new updates
      registration.addEventListener("updatefound", onUpdateFound);
    });

    return () => {
      cancelled = true;
      regRef.current?.removeEventListener("updatefound", onUpdateFound);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }, [waitingWorker]);

  const dismissUpdate = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  return {
    updateAvailable: !!waitingWorker && !dismissed,
    applyUpdate,
    dismissUpdate,
  };
}
