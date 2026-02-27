"use client"

import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/hooks/use-i18n"
import { IconArrowLeft } from "@/components/icons"

interface PageHeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function PageHeader({ title, showBack = false, rightAction }: PageHeaderProps) {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <header className="flex items-center min-h-14 px-4 gap-3 bg-surface-0">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center min-h-12 min-w-12 -ml-2 text-text-primary"
          aria-label={t.common.back}
        >
          <IconArrowLeft size={24} />
        </button>
      )}

      <h1
        className="flex-1 font-bold text-lg text-text-primary truncate"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>

      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  )
}
