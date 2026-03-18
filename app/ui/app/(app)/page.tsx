"use client";

import Link from "next/link";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useTotalReceivables, useDailySummary } from "@/lib/hooks/use-balance";
import { useRecentSales } from "@/lib/hooks/use-sales";
import { useCustomers } from "@/lib/hooks/use-customers";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { SaleList } from "@/components/sale/SaleList";
import { IconDebt, IconPayment, IconCoin } from "@/components/icons";
import { formatGNF } from "@/lib/utils";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function DashboardPage() {
  const { t } = useI18n();
  const retailerId = useRetailerId();
  const totalReceivables = useTotalReceivables(retailerId);
  const dailySummary = useDailySummary(retailerId);
  const recentSales = useRecentSales(retailerId, 10);
  const customers = useCustomers(retailerId);

  return (
    <div className="flex flex-col">
      <AppHeader />

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Quick Sale — primary action */}
        <Link
          href="/sales/quick"
          className={[
            "relative overflow-hidden flex items-center justify-center gap-3",
            "min-h-16 rounded-2xl",
            "bg-brand text-surface-0 font-display font-bold text-lg",
            "border-2 border-brand-light/30",
            "active:scale-[0.98] transition-transform duration-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
          ].join(" ")}
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/0 via-brand-light/20 to-brand-dark/0 pointer-events-none" />
          <IconCoin size={24} className="relative text-surface-0" />
          <span className="relative">{t.sales.quickSale}</span>
        </Link>

        {/* Total receivables */}
        <Link href="/customers">
          <Card className="text-center py-5">
            <p className="text-sm text-text-secondary mb-1">{t.sales.totalReceivables}</p>
            <AmountDisplay
              amount={totalReceivables ?? 0}
              type={totalReceivables && totalReceivables > 0 ? "debt" : "neutral"}
              size="lg"
            />
            <p className="text-xs text-text-muted mt-2">
              {customers?.length ?? 0} {t.nav.customers.toLowerCase()}
            </p>
          </Card>
        </Link>

        {/* Daily summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-debt/10 flex items-center justify-center">
                <IconDebt size={16} className="text-debt" />
              </div>
              <span className="text-xs text-text-muted">{t.sales.creditGiven}</span>
            </div>
            <p className="text-lg font-semibold text-debt tabular-nums">
              {formatGNF(dailySummary?.totalCreditSales ?? 0)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-payment/10 flex items-center justify-center">
                <IconPayment size={16} className="text-payment" />
              </div>
              <span className="text-xs text-text-muted">{t.sales.cashCollected}</span>
            </div>
            <p className="text-lg font-semibold text-payment tabular-nums">
              {formatGNF(dailySummary?.totalPayments ?? 0)}
            </p>
          </Card>
        </div>

        {/* Recent sales */}
        <div>
          <h2
            className="text-sm font-semibold text-text-secondary mb-2 px-1 font-display"
          >
            {t.sales.todaySummary}
          </h2>
          <SaleList sales={recentSales ?? []} />
        </div>
      </div>
    </div>
  );
}
