/** Client-side database types mirroring the Prisma schema for offline-first storage. */

export type SaleType = "cash" | "credit" | "payment";
export type SyncStatus = "pending" | "synced" | "conflict";
export type Language = "su" | "ff" | "man" | "fr";

export interface Customer {
  id: string;
  retailerId: string;
  name: string;
  phone: string | null;
  colorCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  clientId: string | null;
}

export interface Sale {
  id: string;
  retailerId: string;
  customerId: string | null;
  type: SaleType;
  amount: number; // GNF, integer
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  clientId: string | null;
}

export interface SaleItem {
  id: string;
  saleId: string;
  description: string;
  amount: number; // GNF
}

export interface SyncQueueEntry {
  id?: number; // Auto-incremented
  table: string;
  recordId: string;
  action: "create" | "update" | "delete";
  data: string; // JSON-serialized payload
  createdAt: Date;
  retryCount: number;
}
