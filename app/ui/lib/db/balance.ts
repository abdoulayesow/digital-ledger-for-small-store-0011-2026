import { db } from "./index";
import type { Sale } from "./schema";

export interface CustomerBalance {
  totalCreditSales: number;
  totalPayments: number;
  balance: number; // positive = customer owes money
  saleCount: number;
  lastSaleDate: Date | null;
}

/**
 * Compute balance for a single customer from their sales.
 * Balance is always derived, never stored — eliminates consistency bugs.
 */
export async function getCustomerBalance(
  retailerId: string,
  customerId: string
): Promise<CustomerBalance> {
  const sales = await db.sales
    .where("[retailerId+customerId]")
    .equals([retailerId, customerId])
    .toArray();

  return computeBalance(sales);
}

/**
 * Compute balances for all customers in a single pass.
 * One query instead of N — efficient for dashboard views.
 */
export async function getAllBalances(
  retailerId: string
): Promise<Map<string, CustomerBalance>> {
  const sales = await db.sales
    .where("retailerId")
    .equals(retailerId)
    .toArray();

  const grouped = new Map<string, Sale[]>();
  for (const sale of sales) {
    if (!sale.customerId) continue; // Skip anonymous cash sales
    const list = grouped.get(sale.customerId);
    if (list) {
      list.push(sale);
    } else {
      grouped.set(sale.customerId, [sale]);
    }
  }

  const balances = new Map<string, CustomerBalance>();
  for (const [customerId, customerSales] of grouped) {
    balances.set(customerId, computeBalance(customerSales));
  }

  return balances;
}

/**
 * Sum of all positive customer balances (total money owed to retailer).
 */
export async function getTotalReceivables(retailerId: string): Promise<number> {
  const balances = await getAllBalances(retailerId);
  let total = 0;
  for (const b of balances.values()) {
    if (b.balance > 0) total += b.balance;
  }
  return total;
}

/**
 * Summary of today's activity: total credit sales given and payments received.
 */
export async function getDailySummary(
  retailerId: string,
  date?: Date
): Promise<{ totalCashSales: number; totalCreditSales: number; totalPayments: number; saleCount: number }> {
  const target = date ?? new Date();
  const startOfDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const sales = await db.sales
    .where("[retailerId+createdAt]")
    .between([retailerId, startOfDay], [retailerId, endOfDay], true, false)
    .toArray();

  let totalCashSales = 0;
  let totalCreditSales = 0;
  let totalPayments = 0;
  for (const s of sales) {
    if (s.type === "credit") totalCreditSales += s.amount;
    else if (s.type === "payment") totalPayments += s.amount;
    else totalCashSales += s.amount;
  }

  return { totalCashSales, totalCreditSales, totalPayments, saleCount: sales.length };
}

/** Internal: compute balance from a list of sales. */
function computeBalance(sales: Sale[]): CustomerBalance {
  let totalCreditSales = 0;
  let totalPayments = 0;
  let lastDate: Date | null = null;

  for (const s of sales) {
    if (s.type === "credit") totalCreditSales += s.amount;
    else if (s.type === "payment") totalPayments += s.amount;
    // cash sales don't affect customer balance

    if (!lastDate || s.createdAt > lastDate) {
      lastDate = s.createdAt;
    }
  }

  return {
    totalCreditSales,
    totalPayments,
    balance: totalCreditSales - totalPayments,
    saleCount: sales.length,
    lastSaleDate: lastDate,
  };
}
