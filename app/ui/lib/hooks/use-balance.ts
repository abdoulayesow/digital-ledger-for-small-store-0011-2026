"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { CustomerBalance } from "@/lib/db/balance";
import {
  getCustomerBalance,
  getAllBalances,
  getTotalReceivables,
  getDailySummary,
} from "@/lib/db/balance";

/**
 * Live-query balance for a single customer.
 */
export function useCustomerBalance(
  retailerId: string | undefined,
  customerId: string | undefined
): CustomerBalance | undefined {
  return useLiveQuery(
    () =>
      retailerId && customerId
        ? getCustomerBalance(retailerId, customerId)
        : undefined,
    [retailerId, customerId]
  );
}

/**
 * Live-query balances for all customers (Map<customerId, CustomerBalance>).
 */
export function useAllBalances(
  retailerId: string | undefined
): Map<string, CustomerBalance> | undefined {
  return useLiveQuery(
    () => (retailerId ? getAllBalances(retailerId) : new Map()),
    [retailerId]
  );
}

/**
 * Live-query total receivables (sum of all positive balances).
 */
export function useTotalReceivables(
  retailerId: string | undefined
): number | undefined {
  return useLiveQuery(
    () => (retailerId ? getTotalReceivables(retailerId) : 0),
    [retailerId]
  );
}

/**
 * Live-query daily summary (credit sales given vs cash received today).
 */
export function useDailySummary(
  retailerId: string | undefined
): { totalCashSales: number; totalCreditSales: number; totalPayments: number; saleCount: number } | undefined {
  return useLiveQuery(
    () => (retailerId ? getDailySummary(retailerId) : undefined),
    [retailerId]
  );
}
