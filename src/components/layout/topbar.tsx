"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/data/nav-items";
import { useDemoMode } from "@/context/demo-mode-context";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { startDemo, isActive } = useDemoMode();
  const current = navItems.find((n) => pathname === n.href || pathname?.startsWith(n.href + "/"));

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">{current?.description ?? "Rogers · TED"}</p>
          <h1 className="text-base font-semibold leading-tight sm:text-lg">{current?.label ?? "TED"}</h1>
        </div>
      </div>
      <Button onClick={startDemo} disabled={isActive} size="sm" className="shrink-0 sm:h-11 sm:px-6">
        <Play className="h-4 w-4" />
        <span className="hidden sm:inline">Start Executive Demo</span>
        <span className="sm:hidden">Demo</span>
      </Button>
    </header>
  );
}
