"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Only same-origin paths ("/x", never "//host"). */
const safeNext = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : null);
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

export function AuthForm({ mode, next: rawNext }: { mode: "sign-in" | "sign-up"; next?: string | string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const next = safeNext(typeof rawNext === "string" ? rawNext : null);
  const q = next ? `?next=${encodeURIComponent(next)}` : "";
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setLoading(true);
    const res = mode === "sign-up"
      ? await authClient.signUp.email({ email, password, name: String(f.get("name") || email.split("@")[0]) })
      : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (res.error) return toast.error(res.error.message ?? "Something went wrong");
    router.push(next ?? "/workout"); router.refresh();
  };
  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="receipt w-full max-w-sm rounded-xl border px-6 py-9 shadow-[0_1px_3px_#0000001a]">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight">{mode === "sign-in" ? "Welcome back" : "Create your account"}</h1>
        <p className="mono-label mt-1 text-center">{mode === "sign-in" ? "Sign in to keep logging" : "Free. No card. Ever."}</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "sign-up" && <div className="space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" /></div>}
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div>
          <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} /></div>
          <Button className="h-10 w-full active:translate-y-px" disabled={loading}>{loading ? "…" : mode === "sign-in" ? "Sign in" : "Create account"}</Button>
        </form>
        <div className="tear my-5" />
        <p className="text-center text-sm text-muted-foreground">
          {mode === "sign-in" ? <>New here? <Link className="text-foreground underline" href={`/sign-up${q}`}>Create an account</Link></> : <>Have an account? <Link className="text-foreground underline" href={`/sign-in${q}`}>Sign in</Link></>}
        </p>
      </div>
    </div>
  );
}
