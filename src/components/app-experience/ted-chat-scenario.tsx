"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSequence } from "@/lib/use-sequence";
import { chatPrompts } from "@/data/chat-prompts";
import { customer } from "@/data/customer-data";
import { cn } from "@/lib/utils";

export function TedChatScenario() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [applied, setApplied] = React.useState(false);
  const active = chatPrompts.find((p) => p.id === activeId) ?? null;
  const { visibleItems, isComplete } = useSequence(active?.tedReplies ?? [], !!active, 1100);

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const selectPrompt = (id: string) => {
    setApplied(false);
    setActiveId(id);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[var(--rogers-red-bright)]" />
          Ask TED to take care of something for you
        </div>

        {!active && (
          <div className="flex flex-col gap-2">
            {chatPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPrompt(p.id)}
                className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/70"
              >
                {p.prompt}
              </button>
            ))}
          </div>
        )}

        {active && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                {initials}
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm">{active.prompt}</div>
            </div>

            {visibleItems.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-[#161c2c] px-4 py-2.5 text-sm text-white/90">{line}</div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isComplete && active.actionCard && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    {active.actionCard.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{active.actionCard.detail}</p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {active.actionCard.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span
                          className={cn(
                            "font-medium",
                            item.tone === "success" ? "text-emerald-400" : "text-foreground"
                          )}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="mt-4 w-full" onClick={() => setApplied(true)} disabled={applied}>
                    {applied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {active.actionCard.doneLabel}
                      </>
                    ) : (
                      active.actionCard.cta
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setActiveId(null)}
              className="self-start text-xs text-muted-foreground underline underline-offset-2"
            >
              Ask something else
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
