"use client";

import { useSWUpdate } from "@/lib/hooks/use-sw-update";
import { useI18n } from "@/lib/hooks/use-i18n";
import { IconX } from "@/components/icons";

export function UpdateBanner() {
  const { updateAvailable, applyUpdate, dismissUpdate } = useSWUpdate();
  const { t } = useI18n();

  if (!updateAvailable) return null;

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
          {t.pwa.updateAvailable}
        </p>
        <p className="text-xs text-text-muted line-clamp-2">
          {t.pwa.updateDescription}
        </p>
      </div>

      {/* Update button */}
      <button
        type="button"
        onClick={applyUpdate}
        className="min-h-12 px-4 rounded-xl bg-brand text-white text-sm font-semibold flex-shrink-0 cursor-pointer"
      >
        {t.pwa.update}
      </button>

      {/* Dismiss */}
      <button
        type="button"
        onClick={dismissUpdate}
        className="min-w-12 min-h-12 flex items-center justify-center text-text-muted cursor-pointer"
        aria-label={t.pwa.dismiss}
      >
        <IconX size={18} />
      </button>
    </div>
  );
}
