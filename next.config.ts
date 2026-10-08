import type { NextConfig } from "next";

// Deployed as a static export (Azure Static Web Apps free tier has no Node
// server to run). Legacy top-level route redirects (e.g. /home -> /app/home)
// can't be expressed with next.config's `redirects()` in static-export mode,
// so they're handled instead by the `routes` block in
// public/staticwebapp.config.json, which Azure Static Web Apps serves at the
// host level.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
