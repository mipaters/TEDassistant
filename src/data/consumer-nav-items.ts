import { Home, PhoneCall, Users, Plane } from "lucide-react";

export interface ConsumerTab {
  href: string;
  label: string;
  icon: typeof Home;
}

// Note: the "Chat with TED" tab is rendered separately as the raised center
// button in ConsumerShell, splitting this list left/right around it.
export const consumerTabs: ConsumerTab[] = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/calls", label: "Calls", icon: PhoneCall },
  { href: "/app/family", label: "Family", icon: Users },
  { href: "/app/travel", label: "Travel", icon: Plane },
];
