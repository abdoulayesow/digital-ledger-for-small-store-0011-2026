"use client";

import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useCustomer } from "@/lib/hooks/use-customers";
import { useCustomerBalance } from "@/lib/hooks/use-balance";
import { useCustomerSales } from "@/lib/hooks/use-sales";
import { PageHeader } from "@/components/layout/PageHeader";
import { SyncStatusBadge } from "@/components/layout/SyncStatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { BalanceSummary } from "@/components/customer/BalanceSummary";
import { SaleList } from "@/components/sale/SaleList";
import { IconDebt, IconPayment } from "@/components/icons";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function CustomerDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const retailerId = useRetailerId();

  const customer = useCustomer(customerId);
  const balance = useCustomerBalance(retailerId, customerId);
  const sales = useCustomerSales(retailerId, customerId);

  if (!customer) {
    return (
      <div className="flex flex-col">
        <PageHeader title={t.common.loading} showBack />
        <div className="px-4 py-12 text-center text-text-muted text-sm">
          {t.common.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title={customer.name}
        showBack
        rightAction={<SyncStatusBadge />}
      />

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Customer header */}
        <div className="flex items-center gap-3 py-2">
          <Avatar name={customer.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-text-primary truncate">{customer.name}</p>
            {customer.phone && (
              <p className="text-sm text-text-secondary">{customer.phone}</p>
            )}
          </div>
        </div>

        {/* Balance summary */}
        {balance && <BalanceSummary balance={balance} />}

        {/* Action buttons — 2-tap entry points */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="debt"
            size="lg"
            onClick={() => router.push(`/customers/${customerId}/credit-sale`)}
            className="flex-col gap-1 py-4"
          >
            <IconDebt size={24} />
            <span>{t.sales.addCreditSale}</span>
          </Button>
          <Button
            variant="payment"
            size="lg"
            onClick={() => router.push(`/customers/${customerId}/payment`)}
            className="flex-col gap-1 py-4"
          >
            <IconPayment size={24} />
            <span>{t.sales.addPayment}</span>
          </Button>
        </div>

        {/* Sale history */}
        <div>
          <h2
            className="text-sm font-semibold text-text-secondary mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.customers.saleHistory}
          </h2>
          <SaleList sales={sales ?? []} />
        </div>
      </div>
    </div>
  );
}
