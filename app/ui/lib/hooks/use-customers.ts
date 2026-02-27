"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/index";
import type { Customer } from "@/lib/db/schema";
import {
  createCustomer,
  listCustomers,
  searchCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/db/customers";

/**
 * Live-query all active customers for a retailer, sorted by name.
 * Returns undefined while loading.
 */
export function useCustomers(retailerId: string | undefined): Customer[] | undefined {
  return useLiveQuery(
    () => (retailerId ? listCustomers(retailerId) : []),
    [retailerId]
  );
}

/**
 * Live-query customers matching a search term.
 */
export function useCustomerSearch(
  retailerId: string | undefined,
  query: string
): Customer[] | undefined {
  return useLiveQuery(
    () => (retailerId ? searchCustomers(retailerId, query) : []),
    [retailerId, query]
  );
}

/**
 * Live-query a single customer by ID.
 */
export function useCustomer(id: string | undefined): Customer | undefined {
  return useLiveQuery(
    () => (id ? getCustomer(id) : undefined),
    [id]
  );
}

// Re-export mutations for convenience
export { createCustomer, updateCustomer, deleteCustomer };

// Re-export db for direct access if needed
export { db };
