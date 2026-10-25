import { requireUser } from "@/lib/auth";
import { getSettings, listMeasurements, MEASUREMENT_KINDS } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { MeasureClient } from "./client";

export const metadata = { title: "Measure" };
export default async function MeasurePage() {
  const u = await requireUser();
  const [list, s] = await Promise.all([listMeasurements(u.id), getSettings(u.id)]);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader label="Body" title="Measurements" subtitle="Bodyweight, body fat and tape measurements." />
      <MeasureClient unit={s.unit as "kg" | "lb"} kinds={[...MEASUREMENT_KINDS]} rows={list.map((m) => ({ id: m.id, kind: m.kind, value: m.value, date: m.date.toISOString() }))} />
    </div>
  );
}
