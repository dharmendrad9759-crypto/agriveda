"use client";

import { Sprout, Ruler, CloudSun, Mountain } from "lucide-react";
import type { CropManagementProfile } from "@/types/crop-management";

interface CropQuickFactsProps {
  profile: CropManagementProfile;
}

export default function CropQuickFacts({ profile }: CropQuickFactsProps) {
  const facts = [
    { icon: Sprout, label: "Seed rate", value: profile.seedRate, hint: "per acre" },
    { icon: Ruler, label: "Spacing", value: profile.spacing },
    { icon: CloudSun, label: "Weather need", value: profile.climate },
    { icon: Mountain, label: "Soil", value: profile.soil },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {facts.map((fact) => {
        const Icon = fact.icon;
        return (
          <div
            key={fact.label}
            className="rounded-2xl border border-emerald-500/15 bg-white/80 p-3 dark:bg-black/30"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wide theme-text-muted">
              {fact.label}
              {fact.hint ? ` (${fact.hint})` : ""}
            </p>
            <p className="mt-1 line-clamp-3 text-xs font-bold leading-snug theme-text-primary">
              {fact.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
