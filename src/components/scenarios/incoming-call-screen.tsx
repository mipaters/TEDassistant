"use client";

import { motion } from "framer-motion";
import { Phone, PhoneOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function IncomingCallScreen({
  callerName,
  callerNumber,
  badge,
  onAccept,
  onDecline,
  onLetTedAnswer,
}: {
  callerName: string;
  callerNumber?: string;
  badge?: React.ReactNode;
  onAccept: () => void;
  onDecline: () => void;
  onLetTedAnswer: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-[#121829] to-[#05070d] px-6 pb-8 pt-10 text-white">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs uppercase tracking-widest text-white/50">Incoming Call</p>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className={cn(
            "mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold",
            "ring-4 ring-white/10"
          )}
        >
          {callerName
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </motion.div>
        <h2 className="mt-3 text-lg font-semibold">{callerName}</h2>
        {callerNumber && <p className="text-sm text-white/60">{callerNumber}</p>}
        {badge}
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <button
          onClick={onLetTedAnswer}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--rogers-red-bright)] to-[var(--ted-violet)] py-3 text-sm font-semibold shadow-lg shadow-[rgba(224,17,95,0.4)]"
        >
          <Sparkles className="h-4 w-4" />
          Let TED Answer
        </button>
        <div className="flex w-full items-center justify-center gap-10">
          <button onClick={onDecline} className="flex flex-col items-center gap-1.5">
            <span className="flex h-13 w-13 items-center justify-center rounded-full bg-red-500/90 p-3.5">
              <PhoneOff className="h-5 w-5" />
            </span>
            <span className="text-[11px] text-white/60">Decline</span>
          </button>
          <button onClick={onAccept} className="flex flex-col items-center gap-1.5">
            <span className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500/90 p-3.5">
              <Phone className="h-5 w-5" />
            </span>
            <span className="text-[11px] text-white/60">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
