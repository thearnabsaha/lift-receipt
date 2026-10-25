import { PageHeader } from "@/components/app-shell";
import { Tools } from "./tools";
export const metadata = { title: "Tools" };
export default function ToolsPage() {
  return <div className="mx-auto max-w-3xl"><PageHeader label="Calculators" title="Tools" subtitle="Plate loading and one-rep max." /><Tools /></div>;
}
