"use client";

import { useState } from "react";
import { formatGNF } from "@/lib/utils";
import { useI18n } from "@/lib/hooks/use-i18n";

const PRESETS = [500, 1000, 2000, 5000, 10000, 25000] as const;

interface AmountPickerProps {
  onSelect: (amount: number) => void;
  selectedAmount: number | null;
  className?: string;
}

export function AmountPicker({ onSelect, selectedAmount, className = "" }: AmountPickerProps) {
  const { t } = useI18n();
  const [customValue, setCustomValue] = useState("");

  function handleCustomSubmit() {
    const parsed = parseInt(customValue.replace(/\D/g, ""), 10);
    if (parsed > 0) {
      onSelect(parsed);
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Preset grid — 2x3 */}
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onSelect(amount)}
            className={[
              "min-h-14 rounded-xl font-semibold text-base",
              "transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              selectedAmount === amount
                ? "bg-brand text-surface-0 border-2 border-brand"
                : "bg-surface-2 text-text-primary border border-surface-3/50 hover:border-brand/50",
            ].join(" ")}
          >
            {formatGNF(amount)}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          aria-label={t.sales.otherAmount}
          placeholder={t.sales.otherAmount}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCustomSubmit();
          }}
          className={[
            "flex-1 min-h-12 px-4 rounded-xl",
            "bg-surface-2 text-text-primary placeholder:text-text-muted",
            "border border-surface-3/50 focus:border-brand",
            "focus:outline-none text-base",
          ].join(" ")}
        />
        {customValue && (
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="min-h-12 px-4 rounded-xl bg-surface-2 text-brand font-semibold hover:bg-surface-3 transition-colors cursor-pointer"
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}
