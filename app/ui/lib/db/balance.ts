import { db } from "./index";
import type { Transaction } from "./schema";

export interface CustomerBalance {
  totalDebt: number;
  totalPayments: number;
  balance: number; // positive = customer owes money
  transactionCount: number;
  lastTransactionDate: Date | null;
}

/**
 * Compute balance for a single customer from their transactions.
 * Balance is always derived, never stored — eliminates consistency bugs.
 */
export async function getCustomerBalance(
  retailerId: string,
  customerId: string
): Promise<CustomerBalance> {
  const txns = await db.transactions
    .where("[retailerId+customerId]")
    .equals([retailerId, customerId])
    .toArray();

  return computeBalance(txns);
}

/**
 * Compute balances for all customers in a single pass.
 * One query instead of N — efficient for dashboard views.
 */
export async function getAllBalances(
  retailerId: string
): Promise<Map<string, CustomerBalance>> {
  const txns = await db.transactions
    .where("retailerId")
    .equals(retailerId)
    .toArray();

  const grouped = new Map<string, Transaction[]>();
  for (const txn of txns) {
    const list = grouped.get(txn.customerId);
    if (list) {
      list.push(txn);
    } else {
      grouped.set(txn.customerId, [txn]);
    }
  }

  const balances = new Map<string, CustomerBalance>();
  for (const [customerId, customerTxns] of grouped) {
    balances.set(customerId, computeBalance(customerTxns));
  }

  return balances;
}

/**
 * Sum of all positive customer balances (total money owed to retailer).
 */
export async function getTotalReceivables(retailerId: string): Promise<number> {
  const balances = await getAllBalances(retailerId);
  let total = 0;
  for (const b of balances.values()) {
    if (b.balance > 0) total += b.balance;
  }
  return total;
}

/**
 * Summary of today's activity: total debts given and payments received.
 */
export async function getDailySummary(
  retailerId: string,
  date?: Date
): Promise<{ totalDebts: number; totalPayments: number; transactionCount: number }> {
  const target = date ?? new Date();
  const startOfDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const txns = await db.transactions
    .where("retailerId")
    .equals(retailerId)
    .filter((t) => t.createdAt >= startOfDay && t.createdAt < endOfDay)
    .toArray();

  let totalDebts = 0;
  let totalPayments = 0;
  for (const t of txns) {
    if (t.type === "debt") totalDebts += t.amount;
    else totalPayments += t.amount;
  }

  return { totalDebts, totalPayments, transactionCount: txns.length };
}

/** Internal: compute balance from a list of transactions. */
function computeBalance(txns: Transaction[]): CustomerBalance {
  let totalDebt = 0;
  let totalPayments = 0;
  let lastDate: Date | null = null;

  for (const t of txns) {
    if (t.type === "debt") totalDebt += t.amount;
    else totalPayments += t.amount;

    if (!lastDate || t.createdAt > lastDate) {
      lastDate = t.createdAt;
    }
  }

  return {
    totalDebt,
    totalPayments,
    balance: totalDebt - totalPayments,
    transactionCount: txns.length,
    lastTransactionDate: lastDate,
  };
}
