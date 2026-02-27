"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { Transaction } from "@/lib/db/schema";
import {
  getTransactionsByCustomer,
  getRecentTransactions,
  recordDebt,
  recordPayment,
} from "@/lib/db/transactions";

/**
 * Live-query transactions for a specific customer, newest first.
 */
export function useCustomerTransactions(
  retailerId: string | undefined,
  customerId: string | undefined
): Transaction[] | undefined {
  return useLiveQuery(
    () =>
      retailerId && customerId
        ? getTransactionsByCustomer(retailerId, customerId)
        : [],
    [retailerId, customerId]
  );
}

/**
 * Live-query recent transactions across all customers.
 */
export function useRecentTransactions(
  retailerId: string | undefined,
  limit: number = 20
): Transaction[] | undefined {
  return useLiveQuery(
    () => (retailerId ? getRecentTransactions(retailerId, limit) : []),
    [retailerId, limit]
  );
}

// Re-export mutations for convenience
export { recordDebt, recordPayment };
