"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppointmentScenario } from "@/components/scenarios/appointment-scenario";
import { DeliveryScenario } from "@/components/scenarios/delivery-scenario";
import { Badge } from "@/components/ui/badge";

function CallConciergeContent() {
  const searchParams = useSearchParams();
  const initialScenario = searchParams.get("scenario") === "delivery" ? "delivery" : "appointment";
  const [scenario, setScenario] = React.useState(initialScenario);

  React.useEffect(() => {
    setScenario(initialScenario);
  }, [initialScenario]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          AI Call Concierge
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">TED answers so you don&apos;t have to</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Watch TED triage a real inbound call end-to-end &mdash; understanding intent, resolving
          the request, and reporting back with zero friction.
        </p>
        <Tabs value={scenario} onValueChange={setScenario} className="mt-2">
          <TabsList>
            <TabsTrigger value="appointment">Appointment Confirmation</TabsTrigger>
            <TabsTrigger value="delivery">Package Delivery</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={scenario}>
        <TabsContent value="appointment">
          <AppointmentScenario />
        </TabsContent>
        <TabsContent value="delivery">
          <DeliveryScenario />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CallConciergePage() {
  return (
    <Suspense fallback={null}>
      <CallConciergeContent />
    </Suspense>
  );
}
