import { AppShell } from "@/components/app-shell";
import { SettingsProvider, type UserSettings } from "@/components/settings-context";
import { requireUser } from "@/lib/auth";
import { getSettings, userTz } from "@/lib/services";
import { TzSync } from "@/components/tz-sync";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const u = await requireUser();
  const [s, tz] = await Promise.all([getSettings(u.id), userTz(u.id)]);
  return (
    <SettingsProvider value={{ unit: s.unit as UserSettings["unit"], tz }}>
      <TzSync stored={s.timezone ?? null} />
      <AppShell>{children}</AppShell>
    </SettingsProvider>
  );
}
