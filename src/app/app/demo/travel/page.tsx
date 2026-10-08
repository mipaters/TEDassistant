"use client";

import { Badge } from "@/components/ui/badge";
import { TravelAssistantScenario } from "@/components/scenarios/travel-assistant-scenario";

export default function TravelDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="info" className="w-fit">
          Executive Demo · Travel Assistant
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Ready before you even pack</h1>
      </div>
      <TravelAssistantScenario />
    </div>
  );
}
