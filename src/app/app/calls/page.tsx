"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppointmentScenario } from "@/components/scenarios/appointment-scenario";
import { DeliveryScenario } from "@/components/scenarios/delivery-scenario";
import { ScamScenario } from "@/components/scenarios/scam-scenario";
import { Badge } from "@/components/ui/badge";

type Tab = "appointment" | "scam" | "delivery";

function CallsContent() {
  const searchParams = useSearchParams();
  const param = searchParams.get("tab");
  const initial: Tab = param === "scam" ? "scam" : param === "delivery" ? "delivery" : "appointment";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    setTab(initial);
  }, [initial]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          Call Concierge &amp; Scam Protection
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED answers so you don&apos;t have to</h1>
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="appointment" className="flex-1">
              Appointment
            </TabsTrigger>
            <TabsTrigger value="scam" className="flex-1">
              Scam
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex-1">
              Delivery
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={tab}>
        <TabsContent value="appointment">
          <AppointmentScenario />
        </TabsContent>
        <TabsContent value="scam">
          <ScamScenario />
        </TabsContent>
        <TabsContent value="delivery">
          <DeliveryScenario />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CallsPage() {
  return (
    <Suspense fallback={null}>
      <CallsContent />
    </Suspense>
  );
}
