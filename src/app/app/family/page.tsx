"use client";

import { Badge } from "@/components/ui/badge";
import { FamilySafetyScenario } from "@/components/scenarios/family-safety-scenario";

export default function FamilyPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="warning" className="w-fit">
          Family Safety
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED knows which calls need you</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Trusted institutions like schools are recognized instantly and escalated as high
          priority.
        </p>
      </div>
      <FamilySafetyScenario />
    </div>
  );
}
