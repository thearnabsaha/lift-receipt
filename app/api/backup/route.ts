import { getSession } from "@/lib/auth";
import { exportBackup } from "@/lib/data-io";

export async function GET() {
  const s = await getSession();
  if (!s) return new Response("unauthorized", { status: 401 });
  const b = await exportBackup(s.user.id);
  return new Response(JSON.stringify(b), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "content-disposition": `attachment; filename="fortis-backup-${b.exportedAt.slice(0, 10)}.json"` },
  });
}
