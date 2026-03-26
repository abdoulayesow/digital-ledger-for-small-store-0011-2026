"use client";

import { useState, useEffect, useCallback } from "react";
import { safeGetItem, safeSetItem } from "@/lib/utils";

const DISMISSED_KEY = "btiki-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Re-show after 7 days if previously dismissed
    const dismissedAt = safeGetItem(DISMISSED_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 86_400_000) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setDeferredPrompt(null);
    safeSetItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  return {
    canInstall: !!deferredPrompt && !dismissed,
    promptInstall,
    dismiss,
  };
}
