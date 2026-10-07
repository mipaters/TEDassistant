"use client";

import { Badge } from "@/components/ui/badge";
import { ScamScenario } from "@/components/scenarios/scam-scenario";

export default function ScamProtectionDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="destructive" className="w-fit">
          Executive Demo · Scam Protection
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Fraud stopped before it reaches you</h1>
      </div>
      <ScamScenario />
    </div>
  );
}
