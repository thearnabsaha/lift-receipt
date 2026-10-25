import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 60, cookieCache: { enabled: true, maxAge: 300 } },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "", process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""].filter(Boolean),
  plugins: [nextCookies()],
});

/** One session lookup per request (layout + page share it); served from the signed cookie cache, no DB hit. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function requireUser() {
  const s = await getSession();
  if (!s) redirect("/sign-in");
  return s.user;
}
