import Dexie from "dexie";
import { db, enqueueSync } from "./index";
import type { Transaction, TransactionType } from "./schema";

/**
 * Create a transaction in IndexedDB and enqueue for sync.
 * Append-only — no update/delete (matches paper notebook mental model).
 */
export async function createTransaction({
  retailerId,
  customerId,
  type,
  amount,
  note,
}: {
  retailerId: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  note?: string | null;
}): Promise<Transaction> {
  const now = new Date();
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    retailerId,
    customerId,
    type,
    amount: Math.round(amount),
    note: note?.trim() || null,
    createdAt: now,
    updatedAt: now,
    syncStatus: "pending",
    lastSyncedAt: null,
    clientId: null,
  };

  await db.transactions.add(transaction);
  await enqueueSync("transactions", transaction.id, "create", transaction as unknown as Record<string, unknown>);

  return transaction;
}

/**
 * Record a debt (credit given to customer).
 */
export async function recordDebt(
  retailerId: string,
  customerId: string,
  amount: number,
  note?: string | null
): Promise<Transaction> {
  return createTransaction({ retailerId, customerId, type: "debt", amount, note });
}

/**
 * Record a payment (money received from customer).
 */
export async function recordPayment(
  retailerId: string,
  customerId: string,
  amount: number,
  note?: string | null
): Promise<Transaction> {
  return createTransaction({ retailerId, customerId, type: "payment", amount, note });
}

/**
 * Get all transactions for a customer, newest first.
 */
export async function getTransactionsByCustomer(
  retailerId: string,
  customerId: string
): Promise<Transaction[]> {
  return db.transactions
    .where("[retailerId+customerId]")
    .equals([retailerId, customerId])
    .reverse()
    .sortBy("createdAt");
}

/**
 * Get recent transactions across all customers (for dashboard).
 */
export async function getRecentTransactions(
  retailerId: string,
  limit: number = 20
): Promise<Transaction[]> {
  return db.transactions
    .where("[retailerId+createdAt]")
    .between([retailerId, Dexie.minKey], [retailerId, Dexie.maxKey])
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Get a single transaction by ID.
 */
export async function getTransaction(id: string): Promise<Transaction | undefined> {
  return db.transactions.get(id);
}
