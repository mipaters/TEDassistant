"use client";

import * as React from "react";
import {
  Smartphone,
  Tablet,
  Gamepad2,
  Wifi,
  ShieldCheck,
  CalendarClock,
  Stethoscope,
  Trophy,
  School,
  Heart,
  BellRing,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ActionStatusBanner, useActionStatusMap } from "@/components/app-experience/action-status-banner";
import {
  familyMembers,
  childDevices,
  wifiSchedulePresets,
  familyReminders as initialFamilyReminders,
  calendarEvents,
  type ChildDevice,
  type FamilyReminder,
} from "@/data/customer-data";
import { cn } from "@/lib/utils";

const deviceIcon: Record<ChildDevice["deviceType"], typeof Smartphone> = {
  Phone: Smartphone,
  Tablet: Tablet,
  "Gaming Console": Gamepad2,
};

const filterLevels: ChildDevice["contentFilterLevel"][] = ["off", "standard", "strict"];

function ownerName(id: string) {
  return familyMembers.find((m) => m.id === id)?.name ?? "Family member";
}

function NetworkDeviceCard({
  device,
  onChange,
  status,
  onAction,
}: {
  device: ChildDevice;
  onChange: (next: ChildDevice) => void;
  status: "idle" | "pending" | "done";
  onAction: () => void;
}) {
  const Icon = deviceIcon[device.deviceType];

  const cycleSchedule = () => {
    const idx = wifiSchedulePresets.indexOf(device.wifiSchedule);
    const next = wifiSchedulePresets[(idx + 1) % wifiSchedulePresets.length];
    onChange({ ...device, wifiSchedule: next });
    onAction();
  };

  const setFilterLevel = (level: ChildDevice["contentFilterLevel"]) => {
    onChange({ ...device, contentFilterLevel: level });
    onAction();
  };

  const toggleScheduleEnabled = (enabled: boolean) => {
    onChange({ ...device, wifiScheduleEnabled: enabled });
    onAction();
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-violet)]/15 text-[var(--ted-violet)]">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{device.deviceName}</p>
            <p className="text-xs text-muted-foreground">{ownerName(device.ownerId)} · {device.deviceType}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-[var(--ted-blue)]" />
            <div>
              <p className="text-sm font-medium">Wi-Fi access schedule</p>
              <p className="text-xs text-muted-foreground">{device.wifiScheduleEnabled ? device.wifiSchedule : "Unrestricted"}</p>
            </div>
          </div>
          <Switch
            checked={device.wifiScheduleEnabled}
            onCheckedChange={toggleScheduleEnabled}
            aria-label={`Scheduled Wi-Fi access for ${device.deviceName}`}
          />
        </div>
        {device.wifiScheduleEnabled && (
          <button
            onClick={cycleSchedule}
            className="self-start rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/5"
          >
            Change schedule →
          </button>
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--ted-blue)]" />
            <p className="text-sm font-medium">Content filtering</p>
          </div>
          <div className="flex gap-2">
            {filterLevels.map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-colors",
                  device.contentFilterLevel === level
                    ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)] text-white"
                    : "border-border text-muted-foreground hover:bg-white/5"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <ActionStatusBanner
          state={status}
          pendingLabel="Contacting Rogers Network Care…"
          doneLabel="Anna (Rogers Network Care) applied the change"
        />
      </CardContent>
    </Card>
  );
}

const alertCategories = [
  { id: "medical", label: "Doctor & Dentist Appointments", match: ["medical"] as const, icon: Stethoscope },
  { id: "sports", label: "Kids' Sports Events", match: ["sports"] as const, icon: Trophy },
  { id: "school", label: "Parent-Teacher Meetings", match: ["school"] as const, icon: School },
  { id: "personal", label: "Other Family Events", match: ["personal"] as const, icon: Heart },
];

function FamilyCalendarSection({
  statuses,
  trigger,
}: {
  statuses: Record<string, "idle" | "pending" | "done">;
  trigger: (id: string) => void;
}) {
  const [connected, setConnected] = React.useState(true);
  const [alerts, setAlerts] = React.useState<Record<string, boolean>>({
    medical: true,
    sports: true,
    school: true,
    personal: false,
  });

  const toggleConnected = (v: boolean) => {
    setConnected(v);
    trigger("calendar-connect");
  };

  const toggleAlert = (id: string, v: boolean) => {
    setAlerts((prev) => ({ ...prev, [id]: v }));
    trigger(`alert-${id}`);
  };

  const enabledMatchers = alertCategories.filter((c) => alerts[c.id]).flatMap((c) => c.match);
  const upcoming = calendarEvents
    .filter((e) => enabledMatchers.includes(e.category as (typeof enabledMatchers)[number]))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium">Connect family calendar</p>
                <p className="text-xs text-muted-foreground">
                  TED watches your Microsoft 365 or Google family calendar for upcoming events
                </p>
              </div>
            </div>
            <Switch checked={connected} onCheckedChange={toggleConnected} aria-label="Connect family calendar" />
          </div>
          <ActionStatusBanner
            state={statuses["calendar-connect"] ?? "idle"}
            pendingLabel="Connecting to your Microsoft 365 or Google family calendar…"
            doneLabel="Family calendar connected — TED is now watching for new events"
          />
        </CardContent>
      </Card>

      {connected ? (
        <>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                Alert me before…
              </p>
              {alertCategories.map((cat, i) => (
                <React.Fragment key={cat.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">Reminders sent the day before, plus 2 hours before</p>
                      </div>
                    </div>
                    <Switch
                      checked={alerts[cat.id] ?? false}
                      onCheckedChange={(v) => toggleAlert(cat.id, v)}
                      aria-label={`Alerts for ${cat.label}`}
                    />
                  </div>
                  {statuses[`alert-${cat.id}`] && statuses[`alert-${cat.id}`] !== "idle" && (
                    <ActionStatusBanner
                      state={statuses[`alert-${cat.id}`]}
                      pendingLabel="Updating your family calendar alerts…"
                      doneLabel="Alert preference saved"
                    />
                  )}
                  {i < alertCategories.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
                Upcoming in your family calendar
              </p>
              {upcoming.length === 0 && (
                <p className="text-xs text-muted-foreground">No upcoming events match your alert preferences.</p>
              )}
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{e.title}</p>
                    <p className="text-muted-foreground">{e.location ?? "—"}</p>
                  </div>
                  <span className="shrink-0 text-right text-muted-foreground">
                    {e.date} · {e.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-5 text-xs text-muted-foreground">
            Connect your family calendar to let TED send proactive alerts for appointments and events.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const children = familyMembers.filter((m) => m.relationship === "Child");
const recurrenceOptions = ["Once", "Weekdays", "Weekly"];

function RemindersSection() {
  const [reminders, setReminders] = React.useState<FamilyReminder[]>(initialFamilyReminders);
  const [showForm, setShowForm] = React.useState(false);
  const [recipientId, setRecipientId] = React.useState(children[0]?.id ?? "");
  const [message, setMessage] = React.useState("");
  const [time, setTime] = React.useState("");
  const [recurrence, setRecurrence] = React.useState(recurrenceOptions[0]);
  const [justAdded, setJustAdded] = React.useState(false);

  const toggleReminder = (id: string, enabled: boolean) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
  };

  const saveReminder = () => {
    if (!message.trim() || !time.trim() || !recipientId) return;
    setReminders((prev) => [
      ...prev,
      { id: `rem-${Date.now()}`, recipientId, message: message.trim(), time: time.trim(), recurrence, enabled: true },
    ]);
    setMessage("");
    setTime("");
    setRecurrence(recurrenceOptions[0]);
    setShowForm(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-[var(--ted-blue)]" />
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
              Automated Reminders
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Ask TED to send a text reminder to anyone in the family — like letting your daughter know when
            you&apos;ll pick her up from school.
          </p>

          {reminders.map((r, i) => (
            <React.Fragment key={r.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{ownerName(r.recipientId)}</p>
                  <p className="truncate text-xs text-muted-foreground">&ldquo;{r.message}&rdquo;</p>
                  <p className="text-xs text-muted-foreground">{r.time} · {r.recurrence}</p>
                </div>
                <Switch
                  checked={r.enabled}
                  onCheckedChange={(v) => toggleReminder(r.id, v)}
                  aria-label={`Reminder to ${ownerName(r.recipientId)}`}
                />
              </div>
              {i < reminders.length - 1 && <Separator />}
            </React.Fragment>
          ))}

          {justAdded && (
            <ActionStatusBanner state="done" pendingLabel="" doneLabel="Reminder scheduled" />
          )}
        </CardContent>
      </Card>

      {showForm ? (
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">New reminder</p>
            <div className="flex gap-2">
              {children.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setRecipientId(c.id)}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                    recipientId === c.id
                      ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)] text-white"
                      : "border-border text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <Input
              placeholder="e.g. I'm picking you up from school at 4:30 PM"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input placeholder="Time, e.g. 4:30 PM" value={time} onChange={(e) => setTime(e.target.value)} />
            <div className="flex gap-2">
              {recurrenceOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRecurrence(opt)}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                    recurrence === opt
                      ? "border-[var(--rogers-red-bright)]/50 bg-[rgba(255,45,107,0.1)] text-white"
                      : "border-border text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={saveReminder}>
                Save Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="secondary" className="w-full justify-center" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add a Reminder
        </Button>
      )}
    </div>
  );
}

export default function FamilyPage() {
  const [devices, setDevices] = React.useState<ChildDevice[]>(childDevices);
  const { statuses, trigger } = useActionStatusMap();

  const updateDevice = (next: ChildDevice) => {
    setDevices((prev) => prev.map((d) => (d.id === next.id ? next : d)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit border-[var(--ted-violet)]/40 bg-white/5">
          Family Services
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED manages your family&apos;s connectivity and schedule</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          From Wi-Fi schedules and content filtering to calendar alerts and reminders — TED coordinates directly
          with Rogers and your family calendar, so you don&apos;t have to.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
          Network &amp; Screen Time
        </p>
        {devices.map((d) => (
          <NetworkDeviceCard
            key={d.id}
            device={d}
            onChange={updateDevice}
            status={statuses[d.id] ?? "idle"}
            onAction={() => trigger(d.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
          Family Calendar Alerts
        </p>
        <FamilyCalendarSection statuses={statuses} trigger={trigger} />
      </div>

      <div className="flex flex-col gap-3">
        <RemindersSection />
      </div>
    </div>
  );
}
