"use client";

import type { MoASuggestion } from "@/types/spray-rotation";
import { Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface SuggestedSprayCardProps {
  suggestions: MoASuggestion[];
  title: string;
  emptyMessage?: string;
}

export default function SuggestedSprayCard({
  suggestions,
  title,
  emptyMessage,
}: SuggestedSprayCardProps) {
  if (suggestions.length === 0) {
    return (
      <GlassCard className="p-4">
        <p className="text-sm font-bold theme-text-primary">{title}</p>
        <p className="mt-2 text-xs theme-text-muted">
          {emptyMessage ?? "No alternate MoA products found. Consult local agronomist."}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <p className="text-sm font-extrabold theme-text-primary">{title}</p>
      </div>
      <div className="mt-3 space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={s.product.id}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-bold theme-text-primary">{s.product.productName}</p>
              <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                #{i + 1}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] italic theme-text-muted">
              {s.product.activeIngredient}
            </p>
            <p className="mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              {s.product.moaType} {s.product.moaGroup}
              {s.product.doseHint && ` • ${s.product.doseHint}`}
            </p>
            <p className="mt-1.5 text-[10px] theme-text-muted">{s.reason}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
