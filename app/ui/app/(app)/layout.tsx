"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { UndoSaleProvider } from "@/lib/hooks/use-undo-sale";
import { UndoBar } from "@/components/sale/UndoBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UndoSaleProvider>
        <AppShell>
          <UndoBar />
          {children}
          <BottomNav />
        </AppShell>
      </UndoSaleProvider>
    </SessionProvider>
  );
}
