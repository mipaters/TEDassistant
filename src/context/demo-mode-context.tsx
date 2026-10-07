"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { demoSteps, type DemoStep } from "@/data/demo-steps";

interface DemoModeContextValue {
  isActive: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  currentStep: DemoStep;
  progress: number; // 0-100 within current step
  startDemo: () => void;
  stopDemo: () => void;
  togglePause: () => void;
  next: () => void;
  previous: () => void;
}

const DemoModeContext = React.createContext<DemoModeContextValue | null>(null);

const TICK_MS = 150;

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);

  const currentStep = demoSteps[currentStepIndex];

  const goToStep = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(demoSteps.length - 1, index));
      setCurrentStepIndex(clamped);
      setElapsed(0);
      const step = demoSteps[clamped];
      router.push(step.href);
      if (step.anchor) {
        window.setTimeout(() => {
          document.getElementById(step.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
      }
    },
    [router]
  );

  const startDemo = React.useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    goToStep(0);
  }, [goToStep]);

  const stopDemo = React.useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setElapsed(0);
  }, []);

  const togglePause = React.useCallback(() => setIsPaused((p) => !p), []);

  const next = React.useCallback(() => {
    if (currentStepIndex >= demoSteps.length - 1) {
      stopDemo();
      return;
    }
    goToStep(currentStepIndex + 1);
  }, [currentStepIndex, goToStep, stopDemo]);

  const previous = React.useCallback(() => {
    goToStep(currentStepIndex - 1);
  }, [currentStepIndex, goToStep]);

  React.useEffect(() => {
    if (!isActive || isPaused) return;
    const interval = setInterval(() => {
      setElapsed((e) => {
        const nextElapsed = e + TICK_MS;
        if (nextElapsed >= currentStep.durationMs) {
          window.setTimeout(() => next(), 0);
          return 0;
        }
        return nextElapsed;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, currentStepIndex]);

  const progress = (elapsed / currentStep.durationMs) * 100;

  const value: DemoModeContextValue = {
    isActive,
    isPaused,
    currentStepIndex,
    currentStep,
    progress,
    startDemo,
    stopDemo,
    togglePause,
    next,
    previous,
  };

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = React.useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}
