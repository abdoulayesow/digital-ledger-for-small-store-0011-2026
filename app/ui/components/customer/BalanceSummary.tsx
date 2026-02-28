"use client";

import type { CustomerBalance } from "@/lib/db/balance";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { formatGNF } from "@/lib/utils";
import { useI18n } from "@/lib/hooks/use-i18n";
import { IconDebt, IconPayment } from "@/components/icons";

interface BalanceSummaryProps {
  balance: CustomerBalance;
  className?: string;
}

export function BalanceSummary({ balance, className = "" }: BalanceSummaryProps) {
  const { t } = useI18n();

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Large balance */}
      <div className="text-center">
        <p className="text-sm text-text-secondary mb-1">{t.customers.totalOwed}</p>
        <AmountDisplay
          amount={balance.balance}
          type={balance.balance > 0 ? "debt" : balance.balance < 0 ? "payment" : "neutral"}
          size="lg"
        />
      </div>

      {/* Breakdown row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-debt/10 flex items-center justify-center">
            <IconDebt size={16} className="text-debt" />
          </div>
          <div>
            <p className="text-xs text-text-muted">{t.sales.creditGiven}</p>
            <p className="text-sm font-semibold text-debt tabular-nums">
              {formatGNF(balance.totalCreditSales)}
            </p>
          </div>
        </div>

        <div className="w-px h-8 bg-surface-3" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-payment/10 flex items-center justify-center">
            <IconPayment size={16} className="text-payment" />
          </div>
          <div>
            <p className="text-xs text-text-muted">{t.sales.cashCollected}</p>
            <p className="text-sm font-semibold text-payment tabular-nums">
              {formatGNF(balance.totalPayments)}
            </p>
          </div>
        </div>
      </div>

      {/* Sale count */}
      <p className="text-xs text-text-muted">
        {balance.saleCount} {t.sales.saleCount}
      </p>
    </div>
  );
}
