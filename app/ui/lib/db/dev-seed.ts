import { db } from "./index";
import { DEMO_RETAILER_ID } from "@/lib/demo-session";
import type { Customer, Sale, SaleType } from "./schema";

const DEMO_CUSTOMERS: Pick<Customer, "name" | "phone">[] = [
  { name: "Fatoumata Diallo", phone: "+224621000001" },
  { name: "Ibrahima Barry", phone: "+224621000002" },
  { name: "Mariama Camara", phone: "+224621000003" },
  { name: "Mamadou Bah", phone: "+224621000004" },
  { name: "Aissatou Sow", phone: "+224621000005" },
  { name: "Ousmane Sylla", phone: null },
  { name: "Kadiatou Diallo", phone: "+224621000007" },
];

/**
 * Seed demo data into IndexedDB. Idempotent — skips if demo data exists.
 * Does NOT enqueue sync entries (demo data never leaves the device).
 */
export async function seedDemoData(): Promise<void> {
  const existing = await db.customers
    .where("retailerId")
    .equals(DEMO_RETAILER_ID)
    .count();
  if (existing > 0) return;

  const now = Date.now();
  const DAY = 86_400_000;

  // Create customers
  const customers: Customer[] = DEMO_CUSTOMERS.map((c, i) => ({
    id: `demo-customer-${String(i + 1).padStart(3, "0")}`,
    retailerId: DEMO_RETAILER_ID,
    name: c.name,
    phone: c.phone,
    colorCode: "",
    createdAt: new Date(now - 30 * DAY),
    updatedAt: new Date(now - 30 * DAY),
    deletedAt: null,
    syncStatus: "synced" as const,
    lastSyncedAt: null,
    clientId: null,
  }));

  // Generate ~50 sales across past 14 days
  const sales: Sale[] = [];
  const types: SaleType[] = ["cash", "cash", "cash", "credit", "credit", "payment"];
  let saleIndex = 0;

  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const salesPerDay = 3 + Math.floor(pseudoRandom(dayOffset) * 4); // 3-6 sales/day
    for (let j = 0; j < salesPerDay; j++) {
      const type = types[saleIndex % types.length];
      const amounts = [500, 1000, 2000, 5000, 10000, 25000];
      const amount = amounts[Math.floor(pseudoRandom(saleIndex * 7 + dayOffset) * amounts.length)];
      const needsCustomer = type === "credit" || type === "payment";
      const customerIdx = Math.floor(pseudoRandom(saleIndex * 3) * customers.length);

      sales.push({
        id: `demo-sale-${String(saleIndex + 1).padStart(4, "0")}`,
        retailerId: DEMO_RETAILER_ID,
        customerId: needsCustomer ? customers[customerIdx].id : (pseudoRandom(saleIndex) > 0.5 ? customers[customerIdx].id : null),
        type,
        amount,
        note: null,
        createdAt: new Date(now - dayOffset * DAY + j * 3_600_000),
        updatedAt: new Date(now - dayOffset * DAY + j * 3_600_000),
        deletedAt: null,
        syncStatus: "synced",
        lastSyncedAt: null,
        clientId: null,
      });

      saleIndex++;
    }
  }

  await db.transaction("rw", db.customers, db.sales, async () => {
    await db.customers.bulkAdd(customers);
    await db.sales.bulkAdd(sales);
  });
}

/**
 * Remove all demo data from IndexedDB.
 */
export async function clearDemoData(): Promise<void> {
  await db.transaction("rw", db.customers, db.sales, async () => {
    await db.sales.where("retailerId").equals(DEMO_RETAILER_ID).delete();
    await db.customers.where("retailerId").equals(DEMO_RETAILER_ID).delete();
  });
}

/** Simple deterministic pseudo-random for reproducible seed data. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
