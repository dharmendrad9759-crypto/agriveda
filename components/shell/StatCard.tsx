"use client";

import AppLink from "@/components/ui/AppLink";
import type { LucideIcon } from "lucide-react";
import DarkCard from "./DarkCard";
import { AV } from "@/lib/design/tokens";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string;
  sub?: string;
  action?: { label: string; href: string };
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  iconColor = "text-[var(--av-accent)]",
  label,
  value,
  sub,
  action,
  delay = 0,
}: StatCardProps) {
  return (
    <DarkCard hover delay={delay} className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] ${iconColor}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={AV.label}>{label}</p>
      <p className={AV.statValue}>{value}</p>
      {sub && <p className={AV.sectionSubtitle}>{sub}</p>}
      {action && (
        <AppLink href={action.href} className={`mt-auto ${AV.link}`}>
          {action.label} →
        </AppLink>
      )}
    </DarkCard>
  );
}
