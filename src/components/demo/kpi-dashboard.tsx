"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { kpiMetrics } from "@/data/customer-data";

export function KpiDashboard() {
  return (
    <section id="kpi-dashboard" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
          Executive KPI Dashboard
        </p>
        <h2 className="text-2xl font-bold sm:text-3xl">Measurable business impact</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Projected outcomes based on pilot modeling across Rogers&apos; consumer wireless base.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiMetrics.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gradient-rogers">
                    {kpi.value}
                    {kpi.unit}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
