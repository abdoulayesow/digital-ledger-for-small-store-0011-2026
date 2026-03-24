import { forwardRef } from "react";

type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  /** Visual variant */
  variant?: "default" | "centered";
  /** Error state — adds red border */
  error?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ variant = "default", error, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={[
          "min-h-[52px] px-4 rounded-xl w-full",
          "bg-surface-2 text-text-primary placeholder:text-text-muted/60",
          "border-2 text-base transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface-0",
          error
            ? "border-debt/60 focus:border-debt focus:ring-debt/30"
            : "border-surface-3/40 focus:border-brand focus:ring-brand/20",
          variant === "centered" && "text-center text-lg",
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);
