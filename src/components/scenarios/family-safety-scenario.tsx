"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertCircle, School, PhoneCall } from "lucide-react";
import { PhoneFrame } from "@/components/scenarios/phone-frame";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntelligencePanel } from "@/components/scenarios/intelligence-panel";
import { useSequence } from "@/lib/use-sequence";

type Stage = "ringing" | "analyzing" | "escalated" | "connected";

const analysisSteps = ["Checking caller registry…", "Trusted Institution confirmed", "Priority level: High"];

export function FamilySafetyScenario() {
  const [stage, setStage] = React.useState<Stage>("ringing");

  React.useEffect(() => {
    if (stage !== "ringing") return;
    const t = setTimeout(() => setStage("analyzing"), 1400);
    return () => clearTimeout(t);
  }, [stage]);

  const { visibleItems, isComplete } = useSequence(analysisSteps, stage === "analyzing", 900);

  React.useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => setStage("escalated"), 500);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  const reset = () => setStage("ringing");

  const fields = [
    { label: "Caller", value: "Elmwood Middle School", tone: "default" as const },
    { label: "Classification", value: "Trusted Institution", tone: "success" as const },
    { label: "Priority", value: "High — requires human attention", tone: "warning" as const },
    { label: "TED Action", value: "Escalate immediately, do not auto-resolve", tone: "default" as const },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {(stage === "ringing" || stage === "analyzing") && (
            <motion.div
              key="ringing"
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-[#1a1024] to-[#05070d] px-6 pb-8 pt-10 text-white"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-xs uppercase tracking-widest text-white/50">Incoming Call</p>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 ring-4 ring-amber-500/30"
                >
                  <School className="h-8 w-8 text-amber-400" />
                </motion.div>
                <h2 className="mt-3 text-lg font-semibold">Elmwood Middle School</h2>
                <p className="text-sm text-white/60">416-555-0100</p>
              </div>

              <div className="flex w-full flex-col items-center gap-3">
                {stage === "analyzing" && (
                  <div className="w-full space-y-2 rounded-xl bg-white/5 p-3 text-left">
                    {visibleItems.map((step, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-[11px] text-white/70"
                      >
                        <ShieldCheck className="h-3 w-3 text-emerald-400" /> {step}
                      </motion.p>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-white/40">TED is analyzing this caller…</p>
              </div>
            </motion.div>
          )}

          {(stage === "escalated" || stage === "connected") && (
            <motion.div
              key="escalated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-amber-950/50 to-[#05070d] px-6 pb-8 pt-10 text-white"
            >
              {stage === "escalated" ? (
                <>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/25 ring-4 ring-amber-500/40"
                    >
                      <AlertCircle className="h-8 w-8 text-amber-400" />
                    </motion.div>
                    <Badge variant="warning">Urgent School Contact</Badge>
                    <h2 className="text-lg font-semibold">Elmwood Middle School</h2>
                    <p className="max-w-[220px] text-xs text-white/60">
                      TED has identified this as a high-priority call requiring your immediate attention.
                    </p>
                  </div>
                  <button
                    onClick={() => setStage("connected")}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-[var(--rogers-red-bright)] py-3 text-sm font-semibold shadow-lg"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Accept Call Now
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShieldCheck className="h-10 w-10 text-emerald-400" />
                  <p className="text-sm font-semibold">Connected to Sarah</p>
                  <p className="text-xs text-white/50">Human handoff complete.</p>
                  <button onClick={reset} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs">
                    Reset Scenario
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>

      <div className="flex flex-col gap-4">
        <IntelligencePanel title="Escalation Intelligence" fields={fields} />
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              Why this matters
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              TED distinguishes between routine calls it can resolve autonomously and sensitive,
              high-stakes calls — like schools, hospitals, or emergency services — that always
              require a human. This builds trust that TED knows its limits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
