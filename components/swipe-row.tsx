"use client";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const REVEAL = 88;
/** Row that swipes left to reveal Delete; a long swipe deletes. Vertical scroll stays native (touch-action: pan-y). */
export function SwipeRow({ onDelete, className, children, disabled, label = "Delete set" }: { onDelete: () => void; label?: string; className?: string; children: React.ReactNode; disabled?: boolean }) {
  const [x, setX] = useState(0);
  const [anim, setAnim] = useState(true);
  const g = useRef<{ sx: number; sy: number; base: number; drag: boolean | null; id: number; w: number } | null>(null);
  const suppress = useRef(false);
  const el = useRef<HTMLDivElement>(null);

  const down = (e: React.PointerEvent) => {
    if (disabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    g.current = { sx: e.clientX, sy: e.clientY, base: x, drag: null, id: e.pointerId, w: el.current?.offsetWidth ?? 320 };
  };
  const move = (e: React.PointerEvent) => {
    const s = g.current; if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.sx, dy = e.clientY - s.sy;
    if (s.drag === null) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3 && (dx < 0 || s.base < 0)) {
        s.drag = true; setAnim(false);
        try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
        (document.activeElement as HTMLElement | null)?.blur?.();
      } else if (Math.abs(dy) > 10) { s.drag = false; }
    }
    if (s.drag) { e.preventDefault(); setX(Math.min(0, Math.max(-s.w, s.base + dx))); }
  };
  const up = (e: React.PointerEvent) => {
    const s = g.current; g.current = null; if (!s || s.id !== e.pointerId) return;
    if (!s.drag) { if (s.base < 0 && s.drag === null) { setAnim(true); setX(0); suppress.current = true; } return; }
    suppress.current = true; setAnim(true);
    if (x < -s.w * 0.55) { setX(-s.w); setTimeout(() => { onDelete(); setAnim(false); setX(0); }, 160); }
    else setX(x < -REVEAL / 2 ? -REVEAL : 0);
  };
  return (
    <div ref={el} className={cn("relative overflow-hidden", label === "Delete set" ? "rounded-md" : "rounded-xl")} data-swipe-row>
      {x < 0 && <button type="button" aria-label={label}
        onClick={onDelete}
        className="absolute inset-y-0 right-0 flex items-center justify-end gap-1.5 bg-destructive pr-5 text-sm font-medium text-white"
        style={{ width: Math.max(REVEAL, -x) }}>
        <Trash2 className="size-4" />Delete
      </button>}
      <div
        className={cn("relative touch-pan-y bg-card", anim && "transition-transform duration-150 ease-out", className)}
        style={{ transform: `translate3d(${x}px,0,0)` }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { g.current = null; setAnim(true); setX((v) => (v < -REVEAL / 2 ? -REVEAL : 0)); }}
        onClickCapture={(e) => { if (suppress.current) { suppress.current = false; e.stopPropagation(); e.preventDefault(); } }}
      >
        {children}
      </div>
    </div>
  );
}
