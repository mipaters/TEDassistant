import { PhoneCall, ShieldAlert, Users, Plane, Wallet, MessageCircle } from "lucide-react";

export const capabilityCards = [
  {
    id: "call-concierge",
    title: "AI Call Concierge",
    description:
      "TED answers unknown calls, understands intent, and resolves routine requests like appointment confirmations without interrupting you.",
    icon: PhoneCall,
    href: "/app/calls?tab=concierge",
  },
  {
    id: "scam-protection",
    title: "Scam Protection",
    description:
      "Real-time conversational analysis detects social engineering and urgency tactics, scoring and blocking fraud before it reaches you.",
    icon: ShieldAlert,
    href: "/app/calls?tab=scam",
  },
  {
    id: "family-safety",
    title: "Family Services",
    description:
      "TED manages Wi-Fi schedules, content filtering, calendar alerts, and reminders — coordinating directly with Rogers and your family calendar.",
    icon: Users,
    href: "/app/family",
  },
  {
    id: "travel-assistant",
    title: "Travel Assistant",
    description:
      "Flying tomorrow? TED proactively prepares roaming plans, flight status, reminders, weather, and currency guidance.",
    icon: Plane,
    href: "/app/travel",
  },
  {
    id: "subscription-advisor",
    title: "Subscription Advisor",
    description:
      "TED audits streaming and service subscriptions, flags unused spend, and recommends savings opportunities automatically.",
    icon: Wallet,
    href: "/app/subscriptions",
  },
  {
    id: "chat-with-ted",
    title: "Chat with TED",
    description:
      "Ask TED to schedule service, improve your plan, or compare providers — and it gets the work done for you.",
    icon: MessageCircle,
    href: "/app/chat",
  },
];
