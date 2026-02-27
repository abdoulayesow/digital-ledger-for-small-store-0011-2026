"use client"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="flex flex-col bg-surface-0 text-text-primary"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom) + 0.5rem)" }}>
        {children}
      </main>
    </div>
  )
}
