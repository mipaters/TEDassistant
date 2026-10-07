"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useDemoMode } from "@/context/demo-mode-context";
import { demoSteps } from "@/data/demo-steps";
import { Progress } from "@/components/ui/progress";

export function DemoModeBar() {
  const { isActive, isPaused, currentStep, currentStepIndex, progress, togglePause, next, previous, stopDemo } =
    useDemoMode();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 animate-pulse-soft rounded-full bg-[var(--rogers-red-bright)]" />
                <p className="truncate text-sm font-medium">
                  Executive Demo · Step {currentStepIndex + 1}/{demoSteps.length} · {currentStep.label}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={previous}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-white/5"
                  aria-label="Previous"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={togglePause}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--rogers-red-bright)] to-[var(--rogers-red)] text-white"
                  aria-label={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={next}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-white/5"
                  aria-label="Next"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={stopDemo}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-white/5"
                  aria-label="Exit demo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <Progress value={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
