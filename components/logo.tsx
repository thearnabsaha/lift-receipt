export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <path d="M18 12h28v38l-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3z" className="fill-primary-foreground" />
      <rect x="22" y="22" width="20" height="3" rx="1.5" className="fill-primary" />
      <rect x="21" y="18" width="3" height="11" rx="1" className="fill-primary" />
      <rect x="40" y="18" width="3" height="11" rx="1" className="fill-primary" />
      <rect x="22" y="34" width="20" height="2" rx="1" className="fill-primary" opacity=".35" />
      <rect x="22" y="39" width="13" height="2" rx="1" className="fill-primary" opacity=".35" />
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
