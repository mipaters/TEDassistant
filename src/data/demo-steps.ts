export interface DemoStep {
  id: string;
  label: string;
  href: string;
  anchor?: string;
  durationMs: number;
}

export const demoSteps: DemoStep[] = [
  { id: "home", label: "Home", href: "/home", durationMs: 20_000 },
  { id: "call-concierge", label: "Call Concierge", href: "/call-concierge", durationMs: 45_000 },
  { id: "scam-protection", label: "Scam Protection", href: "/scam-protection", durationMs: 45_000 },
  { id: "package-delivery", label: "Package Delivery", href: "/call-concierge?scenario=delivery", durationMs: 30_000 },
  { id: "family-safety", label: "Family Safety", href: "/family-safety", durationMs: 30_000 },
  { id: "travel-assistant", label: "Travel Assistant", href: "/travel-assistant", durationMs: 30_000 },
  { id: "subscription-advisor", label: "Subscription Advisor", href: "/subscription-advisor", durationMs: 30_000 },
  { id: "why-rogers", label: "Why Rogers", href: "/why-rogers", durationMs: 45_000 },
  { id: "architecture", label: "Architecture", href: "/architecture", durationMs: 45_000 },
  { id: "dashboard", label: "Dashboard", href: "/home", anchor: "kpi-dashboard", durationMs: 30_000 },
];
