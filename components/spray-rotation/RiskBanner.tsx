"use client";

import type { ResistanceCheckResult } from "@/types/spray-rotation";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface RiskBannerProps {
  result: ResistanceCheckResult;
  labels: { low: string; medium: string; high: string; consecutive: string };
}

export default function RiskBanner({ result, labels }: RiskBannerProps) {
  const configMap = {
    low: {
      icon: CheckCircle,
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30",
      text: "text-emerald-800 dark:text-emerald-300",
      label: labels?.low ?? "कम जोखिम",
    },
    medium: {
      icon: AlertCircle,
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30",
      text: "text-amber-800 dark:text-amber-300",
      label: labels?.medium ?? "मध्यम जोखिम",
    },
    high: {
      icon: AlertTriangle,
      bg: "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
      text: "text-red-800 dark:text-red-300",
      label: labels?.high ?? "उच्च जोखिम",
    },
  };

  const riskKey = result?.risk && result.risk in configMap ? result.risk : "low";
  const config = configMap[riskKey];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-2xl border p-4", config.bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0", config.text)} />
        <div>
          <p className={cn("text-sm font-extrabold", config.text)}>{result?.title ?? "स्प्रे चक्र स्थिति"}</p>
          <p className={cn("mt-1 text-xs leading-relaxed", config.text)}>{result?.message ?? ""}</p>
          {result?.consecutiveWarning && (
            <p className={cn("mt-2 text-xs font-bold", config.text)}>⚠ {labels?.consecutive ?? "लगातार एक ही ग्रुप का स्प्रे न दोहराएं"}</p>
          )}
          {result?.lastThreeGroups && result.lastThreeGroups.length > 0 && (
            <p className="mt-2 text-[10px] font-semibold opacity-90">
              पिछली दवा क्रम: {result.lastThreeGroups.join(" ➔ ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
