import { PhoneCall, ShieldAlert, Users, Plane, Wallet, Network } from "lucide-react";

export const capabilityCards = [
  {
    id: "call-concierge",
    title: "AI Call Concierge",
    description:
      "TED answers unknown calls, understands intent, and resolves routine requests like appointment confirmations without interrupting you.",
    icon: PhoneCall,
    href: "/call-concierge",
  },
  {
    id: "scam-protection",
    title: "Scam Protection",
    description:
      "Real-time conversational analysis detects social engineering and urgency tactics, scoring and blocking fraud before it reaches you.",
    icon: ShieldAlert,
    href: "/scam-protection",
  },
  {
    id: "family-safety",
    title: "Family Safety",
    description:
      "TED recognizes trusted institutions like schools and escalates urgent, high-priority calls directly to you — instantly.",
    icon: Users,
    href: "/family-safety",
  },
  {
    id: "travel-assistant",
    title: "Travel Assistant",
    description:
      "Flying tomorrow? TED proactively prepares roaming plans, flight status, reminders, weather, and currency guidance.",
    icon: Plane,
    href: "/travel-assistant",
  },
  {
    id: "subscription-advisor",
    title: "Subscription Advisor",
    description:
      "TED audits streaming and service subscriptions, flags unused spend, and recommends savings opportunities automatically.",
    icon: Wallet,
    href: "/subscription-advisor",
  },
  {
    id: "network-intelligence",
    title: "Network Intelligence",
    description:
      "Built on Rogers' network, device trust, and SIM verification signals — advantages no over-the-top assistant can replicate.",
    icon: Network,
    href: "/architecture",
  },
];
