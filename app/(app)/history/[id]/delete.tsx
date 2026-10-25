"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteWorkout } from "@/components/delete-workout";

export function DeleteWorkout({ id, name, date }: { id: string; name: string; date: string }) {
  const router = useRouter();
  const { ask, dialog } = useDeleteWorkout(() => router.push("/history"));
  return (
    <>
      <Button variant="outline" size="sm" className="h-9 text-destructive" onClick={() => ask({ id, name, date })}><Trash2 className="size-4" />Delete workout</Button>
      {dialog}
    </>
  );
}
