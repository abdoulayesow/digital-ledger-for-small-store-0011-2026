import { db, getPendingSyncEntries, removeSyncEntry, incrementRetryCount } from "@/lib/db/index";
import type { SyncQueueEntry } from "@/lib/db/schema";
import type { Customer, Sale } from "@/lib/db/schema";
import {
  SYNC_INTERVAL_MS,
  MAX_RETRIES,
  BACKOFF_BASE_MS,
  BACKOFF_MAX_MS,
  BATCH_SIZE,
  LAST_PULL_KEY,
} from "./constants";

class UnknownTableError extends Error {
  constructor(table: string) {
    super(`Unknown sync table: ${table}`);
    this.name = "UnknownTableError";
  }
}

export type SyncState = "idle" | "syncing" | "offline";

type SyncStateListener = (state: SyncState) => void;

let intervalId: ReturnType<typeof setInterval> | null = null;
let currentState: SyncState = "idle";
const listeners = new Set<SyncStateListener>();

function setState(state: SyncState) {
  currentState = state;
  for (const listener of listeners) {
    listener(state);
  }
}

/**
 * Subscribe to sync state changes.
 * Returns an unsubscribe function.
 */
export function onSyncStateChange(listener: SyncStateListener): () => void {
  listeners.add(listener);
  // Immediately notify with current state
  listener(currentState);
  return () => listeners.delete(listener);
}

/**
 * Get the current sync state.
 */
export function getSyncState(): SyncState {
  return currentState;
}

/**
 * Start the background sync timer.
 * Automatically syncs on interval and when coming back online.
 */
export function startSync(): void {
  if (intervalId !== null) return; // Already running

  intervalId = setInterval(runSyncCycle, SYNC_INTERVAL_MS);

  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnline);
  }

  // Run an initial sync
  runSyncCycle();
}

/**
 * Stop the background sync timer.
 */
export function stopSync(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (typeof window !== "undefined") {
    window.removeEventListener("online", handleOnline);
  }

  setState("idle");
}

/**
 * Manually trigger a sync cycle (e.g., pull-to-refresh).
 */
export async function triggerSync(): Promise<void> {
  await runSyncCycle();
}

function handleOnline() {
  // When coming back online, trigger an immediate sync
  runSyncCycle();
}

let syncing = false;

/**
 * Core sync cycle: push local changes → pull server changes.
 */
async function runSyncCycle(): Promise<void> {
  if (syncing) return;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    setState("offline");
    return;
  }

  syncing = true;
  setState("syncing");

  try {
    await pushChanges();
    await pullChanges();
  } catch {
    // Network failures are expected when offline
  } finally {
    syncing = false;
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    setState("offline");
  } else {
    setState("idle");
  }
}

/**
 * Push: send pending sync queue entries to the server one by one.
 */
async function pushChanges(): Promise<void> {
  const entries = await getPendingSyncEntries();
  const batch = entries.slice(0, BATCH_SIZE);

  for (const entry of batch) {
    if (entry.retryCount >= MAX_RETRIES) {
      // Give up on this entry
      await removeSyncEntry(entry.id!);
      continue;
    }

    try {
      await pushEntry(entry);
      await removeSyncEntry(entry.id!);

      // Mark the local record as synced
      await markSynced(entry.table, entry.recordId);
    } catch (err) {
      if (err instanceof UnknownTableError) {
        // Don't remove or retry — leave unknown entries in the queue
        continue;
      }
      await incrementRetryCount(entry.id!);
      // Exponential backoff: skip remaining entries after a failure
      const delay = Math.min(
        BACKOFF_BASE_MS * Math.pow(2, entry.retryCount),
        BACKOFF_MAX_MS
      );
      await sleep(delay);
      break;
    }
  }
}

/**
 * Push a single sync entry to the appropriate server endpoint.
 */
async function pushEntry(entry: SyncQueueEntry): Promise<void> {
  const data = JSON.parse(entry.data);
  let url: string;

  if (entry.table === "customers") {
    url = "/api/sync/customers";
  } else if (entry.table === "sales") {
    url = "/api/sync/sales";
  } else {
    console.warn(`[sync] Unknown table "${entry.table}", skipping entry ${entry.id}`);
    throw new UnknownTableError(entry.table);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: entry.action, record: data }),
  });

  if (!response.ok) {
    throw new Error(`Sync push failed: ${response.status}`);
  }
}

/**
 * Mark a local record as synced after successful push.
 */
async function markSynced(table: string, recordId: string): Promise<void> {
  const now = new Date();
  if (table === "customers") {
    await db.customers.update(recordId, {
      syncStatus: "synced",
      lastSyncedAt: now,
    });
  } else if (table === "sales") {
    await db.sales.update(recordId, {
      syncStatus: "synced",
      lastSyncedAt: now,
    });
  }
}

/**
 * Pull: fetch server changes since last pull and apply with last-write-wins.
 */
async function pullChanges(): Promise<void> {
  let hasMore = true;

  while (hasMore) {
    const lastPull = localStorage.getItem(LAST_PULL_KEY) ?? new Date(0).toISOString();

    const response = await fetch(`/api/sync/pull?since=${encodeURIComponent(lastPull)}`);
    if (!response.ok) return;

    const result = (await response.json()) as {
      customers: Customer[];
      sales: Sale[];
      serverTime: string;
      hasMore?: boolean;
    };

    // Apply in a single Dexie transaction for atomicity
    await db.transaction("rw", [db.customers, db.sales], async () => {
      for (const serverCustomer of result.customers) {
        await applyCustomer(serverCustomer);
      }
      for (const serverSale of result.sales) {
        await applySale(serverSale);
      }
    });

    localStorage.setItem(LAST_PULL_KEY, result.serverTime);
    hasMore = result.hasMore === true;
  }
}

/**
 * Apply a server customer with last-write-wins.
 * Unsynced local edits (syncStatus="pending") are preserved.
 */
async function applyCustomer(server: Customer): Promise<void> {
  const local = await db.customers.get(server.id);

  if (!local) {
    // New record from server
    await db.customers.put({
      ...server,
      createdAt: new Date(server.createdAt),
      updatedAt: new Date(server.updatedAt),
      deletedAt: server.deletedAt ? new Date(server.deletedAt) : null,
      lastSyncedAt: server.lastSyncedAt ? new Date(server.lastSyncedAt) : null,
      syncStatus: "synced",
    });
    return;
  }

  // Don't overwrite unsynced local changes
  if (local.syncStatus === "pending") return;

  // Last-write-wins: server record is newer
  const serverUpdated = new Date(server.updatedAt).getTime();
  const localUpdated = local.updatedAt.getTime();

  if (serverUpdated > localUpdated) {
    await db.customers.put({
      ...server,
      createdAt: new Date(server.createdAt),
      updatedAt: new Date(server.updatedAt),
      deletedAt: server.deletedAt ? new Date(server.deletedAt) : null,
      lastSyncedAt: server.lastSyncedAt ? new Date(server.lastSyncedAt) : null,
      syncStatus: "synced",
    });
  }
}

/**
 * Apply a server sale with last-write-wins.
 */
async function applySale(server: Sale): Promise<void> {
  const local = await db.sales.get(server.id);

  if (!local) {
    await db.sales.put({
      ...server,
      createdAt: new Date(server.createdAt),
      updatedAt: new Date(server.updatedAt),
      lastSyncedAt: server.lastSyncedAt ? new Date(server.lastSyncedAt) : null,
      syncStatus: "synced",
    });
    return;
  }

  if (local.syncStatus === "pending") return;

  const serverUpdated = new Date(server.updatedAt).getTime();
  const localUpdated = local.updatedAt.getTime();

  if (serverUpdated > localUpdated) {
    await db.sales.put({
      ...server,
      createdAt: new Date(server.createdAt),
      updatedAt: new Date(server.updatedAt),
      lastSyncedAt: server.lastSyncedAt ? new Date(server.lastSyncedAt) : null,
      syncStatus: "synced",
    });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
