import { Home, PhoneCall, Users, Plane, Wallet } from "lucide-react";

export interface ConsumerTab {
  href: string;
  label: string;
  icon: typeof Home;
}

export const consumerTabs: ConsumerTab[] = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/calls", label: "Calls", icon: PhoneCall },
  { href: "/app/family", label: "Family", icon: Users },
  { href: "/app/travel", label: "Travel", icon: Plane },
  { href: "/app/subscriptions", label: "Bills", icon: Wallet },
];
