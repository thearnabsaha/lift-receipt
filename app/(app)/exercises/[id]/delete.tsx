"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteExerciseAction } from "@/app/actions";
export function DeleteExercise({ id }: { id: string }) {
  const router = useRouter();
  return <Button variant="outline" size="sm" onClick={async () => { if (!confirm("Delete this custom exercise? Past workouts keep their sets.")) return; await deleteExerciseAction(id); toast.success("Deleted"); router.push("/exercises"); }}><Trash2 className="size-4" />Delete</Button>;
}
