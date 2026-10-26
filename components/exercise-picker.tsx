"use client";
import { useMemo, useState } from "react";
import { Check, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MUSCLES, EQUIPMENT } from "@/lib/data/exercises";
import { createExerciseAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { FavoriteStar, useFavoriteSet } from "@/components/favorite-star";

export type ExerciseLite = { id: string; name: string; muscle: string; equipment: string; userId?: string | null; fav?: boolean };

export function ExerciseFilters({ q, setQ, muscle, setMuscle, equipment, setEquipment }: {
  q: string; setQ: (s: string) => void; muscle: string; setMuscle: (s: string) => void; equipment: string; setEquipment: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" className="h-10 pl-9" />
      </div>
      <div className="flex gap-2">
        <Select value={muscle} onValueChange={setMuscle}>
          <SelectTrigger className="h-10 w-full sm:w-36"><SelectValue placeholder="Muscle" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Any muscle</SelectItem>{MUSCLES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={equipment} onValueChange={setEquipment}>
          <SelectTrigger className="h-10 w-full sm:w-36"><SelectValue placeholder="Equipment" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Any equipment</SelectItem>{EQUIPMENT.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function useExerciseFilter(list: ExerciseLite[], isFav?: (id: string) => boolean, favOnly = false) {
  const [q, setQ] = useState(""); const [muscle, setMuscle] = useState("all"); const [equipment, setEquipment] = useState("all");
  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    const r = list.filter((e) => (!ql || e.name.toLowerCase().includes(ql)) && (muscle === "all" || e.muscle === muscle) && (equipment === "all" || e.equipment === equipment) && (!favOnly || isFav?.(e.id)));
    return isFav ? [...r.filter((e) => isFav(e.id)), ...r.filter((e) => !isFav(e.id))] : r;
  }, [list, q, muscle, equipment, isFav, favOnly]);
  return { filtered, props: { q, setQ, muscle, setMuscle, equipment, setEquipment } };
}

export function CreateExerciseDialog({ trigger, onCreated, defaultName = "" }: { trigger: React.ReactNode; onCreated?: (e: ExerciseLite) => void; defaultName?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName); const [muscle, setMuscle] = useState("Other"); const [equipment, setEquipment] = useState("Other");
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setName(defaultName); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New exercise</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault(); if (!name.trim()) return;
          setBusy(true);
          try { const ex = await createExerciseAction({ name, muscle, equipment }); toast.success("Exercise created"); onCreated?.(ex); setOpen(false); }
          catch { toast.error("Could not create exercise"); } finally { setBusy(false); }
        }}>
          <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Exercise name" />
          <div className="grid grid-cols-2 gap-2">
            <Select value={muscle} onValueChange={setMuscle}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{MUSCLES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
            <Select value={equipment} onValueChange={setEquipment}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{EQUIPMENT.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>Save exercise</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExercisePicker({ exercises, onPick, trigger, open: openP, onOpenChange, replace }: {
  exercises: ExerciseLite[]; onPick: (list: ExerciseLite[], superset: boolean, keepValues: boolean) => void; trigger?: React.ReactNode;
  open?: boolean; onOpenChange?: (o: boolean) => void; /** single-select "Replace exercise" mode */ replace?: string;
}) {
  const [openS, setOpenS] = useState(false);
  const open = openP ?? openS; const setOpen = (o: boolean) => { setOpenS(o); onOpenChange?.(o); };
  const [keep, setKeep] = useState(true);
  const [extra, setExtra] = useState<ExerciseLite[]>([]);
  const all = useMemo(() => [...extra, ...exercises], [extra, exercises]);
  const favs = useFavoriteSet(useMemo(() => exercises.filter((e) => e.fav).map((e) => e.id), [exercises]));
  const [favOnly, setFavOnly] = useState(false);
  const { filtered, props } = useExerciseFilter(all, favs.has, favOnly);
  const [sel, setSel] = useState<string[]>([]);
  const pick = (superset: boolean) => { onPick(sel.map((id) => all.find((e) => e.id === id)!), superset, keep); setSel([]); setOpen(false); };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="flex max-h-[90dvh] flex-col gap-3 sm:max-w-lg">
        <DialogHeader><DialogTitle>{replace ? "Replace exercise" : "Add exercises"}</DialogTitle>{replace && <p className="mono-label text-[10px]">Replacing · {replace}</p>}</DialogHeader>
        <ExerciseFilters {...props} />
        <div className="-mt-1 flex gap-2" role="group" aria-label="Filter">
          {([["All", false], ["Favourites", true]] as const).map(([l, v]) => (
            <button key={l} type="button" onClick={() => setFavOnly(v)} aria-pressed={favOnly === v}
              className={cn("h-8 rounded-full border px-3 font-mono text-[11px] uppercase tracking-wider", favOnly === v ? "border-foreground bg-foreground text-background" : "text-muted-foreground")}>
              {v && "★ "}{l}
            </button>
          ))}
        </div>
        <div className="-mx-2 min-h-0 flex-1 overflow-y-auto">
          {filtered.slice(0, 300).map((e) => {
            const on = sel.includes(e.id);
            return (
              <div key={e.id} className={cn("flex items-center rounded-lg hover:bg-muted/60", on && "bg-muted")}>
                <button type="button" onClick={() => setSel((s) => on ? s.filter((x) => x !== e.id) : replace ? [e.id] : [...s, e.id])}
                  className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5 text-left">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-card font-mono text-xs">{e.name[0]}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{e.name}</span><span className="mono-label text-[10px]">{e.muscle} · {e.equipment}</span></span>
                  {on && <Check className="size-4" />}
                </button>
                <FavoriteStar id={e.id} fav={favs.has(e.id)} onToggle={() => favs.toggle(e.id)} className="mr-1" />
              </div>
            );
          })}
          {!filtered.length && <p className="py-6 text-center text-sm text-muted-foreground">{favOnly ? "No favourites yet. Tap ★ on an exercise." : "No match."}</p>}
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <CreateExerciseDialog defaultName={props.q} onCreated={(e) => { setExtra((x) => [e, ...x]); setSel((s) => replace ? [e.id] : [...s, e.id]); }}
            trigger={<Button variant="outline" size="sm"><Plus className="size-4" />New</Button>} />
          {replace && <label className="flex h-9 items-center gap-2 text-xs"><input type="checkbox" className="size-4 accent-foreground" checked={keep} onChange={(e) => setKeep(e.target.checked)} />Keep weights &amp; reps</label>}
          <div className="ml-auto flex gap-2">
            {!replace && sel.length > 1 && <Button variant="outline" size="sm" onClick={() => pick(true)}>Superset ({sel.length})</Button>}
            <Button size="sm" disabled={!sel.length} onClick={() => pick(false)}>{replace ? "Replace" : "Add"}{replace ? "" : sel.length ? ` (${sel.length})` : ""}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
