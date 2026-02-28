"use client";

import type { Sale } from "@/lib/db/schema";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { IconDebt, IconPayment, IconCoin } from "@/components/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useI18n } from "@/lib/hooks/use-i18n";

interface SaleListProps {
  sales: Sale[];
  className?: string;
}

function formatRelativeDate(date: Date, t: { today: string; yesterday: string }): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const saleDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t.today;
  if (diffDays === 1) return t.yesterday;
  return date.toLocaleDateString("fr-GN", { day: "numeric", month: "short" });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-GN", { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(sales: Sale[]): Map<string, Sale[]> {
  const groups = new Map<string, Sale[]>();
  for (const sale of sales) {
    const d = new Date(sale.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const group = groups.get(key);
    if (group) {
      group.push(sale);
    } else {
      groups.set(key, [sale]);
    }
  }
  return groups;
}

export function SaleList({ sales, className = "" }: SaleListProps) {
  const { t } = useI18n();

  if (sales.length === 0) {
    return (
      <EmptyState
        icon={<IconCoin />}
        title={t.common.noData}
        className={className}
      />
    );
  }

  const grouped = groupByDate(sales);

  return (
    <div className={`flex flex-col ${className}`}>
      {Array.from(grouped.entries()).map(([key, items]) => (
        <div key={key}>
          <div className="sticky top-0 bg-surface-0 px-4 py-2 z-10">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {formatRelativeDate(new Date(items[0].createdAt), { today: t.common.today, yesterday: t.common.yesterday })}
            </span>
          </div>
          <ul className="flex flex-col">
            {items.map((sale) => (
              <li
                key={sale.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-surface-3/30"
              >
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    sale.type === "credit"
                      ? "bg-debt/10 text-debt"
                      : sale.type === "payment"
                        ? "bg-payment/10 text-payment"
                        : "bg-surface-3/30 text-text-secondary",
                  ].join(" ")}
                >
                  {sale.type === "credit"
                    ? <IconDebt size={20} />
                    : sale.type === "payment"
                      ? <IconPayment size={20} />
                      : <IconCoin size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-text-secondary">
                      {formatTime(new Date(sale.createdAt))}
                    </span>
                    <AmountDisplay
                      amount={sale.amount}
                      type={sale.type === "credit" ? "debt" : sale.type === "payment" ? "payment" : "neutral"}
                      size="sm"
                    />
                  </div>
                  {sale.note && (
                    <p className="text-xs text-text-muted truncate mt-0.5">{sale.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
