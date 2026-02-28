/**
 * Generate a deterministic color code for a customer based on their name.
 * Produces high-contrast pastel colors suitable for dark backgrounds.
 */
const AVATAR_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#14B8A6", // teal
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#F43F5E", // rose
  "#06B6D4", // cyan
] as const;

export function getCustomerColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Get the first letter of a name for avatar display.
 */
export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

/** Debt age color coding per product spec. */
export type DebtAge = "green" | "yellow" | "red";

export function getDebtAge(lastSaleDate: Date): DebtAge {
  const days = Math.floor(
    (Date.now() - lastSaleDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days < 7) return "green";
  if (days < 14) return "yellow";
  return "red";
}

const DEBT_AGE_COLORS: Record<DebtAge, string> = {
  green: "#22C55E",
  yellow: "#EAB308",
  red: "#EF4444",
};

export function getDebtAgeColor(age: DebtAge): string {
  return DEBT_AGE_COLORS[age];
}
