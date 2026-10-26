"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { importSharedRoutineAction } from "@/app/actions";

export function ImportButton({ token, signedIn }: { token: string; signedIn: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  if (!signedIn) return <Button asChild className="h-11 w-full"><Link href={`/sign-up?next=${encodeURIComponent(`/share/r/${token}`)}`}><Download className="size-4" />Import into Fortis</Link></Button>;
  return (
    <Button className="h-11 w-full active:translate-y-px" disabled={busy} onClick={async () => {
      setBusy(true);
      try { const r = await importSharedRoutineAction(token); toast.success(`Added “${r.name}” to your routines`); router.push(`/routines/${r.id}`); }
      catch { toast.error("Could not import this routine"); setBusy(false); }
    }}><Download className="size-4" />{busy ? "Importing…" : "Import into Fortis"}</Button>
  );
}
