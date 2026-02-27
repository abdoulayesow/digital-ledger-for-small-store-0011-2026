/** Sync engine configuration. */

/** Interval between automatic sync cycles (ms). */
export const SYNC_INTERVAL_MS = 30_000;

/** Maximum retry attempts before giving up on a sync entry. */
export const MAX_RETRIES = 10;

/** Base delay for exponential backoff (ms). */
export const BACKOFF_BASE_MS = 1_000;

/** Maximum backoff delay (ms). */
export const BACKOFF_MAX_MS = 5 * 60 * 1_000;

/** Number of sync queue entries to process per cycle. */
export const BATCH_SIZE = 20;

/** localStorage key for last pull timestamp. */
export const LAST_PULL_KEY = "deftar-last-pull";
