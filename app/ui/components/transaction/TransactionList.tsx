"use client";

import type { Transaction } from "@/lib/db/schema";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { IconDebt, IconPayment } from "@/components/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCoin } from "@/components/icons";
import { useI18n } from "@/lib/hooks/use-i18n";

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
}

function formatRelativeDate(date: Date, t: { today: string; yesterday: string }): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t.today;
  if (diffDays === 1) return t.yesterday;
  return date.toLocaleDateString("fr-GN", { day: "numeric", month: "short" });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-GN", { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const group = groups.get(key);
    if (group) {
      group.push(tx);
    } else {
      groups.set(key, [tx]);
    }
  }
  return groups;
}

export function TransactionList({ transactions, className = "" }: TransactionListProps) {
  const { t } = useI18n();

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<IconCoin />}
        title={t.common.noData}
        className={className}
      />
    );
  }

  const grouped = groupByDate(transactions);

  return (
    <div className={`flex flex-col ${className}`}>
      {Array.from(grouped.entries()).map(([key, txns]) => (
        <div key={key}>
          <div className="sticky top-0 bg-surface-0 px-4 py-2 z-10">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {formatRelativeDate(new Date(txns[0].createdAt), { today: t.common.today, yesterday: t.common.yesterday })}
            </span>
          </div>
          <ul className="flex flex-col">
            {txns.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-surface-3/30"
              >
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    tx.type === "debt" ? "bg-debt/10 text-debt" : "bg-payment/10 text-payment",
                  ].join(" ")}
                >
                  {tx.type === "debt" ? <IconDebt size={20} /> : <IconPayment size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-text-secondary">
                      {formatTime(new Date(tx.createdAt))}
                    </span>
                    <AmountDisplay
                      amount={tx.amount}
                      type={tx.type === "debt" ? "debt" : "payment"}
                      size="sm"
                    />
                  </div>
                  {tx.note && (
                    <p className="text-xs text-text-muted truncate mt-0.5">{tx.note}</p>
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
