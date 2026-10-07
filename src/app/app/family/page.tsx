"use client";

import * as React from "react";
import Link from "next/link";
import { School, Play, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { familyMembers } from "@/data/customer-data";

export default function FamilyPage() {
  const [locationSharing, setLocationSharing] = React.useState<Record<string, boolean>>({
    "fam-1": true,
    "fam-2": true,
    "fam-3": true,
    "fam-4": true,
  });
  const [screenTimeAlerts, setScreenTimeAlerts] = React.useState<Record<string, boolean>>({
    "fam-3": true,
    "fam-4": true,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="warning" className="w-fit">
          Family Safety
        </Badge>
        <h1 className="text-xl font-bold leading-tight">TED knows which calls need you</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Trusted institutions are recognized instantly and escalated as high priority.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <School className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Elmwood Middle School</p>
            <p className="text-xs text-muted-foreground">Trusted institution · always escalated</p>
          </div>
          <Badge variant="warning">High Priority</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--ted-blue)]">
            Family Members
          </p>
          {familyMembers.map((m, i) => (
            <React.Fragment key={m.id}>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.relationship} · {m.age} · {m.deviceModel}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Location sharing</p>
                  <Switch
                    checked={locationSharing[m.id] ?? false}
                    onCheckedChange={(v) => setLocationSharing((prev) => ({ ...prev, [m.id]: v }))}
                    aria-label={`Location sharing for ${m.name}`}
                  />
                </div>
                {(m.relationship === "Child") && (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">Screen time alerts</p>
                    <Switch
                      checked={screenTimeAlerts[m.id] ?? false}
                      onCheckedChange={(v) => setScreenTimeAlerts((prev) => ({ ...prev, [m.id]: v }))}
                      aria-label={`Screen time alerts for ${m.name}`}
                    />
                  </div>
                )}
              </div>
              {i < familyMembers.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-xs text-muted-foreground">
            TED always lets urgent calls from trusted institutions ring straight through — no setting can silence
            them.
          </p>
        </CardContent>
      </Card>

      <Link href="/app/demo/family-safety">
        <Button variant="secondary" className="w-full justify-center">
          <Play className="h-3.5 w-3.5" />
          See a live example
        </Button>
      </Link>
    </div>
  );
}
