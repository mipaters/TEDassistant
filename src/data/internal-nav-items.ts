import { Building2, Network, BarChart3 } from "lucide-react";

export interface InternalNavItem {
  href: string;
  label: string;
  icon: typeof Building2;
  description: string;
}

export const internalNavItems: InternalNavItem[] = [
  { href: "/internal/why-rogers", label: "Why Rogers", icon: Building2, description: "Strategic advantage" },
  { href: "/internal/architecture", label: "Architecture", icon: Network, description: "Technical blueprint" },
  { href: "/internal/dashboard", label: "KPI Dashboard", icon: BarChart3, description: "Business impact" },
];
