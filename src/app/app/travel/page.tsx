"use client";

import * as React from "react";
import Link from "next/link";
import { Plane, Play, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { travelPlans } from "@/data/customer-data";

export default function TravelPage() {
  const [autoRoaming, setAutoRoaming] = React.useState(true);
  const [flightAlerts, setFlightAlerts] = React.useState(true);
  const [weatherReminders, setWeatherReminders] = React.useState(true);
  const [currencyGuidance, setCurrencyGuidance] = React.useState(true);

  const trip = travelPlans[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="info" className="w-fit">
          Travel Assistant
        </Badge>
        <h1 className="text-xl font-bold leading-tight">Ready before you even pack</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          TED detects upcoming travel and proactively prepares everything you&apos;ll need abroad.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ted-blue)]/15 text-[var(--ted-blue)]">
            <Plane className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{trip.destination}</p>
            <p className="text-xs text-muted-foreground">
              {trip.departureDate} – {trip.returnDate} · {trip.airline} {trip.flightNumber}
            </p>
          </div>
          <Badge variant="info">Upcoming</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Auto-enable roaming pass</p>
              <p className="text-xs text-muted-foreground">Activate Roam Like Home automatically for detected trips</p>
            </div>
            <Switch checked={autoRoaming} onCheckedChange={setAutoRoaming} aria-label="Auto-enable roaming pass" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Flight status alerts</p>
              <p className="text-xs text-muted-foreground">Notify me of delays, gate changes, and boarding times</p>
            </div>
            <Switch checked={flightAlerts} onCheckedChange={setFlightAlerts} aria-label="Flight status alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Weather &amp; packing reminders</p>
              <p className="text-xs text-muted-foreground">Prepare a checklist based on destination forecast</p>
            </div>
            <Switch checked={weatherReminders} onCheckedChange={setWeatherReminders} aria-label="Weather and packing reminders" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Currency guidance</p>
              <p className="text-xs text-muted-foreground">Exchange rates and fee-free card recommendations</p>
            </div>
            <Switch checked={currencyGuidance} onCheckedChange={setCurrencyGuidance} aria-label="Currency guidance" />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full justify-center" disabled>
        <Plus className="h-3.5 w-3.5" />
        Add a trip
      </Button>

      <Link href="/app/demo/travel">
        <Button variant="secondary" className="w-full justify-center">
          <Play className="h-3.5 w-3.5" />
          See a live example
        </Button>
      </Link>
    </div>
  );
}
