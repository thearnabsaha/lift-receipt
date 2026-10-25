import { AppShell } from "@/components/app-shell";
import { SettingsProvider, type UserSettings } from "@/components/settings-context";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/services";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const u = await requireUser();
  const s = await getSettings(u.id);
  return (
    <SettingsProvider value={{ unit: s.unit as UserSettings["unit"], restSec: s.restSec, autoRest: s.autoRest }}>
      <AppShell>{children}</AppShell>
    </SettingsProvider>
  );
}
