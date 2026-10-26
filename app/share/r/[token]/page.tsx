import Link from "next/link";
import type { Metadata } from "next";
import { getSharedRoutine } from "@/lib/services";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { ImportButton } from "./import";

export const metadata: Metadata = { title: "Shared routine", robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } } };

const fmtSet = (s: { weight: number | null; reps: number | null; type: string }) =>
  `${s.weight != null ? `${+s.weight.toFixed(2)} kg` : "BW"} × ${s.reps ?? "—"}${s.type !== "normal" ? ` · ${s.type}` : ""}`;

export default async function SharedRoutinePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [r, session] = await Promise.all([getSharedRoutine(token), getSession()]);
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Link href="/" className="mb-6 self-center"><Logo /></Link>
      {!r ? (
        <div className="receipt rounded-xl border px-6 py-9 text-center shadow-[0_1px_3px_#0000001a]">
          <p className="mono-label">Link inactive</p>
          <h1 className="mt-2 text-xl font-semibold">This routine is no longer shared</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ask the owner for a new link.</p>
        </div>
      ) : (
        <article className="receipt rounded-xl border px-5 py-7 shadow-[0_1px_3px_#0000001a]">
          <p className="mono-label text-center">Shared routine{r.owner ? ` · from ${r.owner}` : ""}</p>
          <h1 className="mt-1 text-center text-2xl font-semibold tracking-tight">{r.name}</h1>
          <p className="mono-label mt-1 text-center">{r.exercises.length} exercises · {r.exercises.reduce((a, e) => a + e.sets.length, 0)} sets</p>
          {r.notes && <p className="mt-3 text-center text-sm text-muted-foreground">{r.notes}</p>}
          <div className="tear my-5" />
          <ol className="space-y-4">
            {r.exercises.map((e, i) => (
              <li key={i}>
                <div className="flex items-baseline gap-2"><span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span><span className="font-medium">{e.name}</span>{e.supersetId && <span className="mono-label text-[10px]">superset</span>}</div>
                {e.notes && <p className="ml-7 text-xs text-muted-foreground">{e.notes}</p>}
                <ul className="ml-7 mt-1 space-y-0.5 font-mono text-xs tabular-nums">
                  {e.sets.map((s, j) => <li key={j} className="flex justify-between border-b border-dashed py-0.5 last:border-0"><span className="text-muted-foreground">Set {j + 1}</span><span>{fmtSet(s)}</span></li>)}
                </ul>
              </li>
            ))}
          </ol>
          <div className="tear my-5" />
          <ImportButton token={token} signedIn={!!session} />
          <p className="mono-label mt-3 text-center text-[10px]">Importing adds a copy. Nothing of yours is overwritten.</p>
        </article>
      )}
    </main>
  );
}
