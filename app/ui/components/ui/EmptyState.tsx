"use client"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center",
        "text-center px-6 py-12 gap-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon container — 64px */}
      <div
        className="w-16 h-16 flex items-center justify-center text-text-muted"
        aria-hidden="true"
      >
        <span className="[&>svg]:w-16 [&>svg]:h-16">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-display font-bold text-text-muted">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-muted/70 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {/* Optional action */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
