"use client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DEFAULTS, defaultIncrement, describeConfig, normalizeConfig, type ProgressionConfig, type ProgressionMode } from "@/lib/progression";

const MODES: { m: ProgressionMode; l: string; d: string }[] = [
  { m: "off", l: "Off", d: "No automatic suggestion." },
  { m: "double", l: "Double", d: "Work up a rep range. When every working set hits the top, add weight and drop back to the bottom." },
  { m: "linear", l: "Linear", d: "Same reps every time. Hit them on every set and the weight goes up; keep missing and it deloads." },
];

/** Routine-editor line "Progression: Double 8–12 · +2.5 kg" that opens the setting. */
export function ProgressionSetting({ value, onChange, equipment, unit, name }: { value?: ProgressionConfig; onChange: (v: ProgressionConfig | undefined) => void; equipment?: string; unit: "kg" | "lb"; name: string }) {
  const [open, setOpen] = useState(false);
  const cur = normalizeConfig(value, equipment, unit);
  const [d, setD] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<ProgressionMode>("off");
  const init = () => {
    const c = cur ?? normalizeConfig({ mode: "double", unit }, equipment, unit)!;
    setMode(cur?.mode ?? "off");
    setD({ repMin: String(c.repMin), repMax: String(c.repMax), reps: String(c.reps), increment: String(c.unit === unit ? c.increment : defaultIncrement(equipment, unit)), deloadAfter: String(c.deloadAfter), deloadPct: String(c.deloadPct) });
    setOpen(true);
  };
  const num = (k: string) => { const n = Number((d[k] ?? "").replace(",", ".")); return Number.isFinite(n) && d[k]?.trim() ? n : undefined; };
  const save = () => {
    if (mode === "off") onChange(undefined);
    else onChange(normalizeConfig({ mode, unit, repMin: num("repMin"), repMax: num("repMax"), reps: num("reps"), increment: num("increment"), deloadAfter: num("deloadAfter"), deloadPct: num("deloadPct") }, equipment, unit) ?? undefined);
    setOpen(false);
  };
  const F = ({ k, l, suffix, dec }: { k: string; l: string; suffix?: string; dec?: boolean }) => (
    <label className="block text-xs"><span className="mono-label text-[10px]">{l}</span>
      <div className="relative mt-1">
        <Input inputMode={dec ? "decimal" : "numeric"} value={d[k] ?? ""} onChange={(e) => setD((x) => ({ ...x, [k]: e.target.value }))} className="h-11 pr-9 text-base tabular-nums" aria-label={l} />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
  return (
    <>
      <button type="button" onClick={init} data-testid="progression-line"
        className="mb-2 flex min-h-11 w-full items-center gap-2 rounded-md border border-dashed px-3 text-left font-mono text-xs text-muted-foreground active:translate-y-px">
        <TrendingUp className="size-3.5 shrink-0" /><span className="mono-label text-[10px]">Progression</span>
        <span className={cn("min-w-0 flex-1 truncate text-right", cur && "text-foreground")}>{describeConfig(value, equipment, unit)}</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <p className="mono-label">Auto progression</p>
            <DialogTitle className="truncate">{name}</DialogTitle>
            <DialogDescription>{MODES.find((x) => x.m === mode)!.d}</DialogDescription>
          </DialogHeader>
          <div role="radiogroup" aria-label="Mode" className="grid grid-cols-3 rounded-lg border p-1">
            {MODES.map((x) => (
              <button key={x.m} type="button" role="radio" aria-checked={mode === x.m} onClick={() => setMode(x.m)}
                className={cn("h-10 rounded-md text-sm font-medium transition-colors", mode === x.m ? "bg-foreground text-background" : "text-muted-foreground")}>{x.l}</button>
            ))}
          </div>
          {mode === "double" && <div className="grid grid-cols-3 gap-2">{F({ k: "repMin", l: "Min reps" })}{F({ k: "repMax", l: "Max reps" })}{F({ k: "increment", l: "Add", suffix: unit, dec: true })}</div>}
          {mode === "linear" && (
            <>
              <div className="grid grid-cols-2 gap-2">{F({ k: "reps", l: "Target reps" })}{F({ k: "increment", l: "Add", suffix: unit, dec: true })}</div>
              <div className="grid grid-cols-2 gap-2">{F({ k: "deloadAfter", l: "Deload after misses" })}{F({ k: "deloadPct", l: "Deload by", suffix: "%", dec: true })}</div>
              <p className="text-xs text-muted-foreground">0 misses = never deload. Default {DEFAULTS.deloadAfter} misses → −{DEFAULTS.deloadPct}%.</p>
            </>
          )}
          {mode !== "off" && <p className="text-xs text-muted-foreground">Only completed normal sets count. Warm-ups, drop and failure sets are ignored; an RPE 10 set holds the weight.</p>}
          <Button className="h-11" onClick={save}>Save</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
