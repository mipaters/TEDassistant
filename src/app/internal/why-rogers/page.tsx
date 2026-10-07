"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rogersPillars } from "@/data/rogers-pillars";

export default function WhyRogersPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit border-[var(--rogers-red-bright)]/40 bg-white/5">
          Executive Strategy
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Why Rogers Can Deliver TED</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Generic AI assistants operate purely at the application layer. Rogers uniquely sits at
          the network, device, and identity layer — giving TED signals no over-the-top competitor
          can replicate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rogersPillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rogers-red-bright)]/20 to-[var(--ted-violet)]/20 text-[var(--rogers-red-bright)] ring-1 ring-[var(--rogers-red-bright)]/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                  <div className="mt-auto rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                    <p className="text-xs font-medium text-emerald-400">{pillar.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
