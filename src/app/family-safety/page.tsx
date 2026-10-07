"use client";

import { Badge } from "@/components/ui/badge";
import { FamilySafetyScenario } from "@/components/scenarios/family-safety-scenario";

export default function FamilySafetyPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge variant="warning" className="w-fit">
          Family Safety
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">TED knows which calls need you</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Trusted institutions like schools are recognized instantly and escalated as high
          priority — TED never silently handles what matters most to your family.
        </p>
      </div>
      <FamilySafetyScenario />
    </div>
  );
}
