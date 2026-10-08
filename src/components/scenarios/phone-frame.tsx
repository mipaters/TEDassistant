import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A call-screen "takeover" card. Used inside the TED App's own phone chrome
 * (see ConsumerShell), so it intentionally has no device bezel/notch/status
 * bar of its own — just the screen content.
 */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[520px] w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#05070d] shadow-xl shadow-black/40",
        className
      )}
    >
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
