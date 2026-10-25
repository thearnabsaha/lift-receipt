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
  title: { default: "Fortis · Workout tracker & gym log", template: "%s · Fortis" },
  description: "Log sets, reps and weights. Routines, rest timer, PRs, progress charts. Every workout printed like a receipt. Free forever.",
  applicationName: "Fortis",
  // "default" = opaque status bar that follows the light/dark system appearance on iOS, so it always matches the theme
  appleWebApp: {
    capable: true, title: "Fortis", statusBarStyle: "default",
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
        {/* Next 16 only emits mobile-web-app-capable; iOS needs the apple- prefixed tag for launch images */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* iOS launch images: rendered directly in <head> (not streamed metadata). Plain portrait links first
            (widest iOS support), then dark-mode variants. Must be exact pixel sizes. */}
        {SPLASH.map(([w, h, d]) => <link key={`${w}${d}`} rel="apple-touch-startup-image" href={`/splash/${w}x${h}@${d}-light.png`}
          media={`screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)`} />)}
        {SPLASH.map(([w, h, d]) => <link key={`${w}${d}d`} rel="apple-touch-startup-image" href={`/splash/${w}x${h}@${d}-dark.png`}
          media={`screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait) and (prefers-color-scheme: dark)`} />)}
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
