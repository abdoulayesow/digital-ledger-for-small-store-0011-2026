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
      className={className}
      aria-label="B'tiki"
    />
  );
}
