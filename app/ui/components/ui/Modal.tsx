"use client"

import { useEffect, useRef, useCallback } from "react"
import { IconX } from "@/components/icons"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  closeLabel?: string
  children: React.ReactNode
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, title, closeLabel, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab") return
    const container = contentRef.current
    if (!container) return

    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      trapFocus(e)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    // Move focus into the modal
    requestAnimationFrame(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      firstFocusable?.focus()
    })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previousFocusRef.current?.focus()
    }
  }, [open, onClose, trapFocus])

  return (
    <div
      aria-modal={open ? "true" : undefined}
      role="dialog"
      aria-label={title}
      aria-hidden={!open}
      inert={!open ? (true as unknown as undefined) : undefined}
      className={[
        "fixed inset-0 z-50",
        "flex flex-col justify-end",
        open ? "pointer-events-auto" : "pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/60",
          "transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={contentRef}
        className={[
          "relative z-10",
          "bg-surface-1 rounded-t-3xl",
          "max-h-[85vh] flex flex-col",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-surface-3" aria-hidden="true" />
        </div>

        {/* Header */}
        {(title != null) && (
          <div className="flex items-center justify-between px-4 pt-2 pb-3 shrink-0">
            <h2 className="text-lg font-display font-bold text-text-primary">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel || "Close"}
              className={[
                "flex items-center justify-center",
                "min-w-12 min-h-12 rounded-full",
                "text-text-muted hover:text-text-primary hover:bg-surface-2",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <IconX size={20} />
            </button>
          </div>
        )}

        {/* Content — scrollable */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-4 pb-safe pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
