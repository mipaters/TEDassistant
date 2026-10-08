"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PhoneIncoming, PhoneForwarded, ShieldAlert, Phone, Check, Loader2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { callHistory, familyMembers } from "@/data/customer-data";
import { cn } from "@/lib/utils";
import { VOICE_SERVER_URL } from "@/lib/voice-server";

type SaveState = "idle" | "loading" | "saved" | "error";

/**
 * Lets the presenter set the real phone number TED should use for the live
 * demo: both for texting Sarah a summary after a handled call, and for
 * bridging an escalated call ("put through") straight to her live. Reads
 * from / writes to the voice-server directly, since the static site has no
 * backend of its own.
 */
function SarahNumberCard() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [input, setInput] = React.useState("");
  const [loadState, setLoadState] = React.useState<SaveState>("idle");
  const [saveState, setSaveState] = React.useState<SaveState>("idle");

  React.useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch(`${VOICE_SERVER_URL}/api/sarah-number`)
      .then((r) => r.json())
      .then((data: { phoneNumber?: string }) => {
        if (cancelled) return;
        setPhoneNumber(data.phoneNumber ?? "");
        setInput(data.phoneNumber ?? "");
        setLoadState("saved");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    setSaveState("loading");
    try {
      const res = await fetch(`${VOICE_SERVER_URL}/api/sarah-number`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: input }),
      });
      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { phoneNumber: string };
      setPhoneNumber(data.phoneNumber);
      setInput(data.phoneNumber);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <Card className="border-[var(--ted-blue)]/30 bg-[var(--ted-blue)]/5">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
            <PhoneForwarded className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Sarah&apos;s phone number</p>
            <p className="text-xs text-muted-foreground">
              Used on live demo calls: TED texts this number a summary, and bridges urgent calls here directly.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="+1 (416) 555-0100"
            inputMode="tel"
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={saveState === "loading" || !input.trim()}>
            {saveState === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {loadState === "error" && "Couldn't reach the voice server — check it's running."}
          {saveState === "saved" && phoneNumber && (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Check className="h-3 w-3" /> Saved as {phoneNumber}
            </span>
          )}
          {saveState === "error" && "Couldn't save that number — please check the format and try again."}
        </p>
      </CardContent>
    </Card>
  );
}

type Contact = { id: string; name: string; phoneNumber: string };

/**
 * Lets the presenter register "trusted contacts" (e.g. Sarah's husband
 * Simon) whose calls TED recognizes instantly by caller ID and puts
 * straight through live — no screening, no conversation — demonstrating
 * that TED knows which calls need zero friction.
 */
function TrustedContactsCard() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [loadState, setLoadState] = React.useState<SaveState>("idle");
  const [saveState, setSaveState] = React.useState<SaveState>("idle");

  const loadContacts = React.useCallback(() => {
    setLoadState("loading");
    return fetch(`${VOICE_SERVER_URL}/api/trusted-contacts`)
      .then((r) => r.json())
      .then((data: { contacts?: Contact[] }) => {
        setContacts(data.contacts ?? []);
        setLoadState("saved");
      })
      .catch(() => setLoadState("error"));
  }, []);

  React.useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  async function handleAdd() {
    setSaveState("loading");
    try {
      const res = await fetch(`${VOICE_SERVER_URL}/api/trusted-contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber }),
      });
      if (!res.ok) throw new Error("save failed");
      setName("");
      setPhoneNumber("");
      setSaveState("saved");
      await loadContacts();
    } catch {
      setSaveState("error");
    }
  }

  async function handleRemove(id: string) {
    await fetch(`${VOICE_SERVER_URL}/api/trusted-contacts/${id}`, { method: "DELETE" }).catch(() => undefined);
    await loadContacts();
  }

  return (
    <Card className="border-[var(--ted-blue)]/30 bg-[var(--ted-blue)]/5">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
            <UserCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Trusted contacts</p>
            <p className="text-xs text-muted-foreground">
              Calls from these numbers go straight through to Sarah live — TED recognizes them instantly and
              doesn&apos;t screen the call.
            </p>
          </div>
        </div>

        {contacts.length > 0 && (
          <div className="flex flex-col gap-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.phoneNumber}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(c.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        {loadState === "saved" && contacts.length === 0 && (
          <p className="text-xs text-muted-foreground">No trusted contacts yet — add one below, e.g. Simon.</p>
        )}
        {loadState === "error" && (
          <p className="text-xs text-muted-foreground">Couldn&apos;t reach the voice server — check it&apos;s running.</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Simon)" className="flex-1" />
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (416) 555-0100"
            inputMode="tel"
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={saveState === "loading" || !name.trim() || !phoneNumber.trim()}>
            {saveState === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
          </Button>
        </div>
        {saveState === "error" && (
          <p className="text-xs text-red-400">Couldn&apos;t add that contact — please check the number format.</p>
        )}
      </CardContent>
    </Card>
  );
}

type Tab = "concierge" | "scam";

function outcomeTone(outcome: string) {
  if (outcome.toLowerCase().includes("blocked")) return "text-red-400";
  if (outcome.toLowerCase().includes("escalated")) return "text-amber-400";
  return "text-emerald-400";
}

function ConciergeSettings() {
  const [letTedAnswer, setLetTedAnswer] = React.useState(true);
  const [autoConfirm, setAutoConfirm] = React.useState(true);
  const [autoLogDeliveries, setAutoLogDeliveries] = React.useState(true);
  const [alwaysRing, setAlwaysRing] = React.useState<Record<string, boolean>>({
    "fam-1": true,
    "fam-2": true,
    "fam-3": false,
    "fam-4": false,
  });

  const tedHandled = callHistory.filter((c) => c.handledBy === "TED");

  return (
    <div className="flex flex-col gap-4">
      <SarahNumberCard />
      <TrustedContactsCard />
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Let TED answer unknown calls</p>
              <p className="text-xs text-muted-foreground">Screens and triages calls from numbers not in your contacts</p>
            </div>
            <Switch checked={letTedAnswer} onCheckedChange={setLetTedAnswer} aria-label="Let TED answer unknown calls" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Auto-confirm appointment calls</p>
              <p className="text-xs text-muted-foreground">Confirm attendance automatically when intent is clear</p>
            </div>
            <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} aria-label="Auto-confirm appointment calls" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Auto-log package deliveries</p>
              <p className="text-xs text-muted-foreground">Add delivery windows to your calendar with zero involvement</p>
            </div>
            <Switch checked={autoLogDeliveries} onCheckedChange={setAutoLogDeliveries} aria-label="Auto-log package deliveries" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Always Ring Through
          </p>
          {familyMembers.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.relationship}</p>
              </div>
              <Switch
                checked={alwaysRing[m.id] ?? false}
                onCheckedChange={(v) => setAlwaysRing((prev) => ({ ...prev, [m.id]: v }))}
                aria-label={`Always ring through for ${m.name}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Recent Activity
          </p>
          {tedHandled.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{c.caller}</p>
                <p className="text-muted-foreground">{c.date} · {c.duration}</p>
              </div>
              <span className={cn("shrink-0 text-right", outcomeTone(c.outcome))}>{c.outcome}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[var(--ted-blue)]/30 bg-[var(--ted-blue)]/5">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Try it yourself</p>
            <p className="text-xs text-muted-foreground">
              Call{" "}
              <a href="tel:+12898141439" className="font-medium text-white underline underline-offset-2">
                +1 (289) 814-1439
              </a>{" "}
              to test TED&apos;s call concierge live.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScamSettings() {
  const [sensitivity, setSensitivity] = React.useState<"standard" | "aggressive">("standard");
  const [autoBlock, setAutoBlock] = React.useState(true);
  const [notifyOnBlock, setNotifyOnBlock] = React.useState(true);

  const blocked = callHistory.filter((c) => c.outcome.toLowerCase().includes("blocked"));

  return (
    <div className="flex flex-col gap-4">
      <SarahNumberCard />
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Detection sensitivity</p>
            <p className="text-xs text-muted-foreground">
              Aggressive catches more fraud but may flag unfamiliar callers more often
            </p>
          </div>
          <div className="flex gap-2">
            {(["standard", "aggressive"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSensitivity(opt)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-colors",
                  sensitivity === opt
                    ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)] text-white"
                    : "border-border text-muted-foreground hover:bg-white/5"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Auto-block high-risk calls</p>
              <p className="text-xs text-muted-foreground">Block calls scoring above the fraud threshold automatically</p>
            </div>
            <Switch checked={autoBlock} onCheckedChange={setAutoBlock} aria-label="Auto-block high-risk calls" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Notify me when a call is blocked</p>
              <p className="text-xs text-muted-foreground">Get a summary SMS whenever TED blocks a call</p>
            </div>
            <Switch checked={notifyOnBlock} onCheckedChange={setNotifyOnBlock} aria-label="Notify me when a call is blocked" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-2.5 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            What TED watches for
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="destructive">Urgency language</Badge>
            <Badge variant="destructive">Identity unverifiable</Badge>
            <Badge variant="destructive">Social engineering</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Blocked Calls
          </p>
          {blocked.length === 0 && (
            <p className="text-xs text-muted-foreground">No blocked calls recently.</p>
          )}
          {blocked.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{c.number}</p>
                <p className="text-muted-foreground">{c.date}</p>
              </div>
              <span className="shrink-0 text-right text-red-400">{c.outcome}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[var(--ted-blue)]/30 bg-[var(--ted-blue)]/5">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Try it yourself</p>
            <p className="text-xs text-muted-foreground">
              Call{" "}
              <a href="tel:+12898141439" className="font-medium text-white underline underline-offset-2">
                +1 (289) 814-1439
              </a>{" "}
              to test TED&apos;s scam protection live.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CallsSettingsContent() {
  const searchParams = useSearchParams();
  const param = searchParams.get("tab");
  const initial: Tab = param === "scam" ? "scam" : "concierge";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    setTab(initial);
  }, [initial]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-blue)]/40 bg-white/5">
          Call Settings
        </Badge>
        <h1 className="text-xl font-bold leading-tight">How TED handles your calls</h1>
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="concierge" className="flex flex-1 items-center justify-center gap-1.5">
              <PhoneIncoming className="h-3.5 w-3.5" />
              Concierge
            </TabsTrigger>
            <TabsTrigger value="scam" className="flex flex-1 items-center justify-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Scam Protection
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={tab}>
        <TabsContent value="concierge">
          <ConciergeSettings />
        </TabsContent>
        <TabsContent value="scam">
          <ScamSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CallsPage() {
  return (
    <Suspense fallback={null}>
      <CallsSettingsContent />
    </Suspense>
  );
}
