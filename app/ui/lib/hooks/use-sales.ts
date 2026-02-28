"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { Sale } from "@/lib/db/schema";
import {
  getSalesByCustomer,
  getRecentSales,
  recordCreditSale,
  recordPayment,
} from "@/lib/db/sales";

/**
 * Live-query sales for a specific customer, newest first.
 */
export function useCustomerSales(
  retailerId: string | undefined,
  customerId: string | undefined
): Sale[] | undefined {
  return useLiveQuery(
    () =>
      retailerId && customerId
        ? getSalesByCustomer(retailerId, customerId)
        : [],
    [retailerId, customerId]
  );
}

/**
 * Live-query recent sales across all customers.
 */
export function useRecentSales(
  retailerId: string | undefined,
  limit: number = 20
): Sale[] | undefined {
  return useLiveQuery(
    () => (retailerId ? getRecentSales(retailerId, limit) : []),
    [retailerId, limit]
  );
}

// Re-export mutations for convenience
export { recordCreditSale, recordPayment };
