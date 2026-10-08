"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CalendarCheck } from "lucide-react";
import { PhoneFrame } from "@/components/scenarios/phone-frame";
import { IncomingCallScreen } from "@/components/scenarios/incoming-call-screen";
import { TranscriptBubble, type TranscriptLine } from "@/components/scenarios/transcript-bubble";
import { IntelligencePanel } from "@/components/scenarios/intelligence-panel";
import { useSequence } from "@/lib/use-sequence";
import { Badge } from "@/components/ui/badge";

const transcript: TranscriptLine[] = [
  { speaker: "caller", text: "Hello, I'm calling to confirm Sarah's dental appointment tomorrow." },
  { speaker: "ted", text: "Thank you. May I ask the purpose of your call?" },
  { speaker: "caller", text: "Appointment confirmation." },
  { speaker: "ted", text: "I found the appointment. Would you like me to confirm attendance?" },
  { speaker: "caller", text: "Yes." },
  { speaker: "ted", text: "Attendance confirmed. Thank you." },
];

type CallState = "incoming" | "ted-answering" | "manual";

export function AppointmentScenario() {
  const [callState, setCallState] = React.useState<CallState>("incoming");
  const { visibleItems, isComplete } = useSequence(transcript, callState === "ted-answering", 1500);

  const stage = visibleItems.length;

  const fields = [
    { label: "Caller Intent", value: stage >= 1 ? "Appointment confirmation" : "Analyzing…", tone: "default" as const },
    { label: "Identity Confidence", value: stage >= 2 ? "Verified caller pattern" : "Checking…", tone: stage >= 2 ? ("success" as const) : ("default" as const) },
    { label: "Recommended Action", value: stage >= 4 ? "Confirm attendance" : "Awaiting context…", tone: "default" as const },
    {
      label: "Conversation Summary",
      value: isComplete ? "Dental appointment confirmed for tomorrow" : stage > 0 ? "In progress…" : "—",
      tone: isComplete ? ("success" as const) : ("default" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          {callState === "incoming" && (
            <motion.div key="incoming" exit={{ opacity: 0 }} className="h-full">
              <IncomingCallScreen
                callerName="Unknown Caller"
                callerNumber="416-555-0179"
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
              <p className="text-xs text-white/40">Try &quot;Let TED Answer&quot; to see the AI concierge in action.</p>
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
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-xs text-white/40">TED is handling this call</p>
                  <p className="text-sm font-semibold text-white">Unknown Caller</p>
                </div>
                <Badge variant="info">Live</Badge>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {visibleItems.map((line, i) => (
                  <TranscriptBubble key={i} line={line} index={i} />
                ))}
              </div>
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="m-3 flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2.5 text-emerald-400 ring-1 ring-emerald-500/30"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span className="text-xs font-semibold">Appointment Confirmed</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex items-center justify-center gap-6 border-t border-white/10 py-3">
                <button
                  onClick={() => setCallState("incoming")}
                  className="rounded-full bg-red-500/90 p-3"
                  aria-label="End call"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <IntelligencePanel title="Live Intelligence" fields={fields} className="sm:col-span-2" />
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:col-span-2"
          >
            <CalendarCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-400">Appointment Confirmed</p>
              <p className="text-xs text-muted-foreground">
                Calendar updated and Sarah notified — zero manual effort required.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
