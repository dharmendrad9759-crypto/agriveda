"use client";

import AppLink from "@/components/ui/AppLink";
import { Camera, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AiDiagnosticBanner() {
  const { t } = useLocale();

  return (
    <AppLink href="/ai-doctor" className="block active:scale-[0.99]">
      <GlassCard
        hover
        neon
        className="flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-600/10 to-teal-500/10 p-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-600">
            <Camera className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              {t("aiDiagBadge")}
            </p>
            <p className="text-sm font-extrabold theme-text-primary">{t("aiDiagTitle")}</p>
          </div>
        </div>
        <span className="flex items-center gap-0.5 rounded-full bg-[#006432] px-3 py-1 text-[10px] font-bold text-white">
          {t("aiDiagCta")}
          <ChevronRight className="h-3 w-3" />
        </span>
      </GlassCard>
    </AppLink>
  );
}
