"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptions as initialSubscriptions, monthlySubscriptionSpend } from "@/data/customer-data";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Actively Used", tone: "success" as const },
  underused: { label: "Underused", tone: "warning" as const },
  unused: { label: "Unused", tone: "destructive" as const },
};

export default function SubscriptionsPage() {
  const [kept, setKept] = React.useState<Record<string, boolean>>(
    Object.fromEntries(initialSubscriptions.map((s) => [s.id, true]))
  );

  const cancelCandidates = initialSubscriptions.filter((s) => s.status !== "active");
  const potentialSavings = cancelCandidates
    .filter((s) => !kept[s.id])
    .reduce((sum, s) => sum + s.monthlyCost, 0);
  const currentSpend = initialSubscriptions
    .filter((s) => kept[s.id])
    .reduce((sum, s) => sum + s.monthlyCost, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Subscription Advisor
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Stop paying for what you don&apos;t use</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          TED audits subscription usage across the household and recommends concrete savings.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Monthly spend</p>
            <p className="text-2xl font-bold text-gradient-rogers">${currentSpend.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Potential savings</p>
            <p className="text-2xl font-bold text-emerald-400">${potentialSavings.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Your Subscriptions
          </p>
          {initialSubscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{sub.name}</p>
                <p className="text-xs text-muted-foreground">
                  {sub.category} · ${sub.monthlyCost.toFixed(2)}/mo
                </p>
                <Badge variant={statusConfig[sub.status].tone} className="mt-1">
                  {statusConfig[sub.status].label}
                </Badge>
              </div>
              {sub.status === "active" ? (
                <span className="shrink-0 text-xs text-muted-foreground">Keeping</span>
              ) : (
                <Button
                  size="sm"
                  variant={kept[sub.id] ? "outline" : "secondary"}
                  onClick={() => setKept((prev) => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                  className="shrink-0"
                >
                  {kept[sub.id] ? (
                    "Cancel"
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Cancelled
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-2.5 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--ted-blue)]" />
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              TED Recommends
            </p>
          </div>
          <p className={cn("text-xs leading-relaxed text-muted-foreground")}>
            Bundle your remaining services into the Rogers Entertainment Pass for an additional 10% discount, and
            revisit unused subscriptions again in 30 days.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-muted-foreground">
        Total household spend before changes: ${monthlySubscriptionSpend.toFixed(2)}/mo
      </p>

      <Link href="/app/demo/subscriptions">
        <Button variant="secondary" className="w-full justify-center">
          <Play className="h-3.5 w-3.5" />
          See a live example
        </Button>
      </Link>
    </div>
  );
}
