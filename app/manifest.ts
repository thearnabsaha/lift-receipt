import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Fortis — Workout Tracker",
    short_name: "Fortis",
    description: "Fast gym log: sets, rest timer, PRs, progress charts. Works offline.",
    start_url: "/workout?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    // Android/desktop Chrome & Edge show these on long-press / right-click. iOS Safari ignores manifest shortcuts.
    shortcuts: [
      { name: "Start workout", short_name: "Start", url: "/workout?start=1", icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96" }] },
      { name: "Start last routine", short_name: "Last routine", url: "/workout?routine=last", icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96" }] },
      { name: "History", url: "/history", icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96" }] },
      { name: "Records", url: "/records", icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96" }] },
      { name: "Measure", url: "/measure", icons: [{ src: "/icons/shortcut-96.png", sizes: "96x96" }] },
    ],
  };
}
