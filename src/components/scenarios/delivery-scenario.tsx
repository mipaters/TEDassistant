"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, Bell, FileText, Truck } from "lucide-react";
import { PhoneFrame } from "@/components/scenarios/phone-frame";
import { IncomingCallScreen } from "@/components/scenarios/incoming-call-screen";
import { TranscriptBubble, type TranscriptLine } from "@/components/scenarios/transcript-bubble";
import { Card, CardContent } from "@/components/ui/card";
import { useSequence } from "@/lib/use-sequence";
import { cn } from "@/lib/utils";

const transcript: TranscriptLine[] = [
  { speaker: "caller", text: "Package delivery scheduled between 2 PM and 4 PM." },
  { speaker: "ted", text: "Thank you. I will notify Sarah." },
];

const automationActions = [
  { label: "Calendar updated", icon: CalendarCheck },
  { label: "Reminder created", icon: Bell },
  { label: "Summary delivered", icon: FileText },
];

type CallState = "incoming" | "ted-answering" | "manual";

export function DeliveryScenario() {
  const [callState, setCallState] = React.useState<CallState>("incoming");
  const { visibleItems, isComplete } = useSequence(transcript, callState === "ted-answering", 1600);
  const { visibleItems: visibleActions } = useSequence(automationActions, isComplete, 550);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {callState === "incoming" && (
            <motion.div key="incoming" exit={{ opacity: 0 }} className="h-full">
              <IncomingCallScreen
                callerName="Metro Courier"
                callerNumber="905-555-0123"
                onAccept={() => setCallState("manual")}
                onDecline={() => setCallState("manual")}
                onLetTedAnswer={() => setCallState("ted-answering")}
              />
            </motion.div>
          )}
          {callState === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center gap-3 bg-[#0b0f1a] px-6 text-center text-white/70"
            >
              <p className="text-sm">Call handled manually.</p>
              <button
                onClick={() => setCallState("incoming")}
                className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs"
              >
                Reset Scenario
              </button>
            </motion.div>
          )}
          {callState === "ted-answering" && (
            <motion.div
              key="answering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col bg-[#0b0f1a]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <Truck className="h-4 w-4 text-[var(--ted-blue)]" />
                <p className="text-sm font-semibold text-white">Metro Courier</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {visibleItems.map((line, i) => (
                  <TranscriptBubble key={i} line={line} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              Automation
            </p>
            <h3 className="mt-1 text-lg font-semibold">Zero human involvement required</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              TED resolves routine, low-risk calls end-to-end and only surfaces a summary.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {automationActions.map((action) => {
                const Icon = action.icon;
                const visible = visibleActions.includes(action);
                return (
                  <motion.div
                    key={action.label}
                    animate={{ opacity: visible ? 1 : 0.3, x: visible ? 0 : -8 }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      visible ? "border-emerald-500/30 bg-emerald-500/10" : "border-border"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        visible ? "bg-emerald-500/20 text-emerald-400" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className={cn("text-sm font-medium", visible && "text-emerald-400")}>
                      {visible ? "✓ " : ""}
                      {action.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
