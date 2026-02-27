"use client"

import { getCustomerColor, getInitial } from "@/lib/utils"

type AvatarSize = "sm" | "md" | "lg"

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-xl",
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const color = getCustomerColor(name)
  const initial = getInitial(name)

  return (
    <div
      role="img"
      aria-label={name}
      className={[
        "rounded-full flex items-center justify-center shrink-0",
        "font-display font-bold text-white select-none",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  )
}
