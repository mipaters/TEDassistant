import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      { source: "/home", destination: "/app/home", permanent: false },
      { source: "/call-concierge", destination: "/app/calls", permanent: false },
      { source: "/scam-protection", destination: "/app/calls?tab=scam", permanent: false },
      { source: "/family-safety", destination: "/app/family", permanent: false },
      { source: "/travel-assistant", destination: "/app/travel", permanent: false },
      { source: "/subscription-advisor", destination: "/app/subscriptions", permanent: false },
      { source: "/why-rogers", destination: "/internal/why-rogers", permanent: false },
      { source: "/architecture", destination: "/internal/architecture", permanent: false },
    ];
  },
};

export default nextConfig;
