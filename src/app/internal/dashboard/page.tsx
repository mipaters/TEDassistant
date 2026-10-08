"use client";

import { Badge } from "@/components/ui/badge";
import { KpiDashboard } from "@/components/demo/kpi-dashboard";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <Badge variant="outline" className="w-fit border-emerald-500/40 bg-white/5">
        Executive Dashboard
      </Badge>
      <KpiDashboard />
    </div>
  );
}
