"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { architectureNodes } from "@/data/architecture-nodes";
import { cn } from "@/lib/utils";

export default function ArchitecturePage() {
  const [selected, setSelected] = React.useState(architectureNodes[0].id);
  const activeNode = architectureNodes.find((n) => n.id === selected)!;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          Technical Architecture
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">From a phone call to an executive insight</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Select any stage to see how TED turns a single conversation into automated action and
          enterprise intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col items-stretch">
          {architectureNodes.map((node, i) => {
            const Icon = node.icon;
            const isActive = node.id === selected;
            return (
              <React.Fragment key={node.id}>
                <motion.button
                  onClick={() => setSelected(node.id)}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    isActive
                      ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)]"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)] text-white"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className={cn("text-sm font-medium", isActive && "text-white")}>{node.title}</span>
                </motion.button>
                {i < architectureNodes.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg width="2" height="20" className="overflow-visible">
                      <line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="20"
                        stroke="var(--ted-blue)"
                        strokeWidth="2"
                        className="animate-dash-flow"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="flex flex-col gap-4 p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)] text-white">
                      <activeNode.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stage {architectureNodes.findIndex((n) => n.id === selected) + 1} of{" "}
                        {architectureNodes.length}
                      </p>
                      <h2 className="text-xl font-semibold">{activeNode.title}</h2>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{activeNode.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowDown className="h-3.5 w-3.5" />
                    Data and intent flow downstream in real time
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
