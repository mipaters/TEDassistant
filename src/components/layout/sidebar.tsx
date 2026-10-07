"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { navItems } from "@/data/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link href="/home" className="flex items-center gap-3 px-2" onClick={onNavigate}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)] shadow-lg shadow-[rgba(224,17,95,0.4)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">TED</p>
          <p className="text-[11px] text-muted-foreground">Trusted Everyday Digital Assistant</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[rgba(255,45,107,0.18)] to-[rgba(139,123,255,0.12)] ring-1 ring-[rgba(255,45,107,0.35)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={cn("relative z-10 h-4.5 w-4.5", isActive && "text-[var(--rogers-red-bright)]")} />
              <span className="relative z-10 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-border bg-secondary/40 p-3 text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground">Rogers Executive Briefing</p>
        <p className="mt-1">Demo environment · synthetic data only</p>
      </div>
    </div>
  );
}
