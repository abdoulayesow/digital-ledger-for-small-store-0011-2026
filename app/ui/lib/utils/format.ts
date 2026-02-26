/**
 * Format an amount in GNF (Guinean Franc).
 * GNF has no decimal subdivision — always display as integer.
 */
const gnfFormatter = new Intl.NumberFormat("fr-GN", {
  style: "currency",
  currency: "GNF",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatGNF(amount: number): string {
  return gnfFormatter.format(amount);
}

/**
 * Format a number without currency symbol (for input display).
 */
const numberFormatter = new Intl.NumberFormat("fr-GN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatNumber(amount: number): string {
  return numberFormatter.format(amount);
}
