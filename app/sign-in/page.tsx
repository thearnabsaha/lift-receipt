import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Sign in" };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) { return <AuthForm mode="sign-in" next={(await searchParams).next} />; }
