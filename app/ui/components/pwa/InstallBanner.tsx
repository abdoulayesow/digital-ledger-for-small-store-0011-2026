"use client";

import { useInstallPrompt } from "@/lib/hooks/use-install-prompt";
import { useI18n } from "@/lib/hooks/use-i18n";
import { IconX } from "@/components/icons";

export function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();
  const { t } = useI18n();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl bg-surface-1 border border-surface-3 p-4 shadow-lg">
      {/* App icon */}
      <img
        src="/icons/icon-192.png"
        alt=""
        className="w-10 h-10 rounded-lg flex-shrink-0"
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">
          {t.pwa.install}
        </p>
        <p className="text-xs text-text-muted line-clamp-2">
          {t.pwa.installDescription}
        </p>
      </div>

      {/* Install button */}
      <button
        type="button"
        onClick={promptInstall}
        className="min-h-12 px-4 rounded-xl bg-brand text-white text-sm font-semibold flex-shrink-0 cursor-pointer"
      >
        {t.pwa.install}
      </button>

      {/* Dismiss */}
      <button
        type="button"
        onClick={dismiss}
        className="min-w-12 min-h-12 flex items-center justify-center text-text-muted cursor-pointer"
        aria-label={t.pwa.dismiss}
      >
        <IconX size={18} />
      </button>
    </div>
  );
}
