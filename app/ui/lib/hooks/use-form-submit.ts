import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Deduplicates the common form submission pattern:
 * submitting guard ref + saving state + error state + try/catch/finally.
 *
 * Returns a stable `submit` function that never changes identity.
 */
export function useFormSubmit<T>(
  fn: () => Promise<T>,
  opts?: { onError?: (err: unknown) => string }
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  const fnRef = useRef(fn);
  const optsRef = useRef(opts);
  useEffect(() => { fnRef.current = fn; }, [fn]);
  useEffect(() => { optsRef.current = opts; }, [opts]);

  const submit = useCallback(async () => {
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      const result = await fnRef.current();
      return result;
    } catch (err) {
      console.error("[useFormSubmit]", err);
      const message = optsRef.current?.onError?.(err) ?? "An error occurred";
      setError(message);
      return undefined;
    } finally {
      setSaving(false);
      submitting.current = false;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { submit, saving, error, clearError } as const;
}
