"use client";

import { useUndoSale } from "@/lib/hooks/use-undo-sale";
import { useI18n } from "@/lib/hooks/use-i18n";
import { formatGNF } from "@/lib/utils";

export function UndoBar() {
  const { undoable, secondsLeft, undoSale } = useUndoSale();
  const { t } = useI18n();

  if (!undoable) return null;

  return (
    <div className="mx-4 mb-2 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-debt/10 border border-debt/30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-debt tabular-nums">
          {formatGNF(undoable.amount)}
        </span>
        <span className="text-xs text-debt/70 tabular-nums">
          {secondsLeft}s
        </span>
      </div>
      <button
        type="button"
        onClick={undoSale}
        className="min-h-12 text-sm font-bold text-debt cursor-pointer shrink-0 active:scale-[0.98] flex items-center"
      >
        {t.sales.undoSale}
      </button>
    </div>
  );
}
