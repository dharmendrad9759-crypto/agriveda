import { Sprout } from "lucide-react";
import type { ExpertAdviceItem } from "@/data/crop-dashboard";

interface ExpertAdviceCardProps {
  advice: ExpertAdviceItem;
  compact?: boolean;
}

export default function ExpertAdviceCard({ advice, compact = false }: ExpertAdviceCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-sm font-bold text-emerald-700">
            {advice.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-gray-900">{advice.farmerName}</span>
            <span className="text-xs text-gray-500">• {advice.crop}</span>
          </div>
          <p className="text-[11px] text-gray-400">{advice.location} • {advice.date}</p>
        </div>
      </div>

      <p className={`mt-3 text-sm text-gray-700 leading-relaxed ${compact ? "line-clamp-2" : ""}`}>
        {advice.query}
      </p>
      {!compact && (
        <button type="button" className="mt-1 text-sm font-semibold text-[#2D8A5B]">
          Read more
        </button>
      )}

      <div className="mt-3 rounded-xl bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006432]">
            <Sprout className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{advice.expertName}</p>
            <p className="text-[10px] text-gray-400">{advice.expertDate}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
          {advice.answerPreview}
        </p>
        <button type="button" className="mt-2 text-xs font-bold text-[#2D8A5B]">
          View full answer
        </button>
      </div>
    </div>
  );
}
