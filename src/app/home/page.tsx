"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capabilityCards } from "@/data/capability-cards";
import { KpiDashboard } from "@/components/demo/kpi-dashboard";
import { useDemoMode } from "@/context/demo-mode-context";
import { customer } from "@/data/customer-data";

export default function HomePage() {
  const { startDemo, isActive } = useDemoMode();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0b0f1a] via-[#0d1120] to-[#120a16] px-6 py-14 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--rogers-red-bright)] opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--ted-blue)] opacity-15 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-start gap-6"
        >
          <Badge variant="outline" className="gap-1.5 border-[var(--rogers-red-bright)]/40 bg-white/5">
            <Sparkles className="h-3 w-3 text-[var(--rogers-red-bright)]" />
            Rogers Executive Briefing Center
          </Badge>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Your <span className="text-gradient-rogers">AI Concierge</span> for Everyday Life
          </h1>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Calls, messages, travel, family, subscriptions and security managed by a trusted AI
            assistant — built on Rogers&apos; network, device trust, and customer relationship.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={startDemo} disabled={isActive}>
              <Play className="h-4 w-4" />
              Start Executive Demo
            </Button>
            <Link href="/call-concierge">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Launch Call Concierge
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-full border border-border bg-black/30 px-4 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Demo profile: {customer.name} · {customer.services.join(" + ")} · Family of {customer.familySize}
          </div>
        </motion.div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Capabilities
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">Six ways TED earns trust every day</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <Card className="group h-full transition-transform hover:-translate-y-1 hover:glow-ring">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rogers-red-bright)]/20 to-[var(--ted-violet)]/20 text-[var(--rogers-red-bright)] ring-1 ring-[var(--rogers-red-bright)]/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                    <Link href={card.href}>
                      <Button variant="secondary" size="sm" className="w-full justify-between">
                        Launch Demo
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <KpiDashboard />
    </div>
  );
}
