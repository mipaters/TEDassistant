"use client";

import { Badge } from "@/components/ui/badge";
import { DeliveryScenario } from "@/components/scenarios/delivery-scenario";

export default function PackageDeliveryDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          Executive Demo · Routine Calls
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Zero human involvement required</h1>
      </div>
      <DeliveryScenario />
    </div>
  );
}
