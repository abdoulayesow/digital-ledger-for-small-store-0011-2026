"use client"

import { useSyncState } from "@/lib/hooks/use-sync-state"
import { useI18n } from "@/lib/hooks/use-i18n"
import { IconSync } from "@/components/icons"

export function SyncStatusBadge() {
  const syncState = useSyncState()
  const { t } = useI18n()

  if (syncState === "idle") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs text-text-muted">
        <span
          className="block w-2 h-2 rounded-full bg-green-500 shrink-0"
          aria-hidden="true"
        />
        <span className="sr-only">{t.common.online}</span>
      </div>
    )
  }

  if (syncState === "syncing") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-2 text-xs text-brand">
        <IconSync size={14} className="animate-spin shrink-0" aria-hidden="true" />
        <span>{t.common.syncing}</span>
      </div>
    )
  }

  // offline
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-2 text-xs text-text-muted">
      <span
        className="block w-2 h-2 rounded-full bg-debt shrink-0"
        aria-hidden="true"
      />
      <span>{t.common.offline}</span>
    </div>
  )
}
