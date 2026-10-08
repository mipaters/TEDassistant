"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Signal, Wifi, BatteryFull, Building2, Play, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/context/demo-mode-context";
import { consumerTabs } from "@/data/consumer-nav-items";
import { cn } from "@/lib/utils";

export function ConsumerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { startDemo, isActive } = useDemoMode();
  const chatActive = pathname === "/app/chat" || pathname?.startsWith("/app/chat/");

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-[radial-gradient(ellipse_at_top,_rgba(224,17,95,0.12),_transparent_60%)] px-4 pb-28 pt-6 lg:pt-10">
      <div className="flex w-full max-w-[420px] flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border bg-black/30 px-3 py-1.5">
          TED App · Consumer Preview
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={startDemo} disabled={isActive}>
            <Play className="h-3.5 w-3.5" />
            Demo
          </Button>
          <Link href="/internal/why-rogers">
            <Button size="sm" variant="outline">
              <Building2 className="h-3.5 w-3.5" />
              Internal View
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative flex w-full max-w-[390px] flex-col overflow-hidden rounded-[2.75rem] border-[8px] border-[#1a1f2e] bg-[#05070d] shadow-2xl shadow-black/60">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-32 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] text-white/80">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="min-h-[600px] flex-1 overflow-y-auto px-4 pb-24 pt-2">{children}</div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/10 bg-[#0b0f1a]/95 px-1 py-2.5 backdrop-blur-xl">
          {consumerTabs.slice(0, 2).map((tab) => (
            <NavTabLink key={tab.href} tab={tab} pathname={pathname} />
          ))}

          <Link
            href="/app/chat"
            className="flex flex-col items-center gap-1 px-2 py-1"
            aria-label="Chat with TED"
          >
            <MessageCircle
              className={cn("h-5 w-5", chatActive ? "text-[var(--rogers-red-bright)]" : "text-white/40")}
            />
            <span className={cn("text-[10px]", chatActive ? "text-white" : "text-white/40")}>TED</span>
          </Link>

          {consumerTabs.slice(2).map((tab) => (
            <NavTabLink key={tab.href} tab={tab} pathname={pathname} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavTabLink({
  tab,
  pathname,
}: {
  tab: (typeof consumerTabs)[number];
  pathname: string | null;
}) {
  const Icon = tab.icon;
  const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
  return (
    <Link href={tab.href} className="flex flex-col items-center gap-1 px-2 py-1">
      <Icon className={cn("h-5 w-5", active ? "text-[var(--rogers-red-bright)]" : "text-white/40")} />
      <span className={cn("text-[10px]", active ? "text-white" : "text-white/40")}>{tab.label}</span>
    </Link>
  );
}
