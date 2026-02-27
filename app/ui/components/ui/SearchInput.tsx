"use client"

import { InputHTMLAttributes } from "react"
import { IconSearch, IconX } from "@/components/icons"

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  clearLabel?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  clearLabel,
  className = "",
  ...rest
}: SearchInputProps) {
  return (
    <div
      className={[
        "relative flex items-center",
        "min-h-12 bg-surface-2 rounded-xl",
        "border border-surface-3/50 focus-within:border-brand",
        "transition-colors duration-150",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Search icon */}
      <span className="absolute left-3 flex items-center pointer-events-none text-text-muted">
        <IconSearch size={20} />
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full h-full bg-transparent",
          "pl-10 pr-10 py-3",
          "text-base text-text-primary placeholder:text-text-muted",
          "focus:outline-none",
          // Hide browser-native clear button
          "[&::-webkit-search-cancel-button]:hidden",
          "[&::-webkit-search-decoration]:hidden",
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel || "Clear"}
          className={[
            "absolute right-2",
            "flex items-center justify-center",
            "min-w-12 min-h-12 rounded-full",
            "text-text-muted hover:text-text-primary hover:bg-surface-3",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  )
}
