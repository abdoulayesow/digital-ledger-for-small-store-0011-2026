import { LogoMark } from "./LogoMark";

interface BtikiLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function BtikiLogo({ size = 48, showText = true, className = "" }: BtikiLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className="font-display font-extrabold text-text-primary"
          style={{ fontSize: size * 0.6 }}
        >
          B&apos;tiki
        </span>
      )}
    </div>
  );
}
