"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface IntelligenceField {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "destructive";
}

export function IntelligencePanel({
  title,
  fields,
  className,
}: {
  title: string;
  fields: IntelligenceField[];
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        {fields.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-xs text-muted-foreground">{field.label}</span>
            <span
              className={cn(
                "text-right text-sm font-semibold",
                field.tone === "success" && "text-emerald-400",
                field.tone === "warning" && "text-amber-400",
                field.tone === "destructive" && "text-red-400",
                (!field.tone || field.tone === "default") && "text-foreground"
              )}
            >
              {field.value}
            </span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
