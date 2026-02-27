"use client"

import { useEffect, useState } from "react"
import { getSyncState, onSyncStateChange, SyncState } from "@/lib/sync/engine"

export function useSyncState(): SyncState {
  const [syncState, setSyncState] = useState<SyncState>(() => getSyncState())

  useEffect(() => {
    const unsubscribe = onSyncStateChange((state: SyncState) => {
      setSyncState(state)
    })
    return unsubscribe
  }, [])

  return syncState
}
