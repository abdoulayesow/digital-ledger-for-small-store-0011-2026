"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { UNDO_DURATION_SECONDS } from "@/lib/constants";
import { deleteSale } from "@/lib/db/sales";
import type { SaleType } from "@/lib/db/schema";

interface UndoableSale {
  saleId: string;
  amount: number;
  type: SaleType;
  expiresAt: number;
}

interface UndoSaleContextValue {
  undoable: UndoableSale | null;
  secondsLeft: number;
  setUndoableSale: (sale: Pick<UndoableSale, "saleId" | "amount" | "type">) => void;
  undoSale: () => Promise<void>;
  clearUndo: () => void;
}

const UndoSaleContext = createContext<UndoSaleContextValue | null>(null);

export function UndoSaleProvider({ children }: { children: ReactNode }) {
  const [undoable, setUndoable] = useState<UndoableSale | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const clearUndo = useCallback(() => {
    setUndoable(null);
    setSecondsLeft(0);
  }, []);

  const setUndoableSale = useCallback(
    (sale: Pick<UndoableSale, "saleId" | "amount" | "type">) => {
      setUndoable({
        ...sale,
        expiresAt: Date.now() + UNDO_DURATION_SECONDS * 1000,
      });
      setSecondsLeft(UNDO_DURATION_SECONDS);
    },
    []
  );

  const undoSale = useCallback(async () => {
    if (!undoable) return;
    try {
      await deleteSale(undoable.saleId);
      clearUndo();
    } catch (err) {
      console.error("[undo-sale] Failed to undo:", err);
    }
  }, [undoable, clearUndo]);

  // Countdown timer
  useEffect(() => {
    if (!undoable) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((undoable.expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearUndo();
      } else {
        setSecondsLeft(remaining);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [undoable, clearUndo]);

  return (
    <UndoSaleContext.Provider value={{
      undoable,
      secondsLeft,
      setUndoableSale,
      undoSale,
      clearUndo,
    }}>
      {children}
    </UndoSaleContext.Provider>
  );
}

export function useUndoSale(): UndoSaleContextValue {
  const ctx = useContext(UndoSaleContext);
  if (!ctx) throw new Error("useUndoSale must be used inside UndoSaleProvider");
  return ctx;
}
