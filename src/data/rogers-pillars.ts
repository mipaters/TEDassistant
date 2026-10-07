import { Network, ShieldCheck, Fingerprint, Radar, Signal, Heart } from "lucide-react";

export const rogersPillars = [
  {
    id: "network-intelligence",
    icon: Network,
    title: "Network Intelligence",
    description:
      "Rogers sees call, SMS, and data signals across its own network in real time — a vantage point no app-layer assistant has.",
    benefit: "Enables fraud and spam detection before a call even connects.",
  },
  {
    id: "device-trust",
    icon: ShieldCheck,
    title: "Device Trust",
    description:
      "Every device on the network is authenticated, profiled, and continuously risk-scored by Rogers' security infrastructure.",
    benefit: "Higher-confidence identity signals improve TED's decision accuracy.",
  },
  {
    id: "sim-verification",
    icon: Fingerprint,
    title: "SIM Verification",
    description:
      "SIM-level identity verification provides cryptographic proof of subscriber identity unavailable to third-party apps.",
    benefit: "Near-impossible for scammers to spoof a verified Rogers subscriber.",
  },
  {
    id: "fraud-signals",
    icon: Radar,
    title: "Fraud Signals",
    description:
      "Network-wide fraud telemetry — robocall patterns, SIM swap attempts, number spoofing — feeds directly into TED's models.",
    benefit: "Protection improves for every customer as the network learns.",
  },
  {
    id: "connectivity-insights",
    icon: Signal,
    title: "Connectivity Insights",
    description:
      "Real-time roaming, coverage, and network performance data lets TED give proactive, accurate travel and connectivity guidance.",
    benefit: "Differentiated travel and roaming experiences competitors can't match.",
  },
  {
    id: "customer-relationship",
    icon: Heart,
    title: "Customer Relationship",
    description:
      "Rogers already holds the billing relationship, household structure, and service history — the foundation of a trusted assistant.",
    benefit: "Faster trust, higher adoption, and durable customer loyalty.",
  },
];
