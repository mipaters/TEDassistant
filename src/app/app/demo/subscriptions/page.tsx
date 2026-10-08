"use client";

import { Badge } from "@/components/ui/badge";
import { SubscriptionAdvisorScenario } from "@/components/scenarios/subscription-advisor-scenario";

export default function SubscriptionsDemoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Executive Demo · Subscription Advisor
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Stop paying for what you don&apos;t use</h1>
      </div>
      <SubscriptionAdvisorScenario />
    </div>
  );
}
