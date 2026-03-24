"use client";

import type { Sale } from "@/lib/db/schema";
import { Modal } from "@/components/ui/Modal";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { IconCoin, IconDebt, IconPayment } from "@/components/icons";
import { useI18n } from "@/lib/hooks/use-i18n";

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("fr-GN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSaleVisuals(type: Sale["type"]) {
  switch (type) {
    case "credit":
      return { Icon: IconDebt, iconBg: "bg-debt/10 text-debt", amountType: "debt" as const };
    case "payment":
      return { Icon: IconPayment, iconBg: "bg-payment/10 text-payment", amountType: "payment" as const };
    default:
      return { Icon: IconCoin, iconBg: "bg-brand/10 text-brand", amountType: "neutral" as const };
  }
}

function getSaleLabel(type: Sale["type"], t: ReturnType<typeof useI18n>["t"]) {
  switch (type) {
    case "credit": return t.sales.addCreditSale;
    case "payment": return t.sales.addPayment;
    default: return t.sales.addCashSale;
  }
}

export function SaleDetailModal({ sale, onClose }: SaleDetailModalProps) {
  const { t } = useI18n();

  const visuals = sale ? getSaleVisuals(sale.type) : null;
  const title = sale ? getSaleLabel(sale.type, t) : undefined;

  return (
    <Modal open={!!sale} onClose={onClose} title={title}>
      {sale && visuals && (
        <div className="flex flex-col gap-5 py-2">
          {/* Hero — icon + amount */}
          <div className="flex flex-col items-center gap-3 pt-2 pb-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${visuals.iconBg}`}>
              <visuals.Icon size={30} />
            </div>
            <AmountDisplay amount={sale.amount} type={visuals.amountType} size="lg" />
          </div>

          {/* Detail rows — structured card */}
          <div className="flex flex-col divide-y divide-surface-3/20 bg-surface-2/50 rounded-xl border border-surface-3/20">
            {/* Timestamp */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t.common.today}
              </span>
              <span className="text-sm text-text-primary tabular-nums">
                {formatDateTime(new Date(sale.createdAt))}
              </span>
            </div>

            {/* Note */}
            {sale.note && (
              <div className="flex items-start justify-between px-4 py-3.5 gap-6">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide shrink-0 pt-0.5">
                  {t.sales.note}
                </span>
                <span className="text-sm text-text-secondary text-right leading-relaxed">
                  {sale.note}
                </span>
              </div>
            )}

            {/* Sync status */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t.common.syncing}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${sale.syncStatus === "synced" ? "bg-payment" : "bg-text-muted"}`} />
                <span className="text-text-secondary">
                  {sale.syncStatus === "synced" ? t.common.online : t.common.offline}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
