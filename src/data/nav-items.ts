import {
  Home,
  PhoneCall,
  ShieldAlert,
  Users,
  Plane,
  Wallet,
  Building2,
  Network,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  description: string;
}

export const navItems: NavItem[] = [
  { href: "/home", label: "Home", icon: Home, description: "Overview & capabilities" },
  { href: "/call-concierge", label: "Call Concierge", icon: PhoneCall, description: "AI-handled calls" },
  { href: "/scam-protection", label: "Scam Protection", icon: ShieldAlert, description: "Fraud detection" },
  { href: "/family-safety", label: "Family Safety", icon: Users, description: "Trusted escalation" },
  { href: "/travel-assistant", label: "Travel Assistant", icon: Plane, description: "Roaming & itinerary" },
  { href: "/subscription-advisor", label: "Subscription Advisor", icon: Wallet, description: "Spend optimization" },
  { href: "/why-rogers", label: "Why Rogers", icon: Building2, description: "Strategic advantage" },
  { href: "/architecture", label: "Architecture", icon: Network, description: "Technical blueprint" },
];
