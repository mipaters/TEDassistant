"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Smartphone, Building2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "@/context/demo-mode-context";
import { customer } from "@/data/customer-data";

export default function LandingPage() {
  const { startDemo, isActive } = useDemoMode();

  return (
    <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 overflow-hidden px-4 py-16 text-center">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--rogers-red-bright)] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--ted-blue)] opacity-15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-5"
      >
        <Badge variant="outline" className="gap-1.5 border-[var(--rogers-red-bright)]/40 bg-white/5">
          <Sparkles className="h-3 w-3 text-[var(--rogers-red-bright)]" />
          Rogers Executive Briefing Center
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          <span className="text-gradient-rogers">TED</span> — Your Trusted Everyday Digital Assistant
        </h1>

        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Calls, messages, travel, family, subscriptions and security managed by a trusted AI
          assistant — built on Rogers&apos; network, device trust, and customer relationship.
        </p>

        <Button size="lg" onClick={startDemo} disabled={isActive}>
          <Play className="h-4 w-4" />
          Start Executive Demo
        </Button>

        <div className="mt-2 flex items-center gap-3 rounded-full border border-border bg-black/30 px-4 py-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Demo profile: {customer.name} · {customer.services.join(" + ")} · Family of {customer.familySize}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <Link href="/app/home">
          <Card className="group h-full cursor-pointer transition-transform hover:-translate-y-1 hover:glow-ring">
            <CardContent className="flex h-full flex-col gap-4 p-8 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rogers-red-bright)]/20 to-[var(--ted-violet)]/20 text-[var(--rogers-red-bright)] ring-1 ring-[var(--rogers-red-bright)]/20">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Experience the TED App</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  See TED exactly as a customer would — a phone-based assistant that screens
                  calls, blocks scams, protects family, plans travel, optimizes bills, and takes
                  action through natural conversation.
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-[var(--rogers-red-bright)]">
                Launch the consumer app
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/why-rogers">
          <Card className="group h-full cursor-pointer transition-transform hover:-translate-y-1 hover:glow-ring">
            <CardContent className="flex h-full flex-col gap-4 p-8 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--ted-blue)]/20 to-[var(--ted-violet)]/20 text-[var(--ted-blue)] ring-1 ring-[var(--ted-blue)]/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Rogers Internal Briefing</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The executive view: why Rogers is uniquely positioned to deliver TED, the
                  underlying Microsoft/Azure architecture, and the measurable business impact.
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-[var(--ted-blue)]">
                View strategy &amp; architecture
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
