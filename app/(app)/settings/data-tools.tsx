"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { importChunkAction, previewImportAction, previewRestoreAction, restoreChunkAction } from "@/app/actions";
import { parseImportCsv, type ImportedWorkout, type ImportFormat } from "@/lib/importers";
import { validateBackup, type Backup } from "@/lib/backup";

const CHUNK = 20;
const LABEL: Record<ImportFormat, string> = { strong: "Strong", hevy: "Hevy", fitnotes: "FitNotes", fortis: "Fortis CSV" };
type Row = (p: { title: string; desc?: string; children: React.ReactNode }) => React.ReactNode;

export function ImportRow({ Row }: { Row: Row }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [st, setSt] = useState<null | { format: ImportFormat; ws: ImportedWorkout[]; skippedSets: number; p: Awaited<ReturnType<typeof previewImportAction>> }>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const pick = async (f: File) => {
    setBusy("Reading…");
    try {
      const r = parseImportCsv(await f.text());
      if (!r.workouts.length) throw new Error("No workouts with weight or reps found");
      const p = await previewImportAction(r.workouts.map((w) => ({ startedAt: w.startedAt, names: [...new Set(w.exercises.map((e) => e.name))], sets: w.exercises.reduce((a, e) => a + e.sets.length, 0) })));
      setSt({ format: r.format, ws: r.workouts, skippedSets: r.skippedSets, p });
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };
  const run = async () => {
    if (!st) return;
    let imported = 0, skipped = 0;
    try {
      for (let i = 0; i < st.ws.length; i += CHUNK) {
        setBusy(`Importing ${Math.min(i + CHUNK, st.ws.length)} / ${st.ws.length}…`);
        const r = await importChunkAction(st.ws.slice(i, i + CHUNK), i + CHUNK >= st.ws.length);
        imported += r.imported; skipped += r.skipped;
      }
      toast.success(`Imported ${imported} workout${imported === 1 ? "" : "s"}${skipped ? ` · ${skipped} already here` : ""}`);
      setSt(null); router.refresh();
    } catch (e) { toast.error(`Import stopped after ${imported}: ${(e as Error).message}. Run it again; finished workouts are skipped.`); }
    finally { setBusy(null); }
  };
  return (
    <>
      <Row title="Import workouts" desc="Strong, Hevy, FitNotes or Fortis CSV. The format is detected automatically.">
        <input ref={ref} type="file" accept=".csv,text/csv,text/comma-separated-values" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) pick(f); }} />
        <Button variant="outline" size="sm" className="h-10" disabled={!!busy && !st} onClick={() => ref.current?.click()}>{busy && !st ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}Import</Button>
      </Row>
      <Dialog open={!!st} onOpenChange={(o) => { if (!o && !busy) setSt(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Import from {st ? LABEL[st.format] : ""}</DialogTitle><DialogDescription>Nothing is changed until you confirm.</DialogDescription></DialogHeader>
          {st && (
            <div className="receipt rounded-lg border px-4 py-3 text-sm">
              <dl className="space-y-1.5 font-mono tabular-nums">
                <div className="flex justify-between"><dt>Workouts</dt><dd>{st.p.workouts}</dd></div>
                <div className="flex justify-between"><dt>Sets</dt><dd>{st.p.sets}</dd></div>
                <div className="flex justify-between"><dt>New custom exercises</dt><dd>{st.p.newExercises.length}</dd></div>
                <div className="flex justify-between text-muted-foreground"><dt>Duplicates skipped</dt><dd>{st.p.duplicates}</dd></div>
                {st.skippedSets > 0 && <div className="flex justify-between text-muted-foreground"><dt>Cardio/timed sets skipped</dt><dd>{st.skippedSets}</dd></div>}
              </dl>
              {st.p.newExercises.length > 0 && <p className="mt-3 text-xs text-muted-foreground">New: {st.p.newExercises.slice(0, 12).join(", ")}{st.p.newExercises.length > 12 ? ` +${st.p.newExercises.length - 12} more` : ""}</p>}
              {st.p.matched.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Matched: {st.p.matched.slice(0, 6).map((m) => `${m.from} → ${m.to}`).join(" · ")}{st.p.matched.length > 6 ? ` +${st.p.matched.length - 6} more` : ""}</p>}
              <p className="mt-2 text-xs text-muted-foreground">Times are read in this device&apos;s time zone.</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={!!busy} onClick={() => setSt(null)}>Cancel</Button>
            <Button disabled={!!busy || !st?.p.workouts} onClick={run}>{busy ? <><Loader2 className="size-4 animate-spin" />{busy}</> : st?.p.workouts ? `Import ${st.p.workouts}` : "Nothing new"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BackupRows({ Row }: { Row: Row }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [st, setSt] = useState<null | { b: Backup; p: Awaited<ReturnType<typeof previewRestoreAction>> }>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const pick = async (f: File) => {
    setBusy("Reading…");
    try {
      const b = validateBackup(JSON.parse(await f.text()));
      const p = await previewRestoreAction({ ...b, workouts: b.workouts.map((w) => ({ ...w, exercises: [] })) });
      setSt({ b, p });
    } catch (e) { toast.error(e instanceof SyntaxError ? "That file isn't valid JSON" : (e as Error).message); } finally { setBusy(null); }
  };
  const run = async () => {
    if (!st) return;
    const { b } = st; const tot = { workouts: 0, routines: 0, exercises: 0, measurements: 0 };
    try {
      const n = Math.max(1, Math.ceil(b.workouts.length / CHUNK));
      for (let i = 0; i < n; i++) {
        setBusy(`Restoring ${Math.min((i + 1) * CHUNK, b.workouts.length)} / ${b.workouts.length}…`);
        const part = { ...b, workouts: b.workouts.slice(i * CHUNK, (i + 1) * CHUNK), ...(i > 0 ? { routines: [], measurements: [], favorites: [], settings: null } : {}) };
        const r = await restoreChunkAction(part, i === n - 1);
        for (const k of Object.keys(tot) as (keyof typeof tot)[]) tot[k] += r[k];
      }
      toast.success(`Restored ${tot.workouts} workouts, ${tot.routines} routines, ${tot.measurements} measurements`);
      setSt(null); router.refresh();
    } catch (e) { toast.error(`Restore stopped: ${(e as Error).message}. Run it again; restored items are skipped.`); }
    finally { setBusy(null); }
  };
  const p = st?.p;
  return (
    <>
      <Row title="Download backup" desc="Everything as one JSON file: workouts, routines, custom exercises, favourites, measurements, settings."><Button asChild variant="outline" size="sm" className="h-10"><a href="/api/backup" download><Download className="size-4" />Backup</a></Button></Row>
      <Row title="Restore backup" desc="Merges a Fortis backup into this account. Never overwrites or duplicates.">
        <input ref={ref} type="file" accept=".json,application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) pick(f); }} />
        <Button variant="outline" size="sm" className="h-10" disabled={!!busy && !st} onClick={() => ref.current?.click()}>{busy && !st ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}Restore</Button>
      </Row>
      <Dialog open={!!st} onOpenChange={(o) => { if (!o && !busy) setSt(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Restore backup</DialogTitle><DialogDescription>{p ? `From ${new Date(p.exportedAt).toLocaleString()}. Existing data stays as it is.` : ""}</DialogDescription></DialogHeader>
          {p && (
            <div className="receipt rounded-lg border px-4 py-3 text-sm">
              <p className="mono-label mb-2">Will add</p>
              <dl className="space-y-1.5 font-mono tabular-nums">
                {([["Workouts", p.workouts, p.skipped.workouts], ["Routines", p.routines, p.skipped.routines], ["Custom exercises", p.exercises, p.skipped.exercises], ["Measurements", p.measurements, p.skipped.measurements]] as const).map(([l, a, s]) => (
                  <div key={l} className="flex justify-between"><dt>{l}</dt><dd>{a}{s ? <span className="text-muted-foreground"> · {s} already here</span> : null}</dd></div>
                ))}
                <div className="flex justify-between"><dt>Favourites</dt><dd>{p.favorites}</dd></div>
                <div className="flex justify-between"><dt>Settings</dt><dd>{p.settings ? "restore" : "keep current"}</dd></div>
              </dl>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={!!busy} onClick={() => setSt(null)}>Cancel</Button>
            <Button disabled={!!busy || !p || !(p.workouts + p.routines + p.exercises + p.measurements + p.favorites + (p.settings ? 1 : 0))} onClick={run}>{busy ? <><Loader2 className="size-4 animate-spin" />{busy}</> : "Restore"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
