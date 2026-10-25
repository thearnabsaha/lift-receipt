"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Papa from "papaparse";
import { Copy, Download, KeyRound, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createApiKeyAction, importWorkoutsAction, revokeApiKeyAction, updateSettingsAction } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import { KG_PER_LB } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";

type Key = { id: string; name: string; prefix: string; createdAt: string; lastUsedAt: string | null; revokedAt: string | null };

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-4 border-b px-4 py-3 last:border-0"><div className="flex-1"><p className="text-sm font-medium">{title}</p>{desc && <p className="text-xs text-muted-foreground">{desc}</p>}</div>{children}</div>;
}
function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return <div className="flex rounded-full border p-0.5 text-sm">{options.map((o) => <button key={o.v} type="button" onClick={() => onChange(o.v)} className={`rounded-full px-3 py-1 ${value === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{o.l}</button>)}</div>;
}

/** Parse our own export or a Strong app CSV export into workouts. */
function parseCsv(text: string) {
  const res = Papa.parse<Record<string, string>>(text.trim(), { header: true, skipEmptyLines: true, delimiter: "" });
  const map = new Map<string, { name: string; startedAt: Date; dur: number; notes: string; exercises: Map<string, WorkoutExercise> }>();
  for (const r of res.data) {
    const date = r["Date"]; const wname = r["Workout Name"]; const ename = r["Exercise Name"];
    if (!date || !ename) continue;
    const key = date + "|" + wname;
    const started = new Date(date.includes("T") ? date : date.replace(" ", "T"));
    if (isNaN(+started)) continue;
    let durMin = 0; const d = r["Duration (min)"] ?? r["Duration"] ?? "";
    if (/^\d+$/.test(d)) durMin = Number(d); else { const h = /(\d+)h/.exec(d), m = /(\d+)m/.exec(d); durMin = (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0); }
    const w = map.get(key) ?? { name: wname || "Workout", startedAt: started, dur: durMin, notes: r["Workout Notes"] ?? "", exercises: new Map() };
    const ek = ename + "|" + (r["Superset"] ?? "");
    const ex = w.exercises.get(ek) ?? { exerciseId: "", name: ename, notes: r["Notes"] || undefined, supersetId: r["Superset"] || null, sets: [] };
    const lbCol = r["Weight (lb)"] ?? r["Weight (lbs)"];
    const kg = r["Weight (kg)"] ?? r["Weight"];
    const weight = lbCol ? Number(lbCol) * KG_PER_LB : kg ? Number(kg) : null;
    const so = r["Set Order"] ?? ""; const typeCol = (r["Set Type"] ?? "") as SetType;
    const type: SetType = ["warmup", "normal", "drop", "failure"].includes(typeCol) ? typeCol : so === "W" ? "warmup" : so === "D" ? "drop" : so === "F" ? "failure" : "normal";
    ex.sets.push({ type, weight: weight && !isNaN(weight) ? Math.round(weight * 100) / 100 : null, reps: r["Reps"] ? Math.round(Number(r["Reps"])) : null, rpe: r["RPE"] ? Number(r["RPE"]) || null : null, done: true });
    w.exercises.set(ek, ex); map.set(key, w);
  }
  return [...map.values()].map((w) => ({ name: w.name, notes: w.notes || null, startedAt: w.startedAt.toISOString(), endedAt: new Date(+w.startedAt + w.dur * 60000).toISOString(), exercises: [...w.exercises.values()] }));
}

export function SettingsClient({ settings, keys, mcpUrl, email }: { settings: { unit: "kg" | "lb"; restSec: number; autoRest: boolean }; keys: Key[]; mcpUrl: string; email: string }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [s, setS] = useState(settings);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("Grok Bot");
  const fileRef = useRef<HTMLInputElement>(null);
  const save = async (p: Partial<typeof s>) => { setS((x) => ({ ...x, ...p })); await updateSettingsAction(p); router.refresh(); toast.success("Saved"); };
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };
  return (
    <div className="space-y-8">
      <section><p className="mono-label mb-2">General</p>
        <div className="rounded-xl border bg-card">
          <Row title="Units" desc="Weights are stored in kg and converted for display."><Seg value={s.unit} options={[{ v: "kg", l: "kg" }, { v: "lb", l: "lb" }]} onChange={(unit) => save({ unit })} /></Row>
          <Row title="Theme"><Seg value={(theme ?? "system") as "light" | "dark" | "system"} options={[{ v: "light", l: "Light" }, { v: "dark", l: "Dark" }, { v: "system", l: "Auto" }]} onChange={setTheme} /></Row>
          <Row title="Auto-start rest timer" desc="When you complete a set."><Switch checked={s.autoRest} onCheckedChange={(autoRest) => save({ autoRest })} /></Row>
          <Row title="Default rest" desc="Seconds. Override per exercise in a workout.">
            <Input className="w-20 text-center" inputMode="numeric" defaultValue={s.restSec} onBlur={(e) => { const v = Math.max(0, Math.min(900, Number(e.target.value) || 0)); if (v !== s.restSec) save({ restSec: v }); }} />
          </Row>
        </div>
      </section>

      <section><p className="mono-label mb-2">Data</p>
        <div className="rounded-xl border bg-card">
          <Row title="Export CSV" desc="All workouts, one row per set."><Button asChild variant="outline" size="sm"><a href="/api/export"><Download className="size-4" />Export</a></Button></Row>
          <Row title="Import CSV" desc="Lift Receipt or Strong app export.">
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={async (e) => {
              const f = e.target.files?.[0]; if (!f) return;
              try { const ws = parseCsv(await f.text()); if (!ws.length) throw new Error("No rows"); toast.loading(`Importing ${ws.length} workouts…`, { id: "imp" }); const r = await importWorkoutsAction(ws); toast.success(`Imported ${r.imported} workouts`, { id: "imp" }); router.refresh(); }
              catch (err) { toast.error(`Import failed: ${(err as Error).message}`, { id: "imp" }); } finally { e.target.value = ""; }
            }} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload className="size-4" />Import</Button>
          </Row>
        </div>
      </section>

      <section id="mcp"><p className="mono-label mb-2">MCP / API keys</p>
        <div className="receipt rounded-xl border px-4 py-5">
          <p className="text-sm">Connect Grok Bot (or any MCP client) to log workouts and read your progress.</p>
          <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs"><span className="flex-1 truncate">{mcpUrl}</span><Button size="icon" variant="ghost" className="size-6" onClick={() => copy(mcpUrl)} aria-label="Copy URL"><Copy className="size-3.5" /></Button></div>
          <p className="mt-2 text-xs text-muted-foreground">Transport: Streamable HTTP · Header: <code className="font-mono">Authorization: Bearer &lt;key&gt;</code></p>
          <form className="mt-4 flex gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await createApiKeyAction(keyName); setNewKey(r.key); router.refresh(); }}>
            <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="Key name" className="h-9" />
            <Button size="sm" className="h-9"><KeyRound className="size-4" />Create key</Button>
          </form>
          <div className="mt-3">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center gap-2 border-b py-2 text-sm last:border-0">
                <span className="flex-1"><span className="font-medium">{k.name}</span> <span className="font-mono text-xs text-muted-foreground">{k.prefix}…</span>
                  <span className="block text-xs text-muted-foreground">{k.revokedAt ? "Revoked" : k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleString()}` : "Never used"}</span></span>
                {!k.revokedAt && <Button size="sm" variant="ghost" onClick={async () => { if (!confirm("Revoke key?")) return; await revokeApiKeyAction(k.id); router.refresh(); }}>Revoke</Button>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section><p className="mono-label mb-2">Account</p>
        <div className="rounded-xl border bg-card">
          <Row title={email} desc="Signed in"><Button variant="outline" size="sm" onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }}><LogOut className="size-4" />Sign out</Button></Row>
        </div>
      </section>

      <Dialog open={!!newKey} onOpenChange={(o) => !o && setNewKey(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Your new API key</DialogTitle><DialogDescription>Copy it now — it won&apos;t be shown again.</DialogDescription></DialogHeader>
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs break-all"><span className="flex-1">{newKey}</span><Button size="icon" variant="ghost" className="size-6 shrink-0" onClick={() => newKey && copy(newKey)}><Copy className="size-3.5" /></Button></div>
          <p className="text-xs text-muted-foreground">In Grok Bot: add a custom MCP connector → URL <span className="font-mono">{mcpUrl}</span> → header <span className="font-mono">Authorization: Bearer {newKey?.slice(0, 8)}…</span></p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
