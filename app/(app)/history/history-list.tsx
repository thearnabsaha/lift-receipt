"use client";
import { useRef } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { SwipeRow } from "@/components/swipe-row";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteWorkout, usePendingDeletes } from "@/components/delete-workout";
import { hideDeleted } from "@/lib/delete-queue";

export type Row = { id: string; name: string; date: string; month: string; card: React.ReactNode };

/** History list: swipe left / long-press / ⋯ menu to delete. Pending deletes are hidden immediately. */
export function HistoryList({ rows }: { rows: Row[] }) {
  const pending = usePendingDeletes();
  const { ask, dialog } = useDeleteWorkout();
  const visible = hideDeleted(rows, pending);
  const months = [...new Set(visible.map((r) => r.month))];
  return (
    <>
      {months.map((m) => { const ws = visible.filter((r) => r.month === m); return (
        <section key={m} className="mb-8">
          <p className="mono-label mb-3">{m} · {ws.length}</p>
          <div className="space-y-3">{ws.map((r) => <HistoryRow key={r.id} r={r} onDelete={() => ask({ id: r.id, name: r.name, date: r.date })} />)}</div>
        </section>
      ); })}
      {dialog}
    </>
  );
}

function HistoryRow({ r, onDelete }: { r: Row; onDelete: () => void }) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const clear = () => { if (t.current) clearTimeout(t.current); t.current = null; };
  return (
    <div className="relative" data-testid="history-row"
      onPointerDown={(e) => { if (e.pointerType === "mouse") return; fired.current = false; clear(); t.current = setTimeout(() => { fired.current = true; try { navigator.vibrate?.(10); } catch {} onDelete(); }, 600); }}
      onPointerMove={clear} onPointerUp={clear} onPointerCancel={clear}
      onClickCapture={(e) => { if (fired.current) { fired.current = false; e.preventDefault(); e.stopPropagation(); } }}
      onContextMenu={(e) => { e.preventDefault(); clear(); onDelete(); }}>
      <SwipeRow onDelete={onDelete} label="Delete workout" className="rounded-xl bg-transparent [-webkit-touch-callout:none]">{r.card}</SwipeRow>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Workout options" className="absolute right-2 top-2 z-10 inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
        <DropdownMenuContent align="end"><DropdownMenuItem variant="destructive" onClick={onDelete}><Trash2 className="size-4" />Delete workout</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
