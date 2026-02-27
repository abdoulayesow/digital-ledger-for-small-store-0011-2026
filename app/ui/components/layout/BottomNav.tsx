"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconHome, IconUsers, IconBell, IconSettings } from "@/components/icons"
import { useI18n } from "@/lib/hooks/use-i18n"

interface NavTab {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  labelKey: "home" | "customers" | "reminders" | "settings"
  matchPrefix?: string
}

const TABS: NavTab[] = [
  { href: "/", icon: IconHome, labelKey: "home" },
  { href: "/customers", icon: IconUsers, labelKey: "customers", matchPrefix: "/customers" },
  { href: "/reminders", icon: IconBell, labelKey: "reminders", matchPrefix: "/reminders" },
  { href: "/settings", icon: IconSettings, labelKey: "settings", matchPrefix: "/settings" },
]

function isTabActive(pathname: string, tab: NavTab): boolean {
  if (pathname === tab.href) return true
  if (tab.matchPrefix) return pathname.startsWith(tab.matchPrefix + "/")
  return false
}

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-surface-3/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {TABS.map((tab) => {
          const active = isTabActive(pathname, tab)
          const Icon = tab.icon
          const label = t.nav[tab.labelKey]

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={[
                  "flex flex-col items-center justify-center gap-1 min-h-14 w-full",
                  "transition-colors duration-150",
                  active ? "text-brand" : "text-text-muted",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={24} />
                <span className="text-xs leading-none">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
