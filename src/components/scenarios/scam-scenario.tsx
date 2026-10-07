"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldBan, Ban } from "lucide-react";
import { PhoneFrame } from "@/components/scenarios/phone-frame";
import { IncomingCallScreen } from "@/components/scenarios/incoming-call-screen";
import { TranscriptBubble, type TranscriptLine } from "@/components/scenarios/transcript-bubble";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSequence } from "@/lib/use-sequence";
import { cn } from "@/lib/utils";

const transcript: TranscriptLine[] = [
  { speaker: "caller", text: "Your bank account has been compromised." },
  { speaker: "ted", text: "Please explain the concern." },
  { speaker: "caller", text: "You must act immediately." },
  { speaker: "ted", text: "Analyzing conversation…" },
];

const scoreCheckpoints = [12, 28, 54, 76, 94];

const reasons = [
  "Urgency language detected",
  "Identity unverifiable",
  "Social engineering indicators",
];

type CallState = "incoming" | "ted-answering" | "manual";

export function ScamScenario() {
  const [callState, setCallState] = React.useState<CallState>("incoming");
  const { visibleItems, isComplete } = useSequence(transcript, callState === "ted-answering", 1500);
  const { visibleItems: visibleScores, isComplete: scoreComplete } = useSequence(
    scoreCheckpoints,
    callState === "ted-answering",
    900
  );
  const currentScore = visibleScores[visibleScores.length - 1] ?? 0;
  const blocked = isComplete && scoreComplete;

  const { visibleItems: visibleReasons } = useSequence(reasons, blocked, 350);

  const scoreTone = currentScore >= 70 ? "text-red-400" : currentScore >= 40 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {callState === "incoming" && (
            <motion.div key="incoming" exit={{ opacity: 0 }} className="h-full">
              <IncomingCallScreen
                callerName="Unknown Number"
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
              className={cn(
                "flex h-full flex-col bg-[#0b0f1a] transition-colors",
                blocked && "bg-gradient-to-b from-red-950/40 to-[#0b0f1a]"
              )}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-sm font-semibold text-white">Unknown Number</p>
                {currentScore > 0 && (
                  <span className={cn("text-xs font-bold", scoreTone)}>{currentScore}% risk</span>
                )}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {visibleItems.map((line, i) => (
                  <TranscriptBubble key={i} line={line} index={i} />
                ))}
              </div>
              <AnimatePresence>
                {blocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="m-3 flex flex-col items-center gap-2 rounded-xl bg-red-500/15 px-4 py-4 text-center ring-1 ring-red-500/40"
                  >
                    <ShieldBan className="h-6 w-6 text-red-400" />
                    <p className="text-sm font-bold text-red-400">High Scam Probability</p>
                    <p className="flex items-center gap-1 text-xs text-white/70">
                      <Ban className="h-3 w-3" /> Action Taken: Call Blocked
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                Fraud Score
              </p>
              {currentScore >= 70 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5 animate-pulse-soft" /> Elevated Risk
                </span>
              )}
            </div>
            <div className="mt-2 flex items-end gap-2">
              <motion.span
                key={currentScore}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn("text-4xl font-bold", scoreTone)}
              >
                {currentScore}%
              </motion.span>
              <span className="pb-1.5 text-xs text-muted-foreground">scam probability</span>
            </div>
            <Progress
              value={currentScore}
              className="mt-3"
              indicatorClassName={cn(
                currentScore >= 70
                  ? "bg-gradient-to-r from-amber-500 to-red-500"
                  : "bg-gradient-to-r from-[var(--ted-blue)] to-[var(--rogers-red-bright)]"
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              Detection Reasons
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {reasons.map((reason) => {
                const visible = visibleReasons.includes(reason);
                return (
                  <motion.div
                    key={reason}
                    animate={{ opacity: visible ? 1 : 0.25, x: visible ? 0 : -8 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <AlertTriangle className={cn("h-3.5 w-3.5", visible ? "text-red-400" : "text-muted-foreground")} />
                    <span className={visible ? "text-foreground" : "text-muted-foreground"}>{reason}</span>
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
