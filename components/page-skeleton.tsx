/** Instant shell shown while a tab's server data loads (also what Link prefetches for dynamic routes). */
export function PageSkeleton({ label, title, rows = 4, stat = false, chart = false }: { label: string; title: string; rows?: number; stat?: boolean; chart?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl" aria-busy="true" aria-label={`Loading ${title}`}>
      <div className="mb-6"><p className="mono-label mb-1">{label}</p><h1 className="text-3xl font-semibold tracking-tight">{title}</h1></div>
      {stat && <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border bg-card px-5 py-6">{[0, 1, 2, 3].map((i) => <div key={i} className="space-y-2"><B c="h-3 w-16" /><B c="h-7 w-12" /></div>)}</div>}
      {chart && <div className="mb-8 rounded-xl border bg-card p-4"><B c="mb-3 h-3 w-40" /><B c="h-48 w-full" /></div>}
      <div className="space-y-3">{Array.from({ length: rows }, (_, i) => <div key={i} className="rounded-xl border bg-card p-4"><B c="h-4 w-1/3" /><B c="mt-3 h-3 w-2/3" /><B c="mt-2 h-3 w-1/2" /></div>)}</div>
    </div>
  );
}

function B({ c }: { c: string }) { return <div className={`animate-pulse rounded-md bg-muted ${c}`} />; }
