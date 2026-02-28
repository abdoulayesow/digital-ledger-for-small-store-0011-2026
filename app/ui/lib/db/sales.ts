import Dexie from "dexie";
import { db, enqueueSync } from "./index";
import type { Sale, SaleType } from "./schema";

/**
 * Create a sale in IndexedDB and enqueue for sync.
 * Append-only — no update/delete (matches paper notebook mental model).
 */
export async function createSale({
  retailerId,
  customerId,
  type,
  amount,
  note,
}: {
  retailerId: string;
  customerId?: string | null;
  type: SaleType;
  amount: number;
  note?: string | null;
}): Promise<Sale> {
  if (type === "credit" && !customerId) {
    throw new Error("Credit sales require a customerId");
  }

  const now = new Date();
  const sale: Sale = {
    id: crypto.randomUUID(),
    retailerId,
    customerId: customerId ?? null,
    type,
    amount: Math.round(amount),
    note: note?.trim() || null,
    createdAt: now,
    updatedAt: now,
    syncStatus: "pending",
    lastSyncedAt: null,
    clientId: null,
  };

  await db.sales.add(sale);
  await enqueueSync("sales", sale.id, "create", sale as unknown as Record<string, unknown>);

  return sale;
}

/**
 * Record a credit sale (credit given to customer).
 */
export async function recordCreditSale(
  retailerId: string,
  customerId: string,
  amount: number,
  note?: string | null
): Promise<Sale> {
  return createSale({ retailerId, customerId, type: "credit", amount, note });
}

/**
 * Record a payment (money received from customer).
 */
export async function recordPayment(
  retailerId: string,
  customerId: string,
  amount: number,
  note?: string | null
): Promise<Sale> {
  return createSale({ retailerId, customerId, type: "payment", amount, note });
}

/**
 * Get all sales for a customer, newest first.
 */
export async function getSalesByCustomer(
  retailerId: string,
  customerId: string
): Promise<Sale[]> {
  return db.sales
    .where("[retailerId+customerId]")
    .equals([retailerId, customerId])
    .reverse()
    .sortBy("createdAt");
}

/**
 * Get recent sales across all customers (for dashboard).
 */
export async function getRecentSales(
  retailerId: string,
  limit: number = 20
): Promise<Sale[]> {
  return db.sales
    .where("[retailerId+createdAt]")
    .between([retailerId, Dexie.minKey], [retailerId, Dexie.maxKey])
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Get a single sale by ID.
 */
export async function getSale(id: string): Promise<Sale | undefined> {
  return db.sales.get(id);
}
