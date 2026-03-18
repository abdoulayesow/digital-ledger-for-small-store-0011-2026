"use client";

import { useState } from "react";
import { formatGNF } from "@/lib/utils";
import { AMOUNT_PRESETS } from "@/lib/constants";
import { Keypad } from "@/components/sale/Keypad";

interface AmountPickerProps {
  onSelect: (amount: number) => void;
  onConfirm?: () => void;
  selectedAmount: number | null;
  className?: string;
}

export function AmountPicker({ onSelect, onConfirm, selectedAmount, className = "" }: AmountPickerProps) {
  const [keypadValue, setKeypadValue] = useState("");

  function handlePresetTap(amount: number) {
    setKeypadValue(String(amount));
    onSelect(amount);
    onConfirm?.();
  }

  function handleKeypadConfirm() {
    const parsed = parseInt(keypadValue, 10);
    if (parsed > 0) {
      onSelect(parsed);
      onConfirm?.();
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Preset chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {AMOUNT_PRESETS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePresetTap(amount)}
            className={[
              "shrink-0 min-h-10 px-4 rounded-full font-semibold text-sm",
              "transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              selectedAmount === amount
                ? "bg-brand text-surface-0"
                : "bg-surface-2 text-text-primary border border-surface-3/50",
            ].join(" ")}
          >
            {formatGNF(amount)}
          </button>
        ))}
      </div>

      {/* Numeric keypad */}
      <Keypad
        value={keypadValue}
        onChange={setKeypadValue}
        onConfirm={handleKeypadConfirm}
      />
    </div>
  );
}
