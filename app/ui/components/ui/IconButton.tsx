"use client"

import { ButtonHTMLAttributes } from "react"

type IconButtonVariant = "default" | "brand" | "danger"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  variant?: IconButtonVariant
  className?: string
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    "bg-surface-2 text-text-secondary hover:bg-surface-3 active:bg-surface-3/70",
  brand:
    "bg-brand/10 text-brand hover:bg-brand/20 active:bg-brand/30",
  danger:
    "bg-debt/10 text-debt hover:bg-debt/20 active:bg-debt/30",
}

export function IconButton({
  icon,
  label,
  variant = "default",
  className = "",
  onClick,
  disabled,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        "inline-flex items-center justify-center",
        "min-h-12 min-w-12 rounded-full",
        "transition-colors duration-150",
        "cursor-pointer select-none",
        "disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon}
    </button>
  )
}
