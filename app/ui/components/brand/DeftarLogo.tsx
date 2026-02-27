import { LogoMark } from "./LogoMark";

interface DeftarLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function DeftarLogo({ size = 48, showText = true, className = "" }: DeftarLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className="font-display font-extrabold text-text-primary"
          style={{ fontSize: size * 0.6 }}
        >
          Déftar
        </span>
      )}
    </div>
  );
}
