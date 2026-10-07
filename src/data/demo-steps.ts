export interface DemoStep {
  id: string;
  label: string;
  href: string;
  anchor?: string;
  durationMs: number;
}

export const demoSteps: DemoStep[] = [
  { id: "landing", label: "Welcome", href: "/", durationMs: 15_000 },
  { id: "app-home", label: "TED App Home", href: "/app/home", durationMs: 20_000 },
  { id: "call-concierge", label: "Call Concierge", href: "/app/demo/call-concierge", durationMs: 40_000 },
  { id: "scam-protection", label: "Scam Protection", href: "/app/demo/scam-protection", durationMs: 40_000 },
  { id: "package-delivery", label: "Package Delivery", href: "/app/demo/package-delivery", durationMs: 25_000 },
  { id: "family-safety", label: "Family Safety", href: "/app/demo/family-safety", durationMs: 30_000 },
  { id: "travel-assistant", label: "Travel Assistant", href: "/app/demo/travel", durationMs: 30_000 },
  { id: "subscription-advisor", label: "Subscription Advisor", href: "/app/demo/subscriptions", durationMs: 30_000 },
  { id: "chat-with-ted", label: "Chat with TED", href: "/app/chat", durationMs: 30_000 },
  { id: "why-rogers", label: "Why Rogers", href: "/internal/why-rogers", durationMs: 45_000 },
  { id: "architecture", label: "Architecture", href: "/internal/architecture", durationMs: 45_000 },
  { id: "dashboard", label: "Dashboard", href: "/internal/dashboard", durationMs: 30_000 },
];
