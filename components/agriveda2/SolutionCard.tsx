"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Beaker,
  Clock,
  Leaf,
  Shield,
} from "lucide-react";
import CommunityFeedbackBar from "@/components/agriveda2/CommunityFeedbackBar";

export interface SolutionCardData {
  id: string;
  title: string;
  pathogen?: string;
  diagnosis: string;
  organicTreatments: string[];
  chemicalTreatments: string[];
  phi?: string;
  tankMixSafe?: string[];
  tankMixAvoid?: string[];
  shopName?: string;
  shopDistance?: string;
}

export default function SolutionCard({ data }: { data: SolutionCardData }) {
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-black/30">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-3">
        <h2 className="text-lg font-extrabold text-white">{data.title}</h2>
        {data.pathogen && (
          <p className="text-xs text-emerald-100">Pathogen: {data.pathogen}</p>
        )}
      </div>

      <div className="space-y-4 p-4">
        <section>
          <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gray-700">
            <Shield className="h-4 w-4 text-emerald-600" />
            क्या हो रहा है
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {data.diagnosis}
          </p>
        </section>

        <section className="rounded-xl border border-green-200 bg-green-50 p-3 dark:bg-green-500/10">
          <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase text-green-900 dark:text-green-300">
            <Leaf className="h-4 w-4" />
            जैविक इलाज (पहली कोशिश)
          </h3>
          <ul className="mt-2 space-y-1">
            {data.organicTreatments.map((t, i) => (
              <li key={i} className="text-sm text-green-900 dark:text-green-200">
                ✔ {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:bg-amber-500/10">
          <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-950">
            <Beaker className="h-4 w-4" />
            Chemical इलाज (ज़रूरी हो तो)
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            {data.chemicalTreatments.map((t, i) => (
              <li key={i} className="text-sm text-amber-950 dark:text-amber-100">
                {t}
              </li>
            ))}
          </ol>
        </section>

        {data.phi && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="text-xs font-bold text-red-900">
              PHI: {data.phi}
            </p>
          </div>
        )}

        {(data.tankMixSafe?.length || data.tankMixAvoid?.length) && (
          <section className="text-xs">
            <p className="font-bold text-gray-800">Tank-mix:</p>
            {data.tankMixSafe?.map((s) => (
              <p key={s} className="text-emerald-700">
                ✔ {s}
              </p>
            ))}
            {data.tankMixAvoid?.map((s) => (
              <p key={s} className="text-red-700">
                ❌ {s}
              </p>
            ))}
          </section>
        )}

        {data.shopName && (
          <p className="rounded-xl bg-gray-50 p-3 text-xs font-medium text-gray-700 dark:bg-white/5">
            📍 {data.shopName}
            {data.shopDistance ? ` — ${data.shopDistance}` : ""} — stock available
          </p>
        )}

        <CommunityFeedbackBar solutionId={data.id} />

        <div className="flex gap-2">
          <Link
            href="/kisan-saathi"
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-extrabold text-white"
          >
            Doctor से पूछें
          </Link>
          <Link
            href="/weather/spray-advisory"
            className="flex-1 rounded-xl border border-gray-300 py-2.5 text-center text-xs font-extrabold theme-text-primary"
          >
            Spray check
          </Link>
        </div>
      </div>
    </article>
  );
}

export function solutionFromIssue(issue: {
  id: string;
  name: string;
  diagnosis: string;
  immediateActions: string[];
  prevention: string[];
}): SolutionCardData {
  const organic = issue.prevention.filter((p) =>
    /neem|trichoderma|bio|organic|जैविक/i.test(p)
  );
  const chem = issue.immediateActions;

  return {
    id: issue.id,
    title: issue.name,
    diagnosis: issue.diagnosis,
    organicTreatments: organic.length
      ? organic
      : ["Trichoderma viride 4 g/L foliar", "Neem oil 1500 ppm — 3 ml/L morning spray"],
    chemicalTreatments: chem,
    phi: "कटाई से 7–14 दिन पहले chemical spray बंद करें (label देखें)",
    tankMixSafe: ["Boron 0.1% at fruiting if deficient"],
    tankMixAvoid: ["Copper + Mancozeb in same tank without jar test"],
    shopName: "Sharma Agro Store",
    shopDistance: "2.8 km",
  };
}
