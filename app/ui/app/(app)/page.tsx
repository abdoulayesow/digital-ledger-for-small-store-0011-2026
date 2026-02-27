"use client";

import { useI18n } from "@/lib/hooks/use-i18n";
import { useTotalReceivables, useDailySummary } from "@/lib/hooks/use-balance";
import { useRecentTransactions } from "@/lib/hooks/use-transactions";
import { useCustomers } from "@/lib/hooks/use-customers";
import { PageHeader } from "@/components/layout/PageHeader";
import { SyncStatusBadge } from "@/components/layout/SyncStatusBadge";
import { Card } from "@/components/ui/Card";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { TransactionList } from "@/components/transaction/TransactionList";
import { DeftarLogo } from "@/components/brand/DeftarLogo";
import { IconDebt, IconPayment } from "@/components/icons";
import { formatGNF } from "@/lib/utils";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function DashboardPage() {
  const { t } = useI18n();
  const retailerId = useRetailerId();
  const totalReceivables = useTotalReceivables(retailerId);
  const dailySummary = useDailySummary(retailerId);
  const recentTransactions = useRecentTransactions(retailerId, 10);
  const customers = useCustomers(retailerId);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.common.appName}
        rightAction={<SyncStatusBadge />}
      />

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Logo welcome */}
        <div className="flex justify-center py-2">
          <DeftarLogo size={40} />
        </div>

        {/* Total receivables */}
        <Card className="text-center py-5">
          <p className="text-sm text-text-secondary mb-1">{t.transactions.totalReceivables}</p>
          <AmountDisplay
            amount={totalReceivables ?? 0}
            type={totalReceivables && totalReceivables > 0 ? "debt" : "neutral"}
            size="lg"
          />
          <p className="text-xs text-text-muted mt-2">
            {customers?.length ?? 0} {t.nav.customers.toLowerCase()}
          </p>
        </Card>

        {/* Daily summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-debt/10 flex items-center justify-center">
                <IconDebt size={16} className="text-debt" />
              </div>
              <span className="text-xs text-text-muted">{t.transactions.creditGiven}</span>
            </div>
            <p className="text-lg font-semibold text-debt tabular-nums">
              {formatGNF(dailySummary?.totalDebts ?? 0)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-payment/10 flex items-center justify-center">
                <IconPayment size={16} className="text-payment" />
              </div>
              <span className="text-xs text-text-muted">{t.transactions.cashCollected}</span>
            </div>
            <p className="text-lg font-semibold text-payment tabular-nums">
              {formatGNF(dailySummary?.totalPayments ?? 0)}
            </p>
          </Card>
        </div>

        {/* Recent transactions */}
        <div>
          <h2
            className="text-sm font-semibold text-text-secondary mb-2 px-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.transactions.todaySummary}
          </h2>
          <TransactionList transactions={recentTransactions ?? []} />
        </div>
      </div>
    </div>
  );
}
