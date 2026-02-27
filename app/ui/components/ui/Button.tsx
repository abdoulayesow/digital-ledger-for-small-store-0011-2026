"use client"

import { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "debt" | "payment"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-surface-0 hover:bg-brand-light active:bg-brand-dark border-transparent",
  secondary:
    "bg-surface-2 text-text-primary hover:bg-surface-3 active:bg-surface-3/80 border-transparent",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-2 active:bg-surface-3 border-transparent",
  danger:
    "bg-debt text-white hover:bg-debt/90 active:bg-debt/80 border-transparent",
  debt:
    "bg-transparent text-debt hover:bg-debt/10 active:bg-debt/20 border border-debt",
  payment:
    "bg-transparent text-payment hover:bg-payment/10 active:bg-payment/20 border border-payment",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-12 px-3 text-sm gap-1.5",
  md: "min-h-12 px-4 text-base gap-2",
  lg: "min-h-14 px-6 text-lg gap-2.5",
}

export function Button({
  variant = "primary",
  size = "md",
  disabled,
  children,
  className = "",
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center",
        "rounded-xl font-semibold",
        "transition-colors duration-150",
        "select-none cursor-pointer",
        "disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  )
}
