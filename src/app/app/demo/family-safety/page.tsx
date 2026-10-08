"use client";

import { Badge } from "@/components/ui/badge";
import { FamilySafetyScenario } from "@/components/scenarios/family-safety-scenario";

export default function FamilySafetyDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="warning" className="w-fit">
          Executive Demo · Family Safety
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED knows which calls need you</h1>
      </div>
      <FamilySafetyScenario />
    </div>
  );
}
