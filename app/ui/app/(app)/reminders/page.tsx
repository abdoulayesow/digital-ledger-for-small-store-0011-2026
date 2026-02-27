"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useCustomers } from "@/lib/hooks/use-customers";
import { useAllBalances } from "@/lib/hooks/use-balance";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconBell, IconWhatsApp } from "@/components/icons";
import { getDebtAge } from "@/lib/utils";
import type { Customer } from "@/lib/db/schema";
import type { CustomerBalance } from "@/lib/db/balance";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

interface OverdueCustomer {
  customer: Customer;
  balance: CustomerBalance;
  age: "green" | "yellow" | "red";
}

export default function RemindersPage() {
  const { t } = useI18n();
  const retailerId = useRetailerId();
  const customers = useCustomers(retailerId);
  const balances = useAllBalances(retailerId);

  // Build list of customers with outstanding debts
  const overdueCustomers = useMemo<OverdueCustomer[]>(() => {
    if (!customers || !balances) return [];
    const result: OverdueCustomer[] = [];
    for (const customer of customers) {
      const bal = balances.get(customer.id);
      if (bal && bal.balance > 0 && bal.lastTransactionDate) {
        const age = getDebtAge(bal.lastTransactionDate);
        result.push({ customer, balance: bal, age });
      }
    }
    // Sort: red first, then yellow, then green
    const agePriority = { red: 0, yellow: 1, green: 2 };
    result.sort((a, b) => agePriority[a.age] - agePriority[b.age]);
    return result;
  }, [customers, balances]);

  return (
    <div className="flex flex-col">
      <PageHeader title={t.nav.reminders} />

      <div className="px-4 pb-4">
        <h2
          className="text-sm font-semibold text-text-secondary mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.reminders.overdueDebts}
        </h2>

        {overdueCustomers.length === 0 ? (
          <EmptyState
            icon={<IconBell />}
            title={t.reminders.noOverdue}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {overdueCustomers.map(({ customer, balance, age }) => (
              <li key={customer.id}>
                <Card className="flex items-center gap-3">
                  <Avatar name={customer.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-primary truncate">{customer.name}</p>
                      <Badge variant={age}>
                        {age === "green"
                          ? t.debt.green
                          : age === "yellow"
                            ? t.debt.yellow
                            : t.debt.red}
                      </Badge>
                    </div>
                    <AmountDisplay amount={balance.balance} type="debt" size="sm" />
                  </div>
                  {customer.phone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Opens WhatsApp with pre-filled message (server-side tracking TBD)
                        const msg = encodeURIComponent(
                          t.reminders.whatsappMessage.replace("{name}", customer.name)
                        );
                        window.open(`https://wa.me/${customer.phone?.replace(/\D/g, "")}?text=${msg}`, "_blank");
                      }}
                    >
                      <IconWhatsApp size={20} />
                    </Button>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
