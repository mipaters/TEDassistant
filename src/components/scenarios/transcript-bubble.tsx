"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface TranscriptLine {
  speaker: "caller" | "ted";
  text: string;
}

export function TranscriptBubble({ line, index }: { line: TranscriptLine; index: number }) {
  const isTed = line.speaker === "ted";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
      className={cn("flex w-full", isTed ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex max-w-[82%] items-start gap-2",
          isTed ? "flex-row-reverse text-right" : "text-left"
        )}
      >
        {isTed && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)]">
            <Sparkles className="h-3 w-3 text-white" />
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-[13px] leading-snug shadow",
            isTed
              ? "rounded-tr-sm bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--rogers-red)] text-white"
              : "rounded-tl-sm bg-[#161c2c] text-white/90"
          )}
        >
          {line.text}
        </div>
      </div>
    </motion.div>
  );
}
