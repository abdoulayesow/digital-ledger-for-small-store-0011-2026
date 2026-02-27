"use client"

type BadgeVariant = "green" | "yellow" | "red" | "neutral"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-age-green/20 text-age-green",
  yellow: "bg-age-yellow/20 text-age-yellow",
  red: "bg-age-red/20 text-age-red",
  neutral: "bg-surface-3/50 text-text-muted",
}

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-full px-2 py-0.5",
        "text-xs font-semibold",
        "select-none whitespace-nowrap",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  )
}
