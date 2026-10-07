"use client";

import { Badge } from "@/components/ui/badge";
import { TravelAssistantScenario } from "@/components/scenarios/travel-assistant-scenario";

export default function TravelAssistantPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge variant="info" className="w-fit">
          Travel Assistant
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Ready before you even pack</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          TED detects upcoming travel from your itinerary and proactively prepares everything
          you&apos;ll need abroad.
        </p>
      </div>
      <TravelAssistantScenario />
    </div>
  );
}
