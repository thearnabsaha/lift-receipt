"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Copy, Download, KeyRound, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { playSetDone, testSound } from "@/lib/sound";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createApiKeyAction, revokeApiKeyAction, updateSettingsAction } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import { usePref, setPref, useVolume, setVolume, useIdleHours, setIdleHours } from "@/lib/prefs";
import { ImportRow, BackupRows } from "./data-tools";
import { ShortcutsSection } from "./shortcuts";
import { NotificationsSection } from "./notifications";

type Key = { id: string; name: string; prefix: string; createdAt: string; lastUsedAt: string | null; revokedAt: string | null };

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-4 border-b px-4 py-3 last:border-0"><div className="flex-1"><p className="text-sm font-medium">{title}</p>{desc && <p className="text-xs text-muted-foreground">{desc}</p>}</div>{children}</div>;
}
function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return <div className="flex rounded-full border p-0.5 text-sm">{options.map((o) => <button key={o.v} type="button" onClick={() => onChange(o.v)} className={`rounded-full px-3 py-1 ${value === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{o.l}</button>)}</div>;
}

function TzRow({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const [detected, setDetected] = useState("");
  const [zones, setZones] = useState<string[]>([]);
  useEffect(() => {
    try { setDetected(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch {}
    try { setZones((Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone")); } catch {}
  }, []);
  const list = zones.length ? zones : [value, detected].filter(Boolean) as string[];
  return (
    <Row title="Time zone" desc="Weeks (Mon–Sun) and days follow this. Auto uses this device's zone, so it updates when you travel.">
      <select aria-label="Time zone" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}
        className="max-w-[11rem] truncate rounded-full border bg-background px-3 py-1 text-base sm:text-sm">
        <option value="">Auto{detected ? ` (${detected})` : ""}</option>
        {list.map((z) => <option key={z} value={z}>{z.replace(/_/g, " ")}</option>)}
      </select>
    </Row>
  );
}

export function SettingsClient({ settings, keys, mcpUrl, email, routines }: { routines: { id: string; name: string }[]; settings: { unit: "kg" | "lb"; timezoneOverride: string | null }; keys: Key[]; mcpUrl: string; email: string }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [s, setS] = useState(settings);
  const showRpe = usePref("showRpe"); const soundSet = usePref("soundSet"); const soundFinish = usePref("soundFinish");
  const soundSilent = usePref("soundSilent"); const vol = useVolume(); const idleH = useIdleHours();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("Grok Bot");
  const save = async (p: Partial<typeof s>) => { setS((x) => ({ ...x, ...p })); await updateSettingsAction(p); router.refresh(); toast.success("Saved"); };
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };
  return (
    <div className="space-y-8">
      <section><p className="mono-label mb-2">General</p>
        <div className="rounded-xl border bg-card">
          <Row title="Units" desc="Weights are stored in kg and converted for display."><Seg value={s.unit} options={[{ v: "kg", l: "kg" }, { v: "lb", l: "lb" }]} onChange={(unit) => save({ unit })} /></Row>
          <TzRow value={s.timezoneOverride} onChange={(timezoneOverride) => save({ timezoneOverride })} />
          <Row title="Theme"><Seg value={(theme ?? "system") as "light" | "dark" | "system"} options={[{ v: "light", l: "Light" }, { v: "dark", l: "Dark" }, { v: "system", l: "Auto" }]} onChange={setTheme} /></Row>
          <Row title="Show RPE column" desc="Rate of perceived exertion (1–10) in the workout logger. Saved on this device."><Switch checked={showRpe} onCheckedChange={(v) => setPref("showRpe", v)} /></Row>
          <Row title="Idle workout prompt" desc="Ask to finish, resume or discard after no activity."><Seg value={String(idleH)} options={[{ v: "2", l: "2h" }, { v: "3", l: "3h" }, { v: "4", l: "4h" }, { v: "6", l: "6h" }, { v: "0", l: "Off" }]} onChange={(v) => setIdleHours(Number(v))} /></Row>
          <Row title="Sound on set complete" desc="Short tick + haptic. Mixes with your music; the iPhone silent switch mutes it."><Switch checked={soundSet} onCheckedChange={(v) => setPref("soundSet", v)} /></Row>
          <Row title="Sound on workout finish" desc="Chime when you finish a workout."><Switch checked={soundFinish} onCheckedChange={(v) => setPref("soundFinish", v)} /></Row>
          <Row title="Sounds play even in silent mode" desc="Off by default. When on, iPhone may pause music (YouTube Music, Spotify) while a sound plays."><Switch checked={soundSilent} onCheckedChange={(v) => setPref("soundSilent", v)} /></Row>
          <Row title="Test sound" desc="Plays the set tick and finish chime. If silent on iPhone, check the silent switch and volume."><Button variant="outline" size="sm" className="h-10" onClick={() => testSound()}>Test sound</Button></Row>
          <Row title="Volume" desc={`${Math.round(vol * 100)}%`}><input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVolume(Number(e.target.value))} onPointerUp={() => playSetDone()} className="h-11 w-32 accent-foreground" aria-label="Sound volume" /></Row>
        </div>
      </section>

      <section><p className="mono-label mb-2">Data</p>
        <div className="rounded-xl border bg-card">
          <Row title="Export CSV" desc="All workouts, one row per set (spreadsheets, other apps)."><Button asChild variant="outline" size="sm"><a href="/api/export"><Download className="size-4" />Export</a></Button></Row>
          <ImportRow Row={Row} />
          <BackupRows Row={Row} />
        </div>
      </section>

      <NotificationsSection Row={Row} idleHours={idleH} />

      <ShortcutsSection routines={routines} />

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

      <section id="coach"><p className="mono-label mb-2">Coach · via Grok Bot</p>
        <div className="receipt rounded-xl border px-4 py-5 text-sm">
          <p>Fortis has no built-in AI. Connect Grok Bot to the MCP server and it becomes your coach: it reads your history, weekly totals and stalled lifts, then suggests the next weight and reps.</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>Create an API key under <a href="#mcp" className="underline underline-offset-4">MCP / API keys</a> above and copy it.</li>
            <li>In Grok Bot, add a custom MCP connector with URL <span className="font-mono text-foreground">{mcpUrl}</span>.</li>
            <li>Set the header <span className="font-mono text-foreground">Authorization: Bearer &lt;key&gt;</span>.</li>
            <li>Ask away. Grok Bot can call <span className="font-mono">get_coaching_context</span>, <span className="font-mono">suggest_progression</span> and <span className="font-mono">get_weekly_summary</span>.</li>
          </ol>
          <div className="tear my-4" />
          <p className="mono-label mb-2">Try asking</p>
          <ul className="space-y-1.5">
            {["Plan my training week: 4 days, push/pull/legs.", "Review my last week. What did I neglect?", "What weight should I use on bench next session?", "Which lifts have stalled, and should I deload?", "Turn your plan into Fortis routines."].map((p) => (
              <li key={p}><button type="button" onClick={() => copy(p)} className="flex w-full items-center gap-2 rounded-md border border-dashed px-3 py-2 text-left hover:bg-muted/50 active:translate-y-px"><span className="flex-1">“{p}”</span><Copy className="size-3.5 shrink-0 text-muted-foreground" /></button></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Suggestions are a guide, not medical advice. Weights are rounded to plate-friendly increments.</p>
        </div>
      </section>

      <section><p className="mono-label mb-2">Account</p>
        <div className="rounded-xl border bg-card">
          <Row title={email} desc="Signed in"><Button variant="outline" size="sm" onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }}><LogOut className="size-4" />Sign out</Button></Row>
        </div>
      </section>

      <section><p className="mono-label mb-2">About</p>
        <div className="space-y-1 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Made by Arnab Saha</p>
          <div className="-mx-2 flex gap-1">
            <a className="inline-flex min-h-11 items-center px-2 underline underline-offset-4" href="https://x.com/TheArnabSaha" target="_blank" rel="noopener noreferrer">X · @TheArnabSaha</a>
            <a className="inline-flex min-h-11 items-center px-2 underline underline-offset-4" href="https://github.com/thearnabsaha" target="_blank" rel="noopener noreferrer">GitHub · thearnabsaha</a>
          </div>
          <p>Fortis · <a className="underline" href="https://github.com/thearnabsaha/lift-receipt" target="_blank" rel="noreferrer">Source code</a></p>
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
