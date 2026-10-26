import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Sign up" };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) { return <AuthForm mode="sign-up" next={(await searchParams).next} />; }
