/** App-wide constants. Sync-specific constants stay in lib/sync/constants.ts. */

/** Quick-amount presets in GNF, displayed on sale entry screens. */
export const AMOUNT_PRESETS = [500, 1000, 2000, 5000, 10000, 25000] as const;

/** Delay (ms) before auto-redirecting after a successful sale. */
export const SUCCESS_REDIRECT_DELAY_MS = 1200;

/** Seconds the undo bar stays visible after recording a sale. */
export const UNDO_DURATION_SECONDS = 5;

/** How long (ms) before session is considered stale and re-fetched. */
export const SESSION_REVALIDATION_MS = 15 * 60 * 1000;

/** Maximum characters allowed in a sale note. */
export const NOTE_MAX_LENGTH = 200;

/** Debt age thresholds (days) for color coding. */
export const DEBT_AGE_GREEN_DAYS = 7;
export const DEBT_AGE_YELLOW_DAYS = 14;

/** PIN auth configuration. */
export const PIN_LENGTH = 4;
export const PIN_MAX_ATTEMPTS = 5;
export const PIN_LOCKOUT_MINUTES = 15;
export const PIN_DEV_CODE = "1234";

/** Session duration in days. */
export const SESSION_DURATION_DAYS = 30;
