"use client";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShortcutsSection({ routines }: { routines: { id: string; name: string }[] }) {
  const links = [{ label: "Start empty workout", path: "/workout?start=1" }, { label: "Start last routine", path: "/workout?routine=last" }, ...routines.map((r) => ({ label: r.name, path: `/workout?routine=${r.id}` })), { label: "Records", path: "/records" }, { label: "Measure", path: "/measure" }];
  const url = (p: string) => `${location.origin}${p}`;
  const copy = async (p: string) => { try { await navigator.clipboard.writeText(url(p)); toast.success("Link copied"); } catch { toast.error("Copy failed"); } };
  const share = async (l: { label: string; path: string }) => { if (navigator.share) { try { await navigator.share({ title: `Fortis · ${l.label}`, url: url(l.path) }); } catch { /* cancelled */ } } else copy(l.path); };
  return (
    <section id="shortcuts"><p className="mono-label mb-2">Shortcuts</p>
      <div className="rounded-xl border bg-card">
        {links.map((l) => (
          <div key={l.path} className="flex items-center gap-2 border-b px-4 py-2 last:border-0">
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{l.label}</p><p className="truncate font-mono text-[11px] text-muted-foreground">{l.path}</p></div>
            <Button size="icon" variant="ghost" className="size-11" aria-label={`Share link: ${l.label}`} onClick={() => share(l)}><Share2 className="size-4" /></Button>
            <Button size="icon" variant="ghost" className="size-11" aria-label={`Copy link: ${l.label}`} onClick={() => copy(l.path)}><Copy className="size-4" /></Button>
          </div>
        ))}
      </div>
      <div className="receipt mt-3 rounded-xl border px-4 py-4 text-sm">
        <p className="font-medium">iPhone</p>
        <p className="mt-1 text-muted-foreground">iOS doesn&apos;t support app shortcuts for Home Screen web apps, so long-pressing the Fortis icon only shows Edit Home Screen and Remove. Two workarounds, each with a catch:</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-muted-foreground">
          <li><span className="text-foreground">Shortcuts app:</span> new shortcut → <span className="font-mono">Open URLs</span> → paste a copied link → Add to Home Screen. It opens in <span className="text-foreground">Safari</span>, not the Fortis app. Safari has its own sign-in and storage, so you sign in there once, and a workout running in the app won&apos;t show up in Safari.</li>
          <li><span className="text-foreground">Second icon:</span> open a link in Safari → Share → Add to Home Screen. iOS may treat it as a separate web app with its own sign-in and storage, the same catch as above.</li>
        </ol>
        <p className="mt-3 font-medium">Android, Chrome and Edge</p>
        <p className="mt-1 text-muted-foreground">Long-press (or right-click) the installed Fortis icon: Start workout, Start last routine, History, Records, Measure.</p>
        <p className="mt-3 text-xs text-muted-foreground">If a workout is already running, a start link opens it instead of starting a new one.</p>
      </div>
    </section>
  );
}
