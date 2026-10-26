"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { setFavoriteAction } from "@/app/actions";
import { cn } from "@/lib/utils";

type Fav = { has: (id: string) => boolean; toggle: (id: string) => void };
const Ctx = createContext<Fav | null>(null);

/** Optimistic favourites: flips instantly, syncs in the background, reverts on failure. */
export function useFavoriteSet(initial: string[]): Fav {
  const [set, setSet] = useState(() => new Set(initial));
  const ref = useRef(set);
  useEffect(() => { ref.current = set; }, [set]);
  const toggle = useCallback((id: string) => {
    const next = !ref.current.has(id);
    const flip = (on: boolean) => setSet((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n; });
    flip(next);
    setFavoriteAction(id, next).catch(() => { flip(!next); toast.error(navigator.onLine ? "Could not update favourite" : "Offline: favourite not saved"); });
  }, []);
  return useMemo(() => ({ has: (id: string) => set.has(id), toggle }), [set, toggle]);
}
export function FavoritesProvider({ value, children }: { value: Fav; children: React.ReactNode }) { return <Ctx.Provider value={value}>{children}</Ctx.Provider>; }
export const useFavorites = () => useContext(Ctx);

export function FavoriteStar({ id, fav: favP, onToggle, className }: { id: string; fav?: boolean; onToggle?: () => void; className?: string }) {
  const ctx = useFavorites();
  const fav = favP ?? ctx?.has(id) ?? false;
  return (
    <button type="button" aria-label={fav ? "Remove from favourites" : "Add to favourites"} aria-pressed={fav}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); (onToggle ?? (() => ctx?.toggle(id)))(); }}
      className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted active:scale-90", fav && "text-foreground", className)}>
      <Star className={cn("size-4", fav && "fill-current")} />
    </button>
  );
}

/** Standalone star (exercise detail page). */
export function FavoriteToggle({ id, initial }: { id: string; initial: boolean }) {
  const f = useFavoriteSet(initial ? [id] : []);
  return <FavoriteStar id={id} fav={f.has(id)} onToggle={() => f.toggle(id)} className="size-10 border" />;
}
