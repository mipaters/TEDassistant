"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { capabilityCards } from "@/data/capability-cards";
import { customer } from "@/data/customer-data";

export default function AppHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Good afternoon</p>
        <h1 className="text-2xl font-bold text-white">
          Hi {customer.name.split(" ")[0]}, your{" "}
          <span>
            <span className="text-[var(--rogers-red-bright)]">T</span>rusted{" "}
            <span className="text-[var(--rogers-red-bright)]">E</span>veryday{" "}
            <span className="text-[var(--rogers-red-bright)]">D</span>igital Assistant
          </span>{" "}
          has things handled.
        </h1>
        <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-black/30 px-3 py-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          {customer.services.join(" + ")} · Family of {customer.familySize}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {capabilityCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={card.href}>
                <Card className="group h-full transition-transform active:scale-[0.98] hover:-translate-y-0.5 hover:glow-ring">
                  <CardContent className="flex h-full flex-col gap-2.5 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--rogers-red-bright)]/20 to-[var(--ted-violet)]/20 text-[var(--rogers-red-bright)] ring-1 ring-[var(--rogers-red-bright)]/20">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-semibold leading-tight">{card.title}</h3>
                    <p className="line-clamp-3 text-[11px] leading-snug text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="mt-auto flex items-center gap-1 text-[11px] font-medium text-[var(--rogers-red-bright)]">
                      Open
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <Link href="/app/chat">
        <Button variant="secondary" className="w-full justify-between">
          Ask TED to do something for you
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
