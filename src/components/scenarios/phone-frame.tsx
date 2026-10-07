import * as React from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-[#1a1f2e] bg-[#05070d] shadow-2xl shadow-black/60",
        className
      )}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] text-white/80">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <BatteryFull className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
