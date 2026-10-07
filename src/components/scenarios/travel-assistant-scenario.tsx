"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Wifi,
  Bell,
  CloudSun,
  Coins,
  Sparkles,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSequence } from "@/lib/use-sequence";
import { travelPlans } from "@/data/customer-data";

const widgets = [
  {
    id: "roaming",
    icon: Wifi,
    title: "Roaming Information",
    body: "Rogers Roam Like Home activated for Spain. $12/day, unlimited Canadian plan usage.",
    accent: "text-[var(--ted-blue)]",
  },
  {
    id: "flight",
    icon: Plane,
    title: "Flight Status",
    body: `${travelPlans[0].airline} ${travelPlans[0].flightNumber} — On time, departs 6:45 AM from Terminal 1, Gate B22.`,
    accent: "text-emerald-400",
  },
  {
    id: "reminders",
    icon: Bell,
    title: "Travel Reminders",
    body: "Passport, EU adapter, and travel insurance confirmation added to your checklist.",
    accent: "text-amber-400",
  },
  {
    id: "weather",
    icon: CloudSun,
    title: "Local Weather",
    body: "Barcelona: 21°C and sunny this week. Light jacket recommended for evenings.",
    accent: "text-sky-400",
  },
  {
    id: "currency",
    icon: Coins,
    title: "Currency Guidance",
    body: "1 CAD ≈ 0.68 EUR. Rogers Bank card has no foreign transaction fees.",
    accent: "text-[var(--ted-violet)]",
  },
];

export function TravelAssistantScenario() {
  const [asked, setAsked] = React.useState(false);
  const { visibleItems } = useSequence(widgets, asked, 450);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
              ST
            </span>
            <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm">
              &quot;I am flying to Barcelona tomorrow.&quot;
            </div>
          </div>

          {!asked && (
            <Button onClick={() => setAsked(true)} className="w-fit self-end">
              <Send className="h-4 w-4" />
              Ask TED
            </Button>
          )}

          {asked && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-[#161c2c] px-4 py-2.5 text-sm text-white/90">
                Great — here&apos;s everything you need for Barcelona, prepared automatically.
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          const visible = visibleItems.includes(widget);
          return (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 16 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ${widget.accent}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold">{widget.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{widget.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        <Card className="flex items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
            <Badge variant="info">Proactive</Badge>
            <p className="text-xs text-muted-foreground">
              All five widgets generated automatically from your travel itinerary — no manual research required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
