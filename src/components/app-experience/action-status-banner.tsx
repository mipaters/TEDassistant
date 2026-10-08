"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionStatusState = "idle" | "pending" | "done";

/**
 * Small inline banner used to dramatize TED acting on the customer's behalf
 * behind the scenes (e.g. messaging Rogers Network Care, or connecting to a
 * Microsoft 365 family calendar) before a setting takes effect.
 */
export function ActionStatusBanner({
  state,
  pendingLabel,
  doneLabel,
  className,
}: {
  state: ActionStatusState;
  pendingLabel: string;
  doneLabel: string;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {state !== "idle" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
              state === "pending" ? "bg-sky-500/10 text-sky-300" : "bg-emerald-500/10 text-emerald-400",
              className
            )}
          >
            {state === "pending" ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{state === "pending" ? pendingLabel : doneLabel}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Manages a map of independent action-status lifecycles (idle -> pending -> done -> idle),
 * keyed by an arbitrary id, so multiple cards on a page can each show their own
 * "TED is taking care of this" confirmation without interfering with one another.
 */
export function useActionStatusMap() {
  const [statuses, setStatuses] = React.useState<Record<string, ActionStatusState>>({});
  const timeouts = React.useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});

  const trigger = React.useCallback((id: string) => {
    timeouts.current[id]?.forEach(clearTimeout);
    setStatuses((prev) => ({ ...prev, [id]: "pending" }));
    const doneTimeout = setTimeout(() => setStatuses((prev) => ({ ...prev, [id]: "done" })), 1100);
    const idleTimeout = setTimeout(() => setStatuses((prev) => ({ ...prev, [id]: "idle" })), 3300);
    timeouts.current[id] = [doneTimeout, idleTimeout];
  }, []);

  React.useEffect(() => {
    const map = timeouts.current;
    return () => {
      Object.values(map).forEach((arr) => arr.forEach(clearTimeout));
    };
  }, []);

  return { statuses, trigger };
}
