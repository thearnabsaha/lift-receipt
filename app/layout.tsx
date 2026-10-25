import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PwaRegister } from "@/components/pwa";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// iPhone splash sizes (CSS px + DPR); 428x926@3 = iPhone 14 Plus / 13 Pro Max / 12 Pro Max. Regenerate: node scripts/gen-ios-assets.mjs
const SPLASH: [number, number, number][] = [[428, 926, 3], [430, 932, 3], [393, 852, 3], [390, 844, 3], [375, 812, 3], [414, 896, 2], [375, 667, 2]];

export const metadata: Metadata = {
  title: { default: "Lift Receipt · Workout tracker & gym log", template: "%s · Lift Receipt" },
  description: "Log sets, reps and weights. Routines, rest timer, PRs, progress charts. Every workout printed like a receipt. Free forever.",
  applicationName: "Lift Receipt",
  // "default" = opaque status bar that follows the light/dark system appearance on iOS, so it always matches the theme
  appleWebApp: {
    capable: true, title: "Lift Receipt", statusBarStyle: "default",
    startupImage: SPLASH.flatMap(([w, h, d]) => (["light", "dark"] as const).map((t) => ({
      url: `/splash/${w}x${h}@${d}-${t}.png`,
      media: `screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait) and (prefers-color-scheme: ${t})`,
    }))),
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#070707" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-center" richColors={false} />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
