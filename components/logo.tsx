export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <g transform="rotate(-40 32 32)" className="fill-primary-foreground">
        <rect x="10" y="30" width="44" height="4" rx="2" />
        <rect x="16" y="18" width="8" height="28" rx="3" />
        <rect x="40" y="18" width="8" height="28" rx="3" />
        <rect x="10" y="24" width="4" height="16" rx="1.5" />
        <rect x="50" y="24" width="4" height="16" rx="1.5" />
      </g>
    </svg>
  );
}
export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark />
      <span>Lift Receipt</span>
    </span>
  );
}
