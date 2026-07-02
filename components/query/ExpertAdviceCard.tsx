import { Sprout } from "lucide-react";
import type { ExpertAdviceItem } from "@/data/crop-dashboard";
import GlassCard from "@/components/ui/GlassCard";

interface ExpertAdviceCardProps {
  advice: ExpertAdviceItem;
  compact?: boolean;
}

export default function ExpertAdviceCard({ advice, compact = false }: ExpertAdviceCardProps) {
  return (
    <GlassCard strong className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50">
          <span className="text-sm font-bold text-emerald-700">
            {advice.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-extrabold text-slate-900">{advice.farmerName}</span>
            <span className="text-xs font-medium text-slate-500">• {advice.crop}</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            {advice.location} • {advice.date}
          </p>
        </div>
      </div>

      <p className={`mt-3 text-sm font-medium text-slate-700 leading-relaxed ${compact ? "line-clamp-2" : ""}`}>
        {advice.query}
      </p>
      {!compact && (
        <button type="button" className="mt-1 text-sm font-bold text-emerald-600">
          Read more
        </button>
      )}

      <div className="mt-3 rounded-2xl bg-gradient-to-r from-slate-50/80 to-emerald-50/50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-700">
            <Sprout className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">{advice.expertName}</p>
            <p className="text-[10px] font-medium text-slate-400">{advice.expertDate}</p>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed line-clamp-2">
          {advice.answerPreview}
        </p>
        <button type="button" className="mt-2 text-xs font-bold text-emerald-600">
          View full answer
        </button>
      </div>
    </GlassCard>
  );
}
