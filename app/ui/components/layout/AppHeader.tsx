"use client";

import { LogoMark } from "@/components/brand/LogoMark";
import { Avatar } from "@/components/ui/Avatar";
import { SyncStatusBadge } from "@/components/layout/SyncStatusBadge";
import { useSessionContext } from "@/lib/hooks/use-session";

export function AppHeader() {
  const session = useSessionContext();
  const shopName = session?.shopName ?? "Déftar";

  return (
    <header className="sticky top-0 z-20 flex items-center min-h-14 px-4 gap-3 bg-surface-0/95 backdrop-blur-sm border-b border-surface-3/30">
      {/* Left: logo */}
      <LogoMark size={28} />

      {/* Center: app name */}
      <h1 className="flex-1 font-display font-bold text-lg text-text-primary truncate">
        Déftar
      </h1>

      {/* Right: sync + avatar */}
      <div className="flex items-center gap-1">
        <SyncStatusBadge />
        <Avatar name={shopName} size="sm" />
      </div>
    </header>
  );
}
