"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useCustomers, useCustomerSearch } from "@/lib/hooks/use-customers";
import { useAllBalances } from "@/lib/hooks/use-balance";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { IconButton } from "@/components/ui/IconButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconPlus, IconUsers } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function CustomersPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const retailerId = useRetailerId();

  const allCustomers = useCustomers(retailerId);
  const searchResults = useCustomerSearch(retailerId, query);
  const balances = useAllBalances(retailerId);

  const customers = query.length > 0 ? searchResults : allCustomers;

  return (
    <div className="flex flex-col">
      <PageHeader
        title={t.nav.customers}
        rightAction={
          <IconButton
            icon={<IconPlus />}
            label={t.customers.addCustomer}
            variant="brand"
            onClick={() => router.push("/customers/new")}
          />
        }
      />

      <div className="px-4 pb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t.common.search + "…"}
          clearLabel={t.common.clear}
          className="mb-3"
        />
      </div>

      {customers === undefined ? (
        <div className="px-4 py-12 text-center text-text-muted text-sm">
          {t.common.loading}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title={query ? t.common.noData : t.customers.noCustomers}
          description={undefined}
          action={
            !query ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/customers/new")}
              >
                <IconPlus size={18} />
                {t.customers.addCustomer}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-2 px-4">
          {customers.map((customer) => (
            <li key={customer.id}>
              <CustomerCard
                customer={customer}
                balance={balances?.get(customer.id)}
                onClick={() => router.push(`/customers/${customer.id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
