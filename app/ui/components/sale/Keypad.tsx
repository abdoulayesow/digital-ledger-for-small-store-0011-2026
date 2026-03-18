"use client";

import { formatGNF } from "@/lib/utils";
import { useI18n } from "@/lib/hooks/use-i18n";

interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["DEL", "0", "00"],
] as const;

export function Keypad({ value, onChange, onConfirm, disabled }: KeypadProps) {
  const { t } = useI18n();
  const amount = parseInt(value || "0", 10);

  function handleKey(key: string) {
    if (key === "DEL") {
      onChange(value.slice(0, -1));
    } else {
      // Prevent absurdly long numbers
      if (value.length >= 10) return;
      onChange(value + key);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Amount display */}
      <div className="text-center py-3 px-4 rounded-xl bg-surface-2 border border-surface-3/50">
        <p className="text-2xl font-bold text-text-primary tabular-nums">
          {amount > 0 ? formatGNF(amount) : "—"}
        </p>
      </div>

      {/* Keypad grid */}
      <div className="grid grid-cols-3 gap-2">
        {ROWS.flat().map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className={[
              "min-h-14 rounded-xl font-semibold text-lg",
              "transition-all duration-100 cursor-pointer",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              key === "DEL"
                ? "bg-surface-3/50 text-text-secondary"
                : "bg-surface-2 text-text-primary border border-surface-3/50",
            ].join(" ")}
          >
            {key === "DEL" ? t.common.delete : key}
          </button>
        ))}
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled || amount <= 0}
        className={[
          "w-full min-h-14 rounded-xl font-bold text-lg",
          "transition-all duration-100 cursor-pointer",
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          "bg-brand text-surface-0",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        ].join(" ")}
      >
        {t.common.confirm}
      </button>
    </div>
  );
}
