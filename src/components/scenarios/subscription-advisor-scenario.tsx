"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, PiggyBank, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subscriptions, monthlySubscriptionSpend } from "@/data/customer-data";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Actively Used", tone: "success" as const },
  underused: { label: "Underused", tone: "warning" as const },
  unused: { label: "Unused", tone: "destructive" as const },
};

const unused = subscriptions.filter((s) => s.status === "unused");
const underused = subscriptions.filter((s) => s.status === "underused");
const potentialSavings = [...unused, ...underused].reduce((sum, s) => sum + s.monthlyCost, 0);

const recommendedActions = [
  `Cancel ${unused.map((s) => s.name).join(" and ")} — unused for 60+ days`,
  `Downgrade ${underused.map((s) => s.name).join(", ")} to a shared family tier`,
  "Bundle remaining services into Rogers Entertainment Pass for an additional 10% discount",
];

export function SubscriptionAdvisorScenario() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              Monthly Subscriptions
            </p>
            <p className="text-2xl font-bold">${monthlySubscriptionSpend.toFixed(2)}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {subscriptions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.category} · last used {new Date(sub.lastUsed).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={statusConfig[sub.status].tone}>{statusConfig[sub.status].label}</Badge>
                  <span className="w-14 text-right text-sm font-semibold">${sub.monthlyCost.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4.5 w-4.5 text-emerald-400" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                Executive Summary
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gradient-rogers">${monthlySubscriptionSpend.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Total monthly spend</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">${potentialSavings.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Potential monthly savings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                Savings Opportunities
              </p>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {[...unused, ...underused].map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className={cn(s.status === "unused" ? "text-red-400" : "text-amber-400")}>{s.name}</span>
                  <span className="text-muted-foreground">${s.monthlyCost.toFixed(2)}/mo</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--ted-blue)]" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                TED Recommends
              </p>
            </div>
            <ul className="mt-3 flex flex-col gap-2.5">
              {recommendedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="text-muted-foreground">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
