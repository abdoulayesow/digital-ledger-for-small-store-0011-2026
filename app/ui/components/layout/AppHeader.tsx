"use client";

import { LogoMark } from "@/components/brand/LogoMark";
import { Avatar } from "@/components/ui/Avatar";
import { SyncStatusBadge } from "@/components/layout/SyncStatusBadge";
import { useSessionContext } from "@/lib/hooks/use-session";

export function AppHeader() {
  const session = useSessionContext();
  const shopName = session?.shopName ?? "B'tiki";

  return (
    <header
      className="sticky top-0 z-20 flex items-center h-[4.5rem] px-5 gap-4 border-b border-surface-3/20"
      style={{
        background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
      }}
    >
      {/* Left: logo */}
      <LogoMark size={38} />

      {/* Center: shop name */}
      <h1 className="flex-1 font-display font-black text-3xl text-brand text-center tracking-wide">
        B&apos;TIKI
      </h1>

      {/* Right: sync + avatar */}
      <div className="flex items-center gap-3">
        <SyncStatusBadge />
        <Avatar name={shopName} size="md" />
      </div>
    </header>
  );
}
