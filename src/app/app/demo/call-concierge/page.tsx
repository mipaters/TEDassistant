"use client";

import { Badge } from "@/components/ui/badge";
import { AppointmentScenario } from "@/components/scenarios/appointment-scenario";

export default function CallConciergeDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          Executive Demo · Call Concierge
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED answers so you don&apos;t have to</h1>
      </div>
      <AppointmentScenario />
    </div>
  );
}
