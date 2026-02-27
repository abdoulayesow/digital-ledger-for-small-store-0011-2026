"use client"

import { formatGNF } from "@/lib/utils"

type AmountType = "debt" | "payment" | "neutral"
type AmountSize = "sm" | "md" | "lg"

interface AmountDisplayProps {
  amount: number
  type?: AmountType
  size?: AmountSize
  className?: string
}

const typeClasses: Record<AmountType, string> = {
  debt: "text-debt",
  payment: "text-payment",
  neutral: "text-text-primary",
}

const sizeClasses: Record<AmountSize, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-2xl font-display font-bold",
}

export function AmountDisplay({
  amount,
  type = "neutral",
  size = "md",
  className = "",
}: AmountDisplayProps) {
  return (
    <span
      className={[
        "tabular-nums leading-none",
        typeClasses[type],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {formatGNF(amount)}
    </span>
  )
}
