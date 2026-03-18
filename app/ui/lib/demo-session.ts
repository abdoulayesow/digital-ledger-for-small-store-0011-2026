import type { SessionInfo } from "@/lib/hooks/use-session";

const DEMO_STORAGE_KEY = "btiki-demo-mode";
export const DEMO_RETAILER_ID = "demo-retailer-001";

export function enterDemoMode(): void {
  localStorage.setItem(DEMO_STORAGE_KEY, "true");
}

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_STORAGE_KEY) === "true";
}

export function exitDemoMode(): void {
  localStorage.removeItem(DEMO_STORAGE_KEY);
}

export function getDemoSession(): SessionInfo {
  return {
    retailerId: DEMO_RETAILER_ID,
    phone: "+224620000000",
    language: "fr",
    shopName: "Boutique Mamadou",
  };
}
