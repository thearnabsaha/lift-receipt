import { headers } from "next/headers";
import { requireUser } from "@/lib/auth";
import { getSettings, listApiKeys } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { SettingsClient } from "./client";

export const metadata = { title: "Settings" };
export default async function SettingsPage() {
  const u = await requireUser();
  const [s, keys, h] = await Promise.all([getSettings(u.id), listApiKeys(u.id), headers()]);
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader label="Preferences" title="Settings" />
      <SettingsClient email={u.email} settings={{ unit: s.unit as "kg" | "lb", timezoneOverride: s.timezoneOverride ?? null }} mcpUrl={`${proto}://${host}/api/mcp`}
        keys={keys.map((k) => ({ ...k, createdAt: k.createdAt.toISOString(), lastUsedAt: k.lastUsedAt?.toISOString() ?? null, revokedAt: k.revokedAt?.toISOString() ?? null }))} />
    </div>
  );
}
