"use client";

import type { MoASuggestion } from "@/types/spray-rotation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { SprayRotationSparkleIcon } from "@/components/brand/icons";
import GlassCard from "@/components/ui/GlassCard";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";

interface SuggestedSprayCardProps {
  suggestions: MoASuggestion[];
  title?: string;
  emptyMessage?: string;
}

export default function SuggestedSprayCard({
  suggestions,
  title = "अगली बार कौन-सी बदलकर दवा डालें",
  emptyMessage = "कोई अलग दवा उपलब्ध नहीं है। कृपया कृषि विशेषज्ञ से परामर्श लें।",
}: SuggestedSprayCardProps) {
  if (suggestions.length === 0) {
    return (
      <GlassCard className="p-4">
        <p className="text-sm font-bold theme-text-primary">{title}</p>
        <p className="mt-2 text-xs theme-text-muted">{emptyMessage}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2">
        <SprayRotationSparkleIcon className="h-4 w-4 text-emerald-500" />
        <p className="text-sm font-extrabold theme-text-primary">{title}</p>
      </div>
      <p className="mt-0.5 text-[11px] theme-text-muted">
        (ताकि कीट/रोग पर दवा बेअसर न हो और पूरा असर मिले)
      </p>

      <div className="mt-3 space-y-3">
        {suggestions.map((s, i) => {
          const catLabel =
            s.product.category === "fungicide"
              ? "फफूंदनाशक"
              : s.product.category === "herbicide"
                ? "खरपतवारनाशक"
                : "कीटनाशक";

          const purposeLabel =
            s.product.category === "fungicide"
              ? "फफूंद व रोग नियंत्रण"
              : s.product.category === "herbicide"
                ? "खरपतवार नियंत्रण"
                : "कीट व इल्ली रोकथाम";

          return (
            <div
              key={s.product.id}
              className="flex overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 shadow-xs"
            >
              <div className="flex items-center justify-center p-2 bg-emerald-500/10">
                <ChemBottleThumb technical={s.product.activeIngredient} size="sm" />
              </div>
              <div className="min-w-0 flex-1 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-md bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                      {catLabel}
                    </span>
                    <h3 className="mt-1 text-[13px] font-black theme-text-primary leading-tight">
                      {s.product.productName}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                    विकल्प #{i + 1}
                  </span>
                </div>

                {/* Technical name */}
                <p className="mt-1 text-[11px] font-medium text-[var(--av-text-secondary)]">
                  <span className="font-bold">तकनीकी (Technical): </span>
                  {s.product.activeIngredient}
                </p>

                {/* Purpose */}
                <p className="mt-1 text-[11px] font-bold text-sky-800 dark:text-sky-300">
                  🎯 किस रोग/कीट के लिए: {purposeLabel}
                </p>

                {/* Dose per acre */}
                <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-900 dark:text-emerald-200">
                  <span>💧 अनुशंसित मात्रा: </span>
                  <span>{s.product.doseHint ? s.product.doseHint : "लेबल के अनुसार"}</span>
                </div>

                {/* Farmer Friendly Reason Tag */}
                <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  {s.reason || "बदलकर डालने के लिए सुरक्षित व असरदार दवा"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
