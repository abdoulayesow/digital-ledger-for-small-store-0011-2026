"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { UndoSaleProvider } from "@/lib/hooks/use-undo-sale";
import { UndoBar } from "@/components/sale/UndoBar";
import { QuickSaleFab } from "@/components/layout/QuickSaleFab";
import { InstallBanner } from "@/components/pwa/InstallBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UndoSaleProvider>
        <AppShell>
          <AppHeader />
          <UndoBar />
          {children}
          <QuickSaleFab />
          <InstallBanner />
          <BottomNav />
        </AppShell>
      </UndoSaleProvider>
    </SessionProvider>
  );
}
