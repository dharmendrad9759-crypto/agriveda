"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import type { ExpertAdviceItem } from "@/data/crop-dashboard";
import GlassCard from "@/components/ui/GlassCard";

interface ExpertAdviceCardProps {
  advice: ExpertAdviceItem;
  compact?: boolean;
}

export default function ExpertAdviceCard({ advice, compact = false }: ExpertAdviceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <span className="text-sm font-bold text-emerald-400">
            {advice.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-sm font-extrabold text-white">{advice.farmerName}</span>
            <span className="text-xs text-slate-500">• {advice.crop}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {advice.location} • {advice.date}
          </p>
        </div>
      </div>

      <p className={`mt-3 text-sm text-slate-300 leading-relaxed ${!expanded && compact ? "line-clamp-2" : !expanded ? "line-clamp-3" : ""}`}>
        {advice.query}
      </p>
      {!compact && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm font-bold text-emerald-400"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <div className="mt-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15">
            <Sprout className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">{advice.expertName}</p>
            <p className="text-[10px] text-slate-500">{advice.expertDate}</p>
          </div>
        </div>
        <p className={`mt-2 text-xs text-slate-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
          {advice.answerPreview}
        </p>
        <AppLink href="/ask-query" className="mt-2 inline-block text-xs font-bold text-emerald-400">
          View full answer →
        </AppLink>
      </div>
    </GlassCard>
  );
}
