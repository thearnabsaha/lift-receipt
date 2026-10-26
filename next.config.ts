import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: false,
  // reuse visited tab payloads for 30s on back-and-forth taps; server actions (revalidatePath) still invalidate
  experimental: { staleTimes: { dynamic: 30, static: 180 } },
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withWorkflow(nextConfig);
