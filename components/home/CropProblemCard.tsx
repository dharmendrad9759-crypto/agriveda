"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  HOME_CARD_PROBLEMS,
  getCropProblem,
} from "@/data/crop-curative-problems";
import { track } from "@/lib/analytics";

/**
 * Home card for /crop-problems only.
 * Photos are preview only — open via the green button.
 */
export default function CropProblemCard() {
  const { locale } = useLocale();
  const isHi = locale === "hi";

  const problems = HOME_CARD_PROBLEMS.map((f) => {
    const found = getCropProblem(f.cropSlug, f.problemId);
    return {
      ...f,
      image: found?.problem.image ?? "/images/home/home-job-yellow-leaf.jpg",
    };
  });

  return (
    <section aria-label={isHi ? "फसल समस्या पहचानें" : "Identify crop problem"}>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 p-3.5 shadow-lg shadow-emerald-900/25">
        <div className="relative z-10">
          <p className="text-[16px] font-bold leading-tight text-white sm:text-[17px]">
            {isHi ? "खेत में क्या समस्या है?" : "What is the field problem?"}
          </p>
          <p className="mt-1 text-[12px] font-medium leading-snug text-emerald-100/85">
            {isHi
              ? "समस्या पहचानो · कारण समझो · सही समाधान पाओ"
              : "Spot problem · know cause · get the right cure"}
          </p>
        </div>

        {/* Preview only — not clickable */}
        <div className="relative z-10 mt-3.5 grid grid-cols-5 gap-1.5" aria-hidden>
          {problems.map((problem) => (
            <div key={problem.slug} className="flex min-w-0 flex-col items-center">
              <span className="relative block aspect-square w-full overflow-hidden rounded-[14px] border border-white/20 bg-white/5 shadow-md shadow-black/30">
                <Image
                  src={problem.image}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </span>
              <span className="mt-1.5 line-clamp-2 min-h-[2rem] text-center text-[10px] font-bold leading-tight text-emerald-50">
                {isHi ? problem.nameHi : problem.nameEn}
              </span>
            </div>
          ))}
        </div>

        <AppLink
          href="/crop-problems"
          onClick={() => track("tool_open", { href: "/crop-problems", label: "home_crop_problem_cta" })}
          className="relative z-10 mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-white/90 px-4 py-3 text-[14px] font-bold text-emerald-950 shadow-md shadow-black/20 transition active:scale-[0.99]"
        >
          {isHi ? "सभी फसल · समस्याएं देखें" : "See all crop problems"}
          <ArrowRight size={18} strokeWidth={2.5} />
        </AppLink>

        <p className="relative z-10 mt-2 text-center text-[10px] font-medium text-emerald-200/90">
          {isHi ? "इलाज · दवा · कब छिड़कें — अंदर" : "Cure · dose · when to spray — inside"}
        </p>
      </div>
    </section>
  );
}
