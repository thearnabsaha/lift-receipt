import Link from "next/link";
import { Logo } from "@/components/logo";
export const metadata = { title: "Offline" };
export default function Offline() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="receipt w-full max-w-sm rounded-xl border px-6 py-9 text-center">
        <div className="flex justify-center"><Logo /></div>
        <p className="mono-label mt-5">No connection</p>
        <h1 className="mt-1 text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-muted-foreground">An active workout keeps running on this device. Finished workouts are queued and sync automatically when you&apos;re back online.</p>
        <Link href="/workout/active" className="mt-5 inline-block text-sm underline">Open active workout</Link>
      </div>
    </div>
  );
}
