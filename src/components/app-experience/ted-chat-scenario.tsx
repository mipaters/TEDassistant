"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Send, Mic, MicOff, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSequence } from "@/lib/use-sequence";
import { useTedVoice } from "@/lib/use-ted-voice";
import { chatPrompts, type ChatExchange } from "@/data/chat-prompts";
import { customer } from "@/data/customer-data";
import { VOICE_SERVER_URL } from "@/lib/voice-server";
import { cn } from "@/lib/utils";

interface LiveMessage {
  role: "user" | "ted";
  text: string;
}

export function TedChatScenario() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = React.useState<ChatExchange | null>(null);
  const [draft, setDraft] = React.useState("");
  const [applied, setApplied] = React.useState(false);
  const [liveMessages, setLiveMessages] = React.useState<LiveMessage[]>([]);
  const [liveLoading, setLiveLoading] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const active = customPrompt ?? chatPrompts.find((p) => p.id === activeId) ?? null;
  const { visibleItems, isComplete } = useSequence(active?.tedReplies ?? [], !!active, 1100);

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const speak = React.useCallback(async (text: string) => {
    try {
      const res = await fetch(`${VOICE_SERVER_URL}/api/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current?.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      setSpeaking(true);
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play().catch(() => setSpeaking(false));
    } catch {
      // Best-effort — TTS is a nice-to-have on top of the text reply, which
      // has already been shown regardless.
    }
  }, []);

  const sendLive = React.useCallback(
    async (text: string, opts?: { spoken?: boolean }) => {
      setApplied(false);
      setActiveId(null);
      setCustomPrompt(null);
      const history = liveMessages.map((m) => ({
        role: m.role === "ted" ? "assistant" : "user",
        content: m.text,
      }));
      setLiveMessages((prev) => [...prev, { role: "user", text }]);
      setLiveLoading(true);
      try {
        const res = await fetch(`${VOICE_SERVER_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history, message: text }),
        });
        if (!res.ok) throw new Error("chat request failed");
        const data = (await res.json()) as { reply: string };
        setLiveMessages((prev) => [...prev, { role: "ted", text: data.reply }]);
        if (opts?.spoken) void speak(data.reply);
      } catch {
        setLiveMessages((prev) => [
          ...prev,
          {
            role: "ted",
            text: "Sorry, I couldn't reach my Azure OpenAI service just now. Please try again in a moment.",
          },
        ]);
      } finally {
        setLiveLoading(false);
      }
    },
    [liveMessages, speak]
  );

  const voice = useTedVoice((utterance) => sendLive(utterance, { spoken: true }));

  const selectPrompt = (id: string) => {
    setApplied(false);
    setCustomPrompt(null);
    setLiveMessages([]);
    setActiveId(id);
  };

  const reset = () => {
    setActiveId(null);
    setCustomPrompt(null);
    setLiveMessages([]);
  };

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void sendLive(text);
  };

  const showLiveThread = !active && liveMessages.length > 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[var(--rogers-red-bright)]" />
          Ask TED to take care of something for you
        </div>

        {!active && !showLiveThread && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitDraft();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask TED anything…"
                aria-label="Ask TED anything"
              />
              <Button type="submit" size="icon" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <button
              type="button"
              onClick={voice.toggle}
              disabled={!voice.supported}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                voice.enabled
                  ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)]"
                  : "border-border bg-secondary/40 hover:bg-secondary/70",
                !voice.supported && "cursor-not-allowed opacity-50"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    voice.enabled
                      ? "bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)]"
                      : "bg-secondary"
                  )}
                >
                  {voice.enabled ? (
                    <Mic className="h-4 w-4 text-white" />
                  ) : (
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
                <span>
                  <span className="block font-medium">
                    {!voice.supported
                      ? "Voice isn't supported in this browser"
                      : voice.enabled
                        ? "TED's voice is on"
                        : "Turn on TED's voice"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {!voice.supported
                      ? "Try Chrome or Edge, or just type below"
                      : voice.enabled
                        ? "Listening — talk anytime. Tap to turn off."
                        : "Talk to TED instead of typing"}
                  </span>
                </span>
              </span>
              {voice.enabled && (
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--rogers-red-bright)] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--rogers-red-bright)]" />
                </span>
              )}
            </button>

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
          </>
        )}

        {showLiveThread && (
          <div className="flex flex-col gap-3">
            {liveMessages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    m.role === "user"
                      ? "bg-secondary"
                      : "bg-gradient-to-br from-[var(--rogers-red-bright)] to-[var(--ted-violet)]"
                  )}
                >
                  {m.role === "user" ? initials : <Sparkles className="h-3.5 w-3.5 text-white" />}
                </span>
                <div
                  className={cn(
                    "rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm",
                    m.role === "user" ? "bg-secondary" : "bg-[#161c2c] text-white/90"
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            {liveLoading && (
              <div className="flex items-center gap-2 pl-11 text-xs text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </span>
                TED is thinking…
              </div>
            )}

            {speaking && (
              <div className="flex items-center gap-1.5 pl-11 text-xs text-[var(--ted-blue)]">
                <Volume2 className="h-3.5 w-3.5" />
                Speaking…
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitDraft();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask TED anything…"
                aria-label="Ask TED anything"
              />
              <Button type="submit" size="icon" aria-label="Send" disabled={liveLoading}>
                <Send className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant={voice.enabled ? "default" : "outline"}
                aria-label="Toggle voice"
                disabled={!voice.supported}
                onClick={voice.toggle}
              >
                {voice.enabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </form>

            <button
              onClick={reset}
              className="self-start text-xs text-muted-foreground underline underline-offset-2"
            >
              Ask something else
            </button>
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
              onClick={reset}
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
