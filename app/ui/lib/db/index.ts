import Dexie, { type EntityTable } from "dexie";
import type {
  Customer,
  Sale,
  SaleItem,
  SyncQueueEntry,
} from "./schema";

class DeftarDB extends Dexie {
  customers!: EntityTable<Customer, "id">;
  sales!: EntityTable<Sale, "id">;
  saleItems!: EntityTable<SaleItem, "id">;
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

    // v2: Add new sales/saleItems tables and migrate data from old transactions tables.
    // Old tables must remain so the upgrade() callback can read from them.
    this.version(2)
      .stores({
        sales:
          "id, retailerId, customerId, type, createdAt, syncStatus, [retailerId+customerId], [retailerId+createdAt]",
        saleItems: "id, saleId",
      })
      .upgrade(async (tx) => {
        const oldTable = tx.table("transactions");
        const oldItems = tx.table("transactionItems");
        const newSales = tx.table("sales");
        const newItems = tx.table("saleItems");

        const allTxns = await oldTable.toArray();
        for (const txn of allTxns) {
          await newSales.add({
            ...txn,
            type: txn.type === "debt" ? "credit" : txn.type === "payment" ? "payment" : "cash",
          });
        }

        const allItems = await oldItems.toArray();
        for (const item of allItems) {
          await newItems.add({
            id: item.id,
            saleId: item.transactionId,
            description: item.description,
            amount: item.amount,
          });
        }
      });

    // v3: Remove old tables now that data has been migrated.
    this.version(3).stores({
      transactions: null,
      transactionItems: null,
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
  await db.syncQueue.where("id").equals(id).modify((entry) => {
    entry.retryCount += 1;
  });
}
