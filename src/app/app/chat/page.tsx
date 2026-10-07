"use client";

import { Badge } from "@/components/ui/badge";
import { TedChatScenario } from "@/components/app-experience/ted-chat-scenario";

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-violet)]/40 bg-white/5">
          Chat with TED
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Tell TED what you need</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          TED can schedule service, optimize your plan, or compare providers — and take action on
          your behalf.
        </p>
      </div>
      <TedChatScenario />
    </div>
  );
}
