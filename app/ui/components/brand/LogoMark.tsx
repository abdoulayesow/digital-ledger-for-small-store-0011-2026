interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 48, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Déftar"
      className={className}
    >
      {/* Notebook spine */}
      <rect x="23" y="6" width="2" height="36" rx="1" fill="var(--brand)" />

      {/* Left page */}
      <rect
        x="6"
        y="6"
        width="17"
        height="36"
        rx="2"
        stroke="var(--brand)"
        strokeWidth="2"
        fill="none"
      />
      {/* Ledger lines */}
      <line x1="10" y1="14" x2="19" y2="14" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="20" x2="19" y2="20" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="26" x2="19" y2="26" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="32" x2="17" y2="32" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Right page */}
      <rect
        x="25"
        y="6"
        width="17"
        height="36"
        rx="2"
        stroke="var(--brand)"
        strokeWidth="2"
        fill="none"
      />
      {/* Coin circle */}
      <circle
        cx="33.5"
        cy="23"
        r="8"
        stroke="var(--brand)"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="33.5"
        y="25"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="var(--brand)"
        fontFamily="'Nunito', var(--font-display), system-ui"
      >
        G
      </text>
    </svg>
  );
}
