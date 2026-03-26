"use client";

import { useI18n } from "@/lib/hooks/use-i18n";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
        <span className="text-3xl" aria-hidden="true">&#9888;</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-display font-bold text-text-primary">
          {t.common.errorTitle}
        </h2>
        <p className="text-sm text-text-muted max-w-[280px]">
          {t.common.errorMessage}
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="min-h-12 px-8 rounded-xl bg-brand text-surface-0 font-semibold text-base active:bg-brand-dark transition-colors"
      >
        {t.common.retry}
      </button>
    </div>
  );
}
