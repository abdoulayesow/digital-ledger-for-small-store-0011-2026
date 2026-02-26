import Dexie, { type EntityTable } from "dexie";
import type {
  Customer,
  Transaction,
  TransactionItem,
  SyncQueueEntry,
} from "./schema";

class DeftarDB extends Dexie {
  customers!: EntityTable<Customer, "id">;
  transactions!: EntityTable<Transaction, "id">;
  transactionItems!: EntityTable<TransactionItem, "id">;
  syncQueue!: EntityTable<SyncQueueEntry, "id">;

  constructor() {
    super("deftar");

    this.version(1).stores({
      customers:
        "id, retailerId, name, phone, syncStatus, deletedAt, [retailerId+deletedAt]",
      transactions:
        "id, retailerId, customerId, type, createdAt, syncStatus, [retailerId+customerId], [retailerId+createdAt]",
      transactionItems: "id, transactionId",
      syncQueue: "++id, table, recordId, createdAt",
    });
  }
}

export const db = new DeftarDB();

/**
 * Enqueue a change for background sync to the server.
 */
export async function enqueueSync(
  table: string,
  recordId: string,
  action: "create" | "update" | "delete",
  data: Record<string, unknown>
): Promise<void> {
  await db.syncQueue.add({
    table,
    recordId,
    action,
    data: JSON.stringify(data),
    createdAt: new Date(),
    retryCount: 0,
  });
}

/**
 * Get all pending sync entries, oldest first.
 */
export async function getPendingSyncEntries(): Promise<SyncQueueEntry[]> {
  return db.syncQueue.orderBy("createdAt").toArray();
}

/**
 * Remove a sync entry after successful server sync.
 */
export async function removeSyncEntry(id: number): Promise<void> {
  await db.syncQueue.delete(id);
}

/**
 * Increment retry count for a failed sync entry.
 */
export async function incrementRetryCount(id: number): Promise<void> {
  await db.syncQueue.update(id, {
    retryCount: (await db.syncQueue.get(id))!.retryCount + 1,
  });
}
