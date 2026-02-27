"use client";

import { useSessionContext } from "@/lib/hooks/use-session";

/**
 * Get the authenticated retailer's ID.
 * Must be used inside <SessionProvider>.
 */
export function useRetailerId(): string {
  const session = useSessionContext();
  if (!session) {
    throw new Error("useRetailerId must be used within <SessionProvider>");
  }
  return session.retailerId;
}
