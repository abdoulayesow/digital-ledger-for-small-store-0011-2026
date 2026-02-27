"use client";

import type { Customer } from "@/lib/db/schema";
import type { CustomerBalance } from "@/lib/db/balance";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Card } from "@/components/ui/Card";
import { IconChevronRight } from "@/components/icons";
import { getDebtAge } from "@/lib/utils";
import { useI18n } from "@/lib/hooks/use-i18n";

interface CustomerCardProps {
  customer: Customer;
  balance: CustomerBalance | undefined;
  onClick?: () => void;
  className?: string;
}

export function CustomerCard({ customer, balance, onClick, className = "" }: CustomerCardProps) {
  const { t } = useI18n();
  const debtAge =
    balance && balance.balance > 0 && balance.lastTransactionDate
      ? getDebtAge(balance.lastTransactionDate)
      : null;

  return (
    <Card onClick={onClick} className={`flex items-center gap-3 ${className}`}>
      <Avatar name={customer.name} size="md" />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary truncate">{customer.name}</p>
        {customer.phone && (
          <p className="text-sm text-text-secondary truncate">{customer.phone}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {balance && (
          <div className="flex flex-col items-end gap-1">
            <AmountDisplay
              amount={balance.balance}
              type={balance.balance > 0 ? "debt" : balance.balance < 0 ? "payment" : "neutral"}
              size="sm"
            />
            {debtAge && (
              <Badge variant={debtAge}>
                {debtAge === "green" ? t.debt.green : debtAge === "yellow" ? t.debt.yellow : t.debt.red}
              </Badge>
            )}
          </div>
        )}
        {onClick && <IconChevronRight size={20} className="text-text-muted" />}
      </div>
    </Card>
  );
}
