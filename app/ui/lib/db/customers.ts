import { db, enqueueSync } from "./index";
import type { Customer } from "./schema";
import { getCustomerColor } from "@/lib/utils/color";

/**
 * Create a new customer in IndexedDB and enqueue for sync.
 */
export async function createCustomer({
  retailerId,
  name,
  phone,
}: {
  retailerId: string;
  name: string;
  phone?: string | null;
}): Promise<Customer> {
  const now = new Date();
  const customer: Customer = {
    id: crypto.randomUUID(),
    retailerId,
    name: name.trim(),
    phone: phone?.trim() || null,
    colorCode: getCustomerColor(name.trim()),
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: "pending",
    lastSyncedAt: null,
    clientId: null,
  };

  await db.customers.add(customer);
  await enqueueSync("customers", customer.id, "create", customer as unknown as Record<string, unknown>);

  return customer;
}

/**
 * List all active customers for a retailer, sorted by name.
 */
export async function listCustomers(retailerId: string): Promise<Customer[]> {
  return db.customers
    .where("[retailerId+deletedAt]")
    .equals([retailerId, 0])
    .sortBy("name")
    .then((results) => {
      // Compound index trick: Dexie indexes null as 0 for compound keys.
      // Fall back to a filter if compound index doesn't match.
      if (results.length > 0) return results;
      return db.customers
        .where("retailerId")
        .equals(retailerId)
        .filter((c) => c.deletedAt === null)
        .sortBy("name");
    });
}

/**
 * Search customers by name or phone (case-insensitive partial match).
 */
export async function searchCustomers(
  retailerId: string,
  query: string
): Promise<Customer[]> {
  const q = query.toLowerCase().trim();
  if (!q) return listCustomers(retailerId);

  return db.customers
    .where("retailerId")
    .equals(retailerId)
    .filter(
      (c) =>
        c.deletedAt === null &&
        (c.name.toLowerCase().includes(q) ||
          (c.phone?.includes(q) ?? false))
    )
    .sortBy("name");
}

/**
 * Get a single customer by ID.
 */
export async function getCustomer(id: string): Promise<Customer | undefined> {
  return db.customers.get(id);
}

/**
 * Update a customer's name and/or phone.
 */
export async function updateCustomer(
  id: string,
  updates: { name?: string; phone?: string | null }
): Promise<void> {
  const existing = await db.customers.get(id);
  if (!existing) return;

  const changes: Partial<Customer> = {
    updatedAt: new Date(),
    syncStatus: "pending",
  };

  if (updates.name !== undefined) {
    changes.name = updates.name.trim();
    changes.colorCode = getCustomerColor(updates.name.trim());
  }

  if (updates.phone !== undefined) {
    changes.phone = updates.phone?.trim() || null;
  }

  await db.customers.update(id, changes);

  const updated = await db.customers.get(id);
  await enqueueSync("customers", id, "update", updated as unknown as Record<string, unknown>);
}

/**
 * Soft-delete a customer (sets deletedAt).
 */
export async function deleteCustomer(id: string): Promise<void> {
  const now = new Date();

  await db.customers.update(id, {
    deletedAt: now,
    updatedAt: now,
    syncStatus: "pending",
  });

  const updated = await db.customers.get(id);
  await enqueueSync("customers", id, "delete", updated as unknown as Record<string, unknown>);
}
