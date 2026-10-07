"use client";

import { Badge } from "@/components/ui/badge";
import { ScamScenario } from "@/components/scenarios/scam-scenario";

export default function ScamProtectionPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge variant="destructive" className="w-fit">
          Scam Protection
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Fraud stopped before it reaches you</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          TED analyzes conversational patterns in real time — urgency language, unverifiable
          identity, and social engineering — to block high-risk calls automatically.
        </p>
      </div>
      <ScamScenario />
    </div>
  );
}
