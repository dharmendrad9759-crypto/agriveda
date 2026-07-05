"use client";

import Link from "next/link";
import { Sprout, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function EmptyCropsCard() {
  const { t } = useLocale();
  return (
    <Link href="/select-crops">
      <GlassCard
        neon
        className="flex items-center gap-4 border-2 border-dashed border-emerald-500/30 p-5"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
          <Sprout className="h-7 w-7 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold theme-text-primary">{t("emptyCropsTitle")}</p>
          <p className="mt-1 text-xs theme-text-muted leading-relaxed">{t("emptyCropsDesc")}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-emerald-600">
            {t("emptyCropsCta")}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
