import { sweepIdle } from "@/lib/push";

// Daily backup sweep (Vercel Hobby crons run once a day). The workflow timer is the primary path.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("unauthorized", { status: 401 });
  return Response.json(await sweepIdle());
}
