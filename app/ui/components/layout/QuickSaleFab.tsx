"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCoin } from "@/components/icons";
import { useI18n } from "@/lib/hooks/use-i18n";

export function QuickSaleFab() {
  const pathname = usePathname();
  const { t } = useI18n();

  // Only show FAB on the dashboard
  if (pathname !== "/") return null;

  return (
    <Link
      href="/sales/quick"
      className={[
        "fixed right-4 z-30 flex items-center gap-2",
        "h-14 px-5 rounded-lg shadow-lg",
        "bg-brand text-surface-0 font-display font-bold text-base",
        "active:scale-[0.95] transition-transform duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
      ].join(" ")}
      style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom) + 1rem)" }}
    >
      <IconCoin size={22} />
      <span>{t.sales.quickSale}</span>
    </Link>
  );
}
