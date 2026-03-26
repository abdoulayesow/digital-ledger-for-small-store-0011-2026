/**
 * Safe localStorage wrappers — gracefully handle private browsing,
 * quota exceeded, and environments where localStorage is unavailable.
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
}
