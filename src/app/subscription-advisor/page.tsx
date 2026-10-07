"use client";

import { Badge } from "@/components/ui/badge";
import { SubscriptionAdvisorScenario } from "@/components/scenarios/subscription-advisor-scenario";

export default function SubscriptionAdvisorPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Subscription Advisor
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Stop paying for what you don&apos;t use</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          TED continuously analyzes subscription usage across the household and recommends
          concrete savings — building trust while creating marketplace upsell opportunities.
        </p>
      </div>
      <SubscriptionAdvisorScenario />
    </div>
  );
}
