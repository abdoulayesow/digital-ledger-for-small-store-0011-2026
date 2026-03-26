"use client";

import Link from "next/link";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useTotalReceivables, useDailySummary } from "@/lib/hooks/use-balance";
import { useRecentSales } from "@/lib/hooks/use-sales";
import { SaleList } from "@/components/sale/SaleList";
import { IconCoin, IconDebt, IconPayment, IconChevronRight } from "@/components/icons";
import { formatGNF } from "@/lib/utils";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function DashboardPage() {
  const { t } = useI18n();
  const retailerId = useRetailerId();
  const totalReceivables = useTotalReceivables(retailerId);
  const dailySummary = useDailySummary(retailerId);
  const recentSales = useRecentSales(retailerId, 10);

  const isLoading = dailySummary === undefined;

  const totalCash = dailySummary?.totalCashSales ?? 0;
  const totalCredit = dailySummary?.totalCreditSales ?? 0;
  const totalPayments = dailySummary?.totalPayments ?? 0;
  const todayTotal = totalCash + totalCredit + totalPayments;
  const saleCount = dailySummary?.saleCount ?? 0;

  const hasSales = (recentSales ?? []).length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-4">
        {/* Hero skeleton */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-4 mx-4">
          <div className="h-3 w-24 bg-surface-2 rounded animate-pulse" />
          <div className="h-10 w-40 bg-surface-2 rounded animate-pulse" />
          <div className="h-3 w-16 bg-surface-2 rounded animate-pulse" />
        </div>
        {/* Breakdown strip skeleton */}
        <div className="mx-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 py-3">
              <div className="h-5 w-5 bg-surface-2 rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-surface-2 rounded animate-pulse" />
              <div className="h-2 w-12 bg-surface-2 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Sale rows skeleton */}
        <div className="px-4 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 bg-surface-2 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 pb-4">
        {/* Hero — today's total revenue with subtle brand glow */}
        <div
          className="text-center pt-8 pb-4 mx-4 rounded-lg"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">
            {t.sales.todayTotal}
          </p>
          <p className="text-[2.5rem] leading-none font-display font-black text-brand tabular-nums">
            {formatGNF(todayTotal)}
          </p>
          <p className="text-xs text-text-muted mt-2">
            {saleCount} {t.sales.saleCount}
          </p>
        </div>

        {/* Breakdown strip — Cash | Credit | Payments */}
        <div className="mx-4 grid grid-cols-3 divide-x divide-surface-3/30 bg-surface-1 rounded-lg border border-surface-3/30">
          <div className="flex flex-col items-center gap-1.5 py-3">
            <IconCoin size={18} className="text-brand" />
            <p className="text-sm font-semibold tabular-nums">{formatGNF(totalCash)}</p>
            <p className="text-[10px] text-text-muted">{t.sales.cashSales}</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-3">
            <IconDebt size={18} className="text-debt" />
            <p className="text-sm font-semibold tabular-nums">{formatGNF(totalCredit)}</p>
            <p className="text-[10px] text-text-muted">{t.sales.creditGiven}</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-3">
            <IconPayment size={18} className="text-payment" />
            <p className="text-sm font-semibold tabular-nums">{formatGNF(totalPayments)}</p>
            <p className="text-[10px] text-text-muted">{t.sales.cashCollected}</p>
          </div>
        </div>

        {hasSales ? (
          <>
            {/* Recent sales */}
            <div className="px-4">
              <h2 className="text-sm font-semibold text-text-secondary mb-2 px-1 font-display">
                {t.sales.todaySummary}
              </h2>
              <SaleList sales={recentSales ?? []} />
            </div>

            {/* Receivables row — only shown when > 0 */}
            {(totalReceivables ?? 0) > 0 && (
              <Link
                href="/customers"
                className="mx-4 flex items-center gap-3 px-3 py-3 rounded-lg bg-surface-1 border border-surface-3/30 border-l-2 border-l-debt active:bg-surface-2 transition-colors"
              >
                <IconDebt size={20} className="text-debt" />
                <span className="flex-1 text-sm text-text-secondary">{t.sales.totalReceivables}</span>
                <span className="text-sm font-semibold text-debt tabular-nums">
                  {formatGNF(totalReceivables ?? 0)}
                </span>
                <IconChevronRight size={16} className="text-text-muted" />
              </Link>
            )}
          </>
        ) : (
          /* Empty state — first-time user, no sales yet */
          <div className="mx-4 flex flex-col items-center gap-5 py-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)",
                border: "1px solid rgba(245,158,11,0.15)",
              }}
            >
              <IconCoin size={36} className="text-brand" />
            </div>
            <div className="text-center flex flex-col gap-1.5">
              <p className="text-lg font-display font-bold text-text-secondary">
                {t.sales.quickSale}
              </p>
              <p className="text-sm text-text-muted leading-relaxed max-w-[240px]">
                {t.sales.enterAmount}
              </p>
            </div>
            <Link
              href="/sales/quick"
              className="inline-flex items-center gap-2 min-h-12 px-6 rounded-xl bg-brand text-surface-0 font-semibold text-base active:bg-brand-dark transition-colors"
            >
              <IconCoin size={20} />
              {t.sales.quickSale}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
