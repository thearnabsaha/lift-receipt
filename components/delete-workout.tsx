"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cancelDelete, pendingDeletes, scheduleDelete } from "@/lib/offline";
import { UNDO_MS, type PendingDelete } from "@/lib/delete-queue";

export type DelTarget = { id: string; name: string; date: string };
const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

/** Ids waiting in the delete queue (hidden from lists until the server confirms). */
export function usePendingDeletes() {
  const [q, setQ] = useState<PendingDelete[]>([]);
  useEffect(() => {
    const up = () => { pendingDeletes().then(setQ).catch(() => {}); };
    up(); window.addEventListener("lr-deletes", up);
    return () => window.removeEventListener("lr-deletes", up);
  }, []);
  return q;
}

/** Refresh server-rendered stats/lists once queued deletes land. Mounted once in the app shell. */
export function DeletesSync() {
  const router = useRouter();
  useEffect(() => {
    let last = -1;
    const up = () => pendingDeletes().then((q) => { if (last !== -1 && q.length < last) router.refresh(); last = q.length; }).catch(() => {});
    up(); window.addEventListener("lr-deletes", up);
    return () => window.removeEventListener("lr-deletes", up);
  }, [router]);
  return null;
}

/** Confirm dialog + deferred delete with Undo toast. */
export function useDeleteWorkout(after?: () => void) {
  const [t, setT] = useState<DelTarget | null>(null);
  const router = useRouter();
  const confirm = useCallback(async (w: DelTarget) => {
    await scheduleDelete(w.id);
    after?.();
    toast(`Deleted “${w.name}”`, { id: `del-${w.id}`, duration: UNDO_MS, description: navigator.onLine ? undefined : "Offline: deletes when you're back online.",
      action: { label: "Undo", onClick: () => { void cancelDelete(w.id).then(() => router.refresh()); } } });
  }, [after, router]);
  const dialog = (
    <AlertDialog open={!!t} onOpenChange={(o) => !o && setT(null)}>
      <AlertDialogContent data-testid="delete-workout-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workout?</AlertDialogTitle>
          <AlertDialogDescription>{t ? <><span className="font-medium text-foreground">{t.name}</span> · {fmt(t.date)}<br />This can&apos;t be undone. Stats and PRs will be recalculated.</> : null}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => { if (t) void confirm(t); setT(null); }}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return { ask: setT, dialog };
}
