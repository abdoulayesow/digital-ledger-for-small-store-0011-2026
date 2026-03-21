interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 48, className = "" }: LogoMarkProps) {
  return (
    <img
      src="/logo.png"
      alt="B'tiki"
      width={size}
      height={size}
      className={`rounded-lg border-2 border-brand ${className}`}
      aria-label="B'tiki"
    />
  );
}
