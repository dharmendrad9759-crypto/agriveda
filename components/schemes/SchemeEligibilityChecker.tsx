"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  EMPTY_ELIGIBILITY,
  evaluateSchemeEligibility,
  rankSchemesForAnswers,
  resultCopy,
  type EligibilityAnswers,
  type EligibilityResultKind,
} from "@/lib/schemes/eligibilityGuidance";
import type { FarmerScheme } from "@/data/schemes/farmerSchemes";
import { INDIAN_STATES } from "@/lib/india-locations";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const LANDHOLDER: { id: EligibilityAnswers["landholder"]; hi: string; en: string }[] = [
  { id: "yes", hi: "हाँ, भूमि मेरे/परिवार के नाम", en: "Yes, land in my/family name" },
  { id: "no", hi: "नहीं / भूमिहीन", en: "No / landless" },
  { id: "unsure", hi: "पक्का नहीं", en: "Not sure" },
];

const LAND_SIZE: { id: EligibilityAnswers["landSize"]; hi: string; en: string }[] = [
  { id: "none", hi: "भूमि नहीं / किराये पर", en: "No land / tenant" },
  { id: "marginal", hi: "1 हेक्टेयर से कम", en: "Under 1 hectare" },
  { id: "small", hi: "1–2 हेक्टेयर", en: "1–2 hectares" },
  { id: "medium_plus", hi: "2 हेक्टेयर से अधिक", en: "Over 2 hectares" },
];

const ACTIVITY: { id: EligibilityAnswers["activity"]; hi: string; en: string }[] = [
  { id: "crop", hi: "फसल खेती", en: "Field crops" },
  { id: "horticulture", hi: "बागवानी / सब्ज़ी", en: "Horticulture" },
  { id: "livestock", hi: "पशुपालन / डेयरी", en: "Livestock / dairy" },
  { id: "fishery", hi: "मत्स्य", en: "Fishery" },
  { id: "processing", hi: "प्रोसेसिंग / उद्यम", en: "Processing / enterprise" },
];

const AGE: { id: EligibilityAnswers["ageBand"]; hi: string; en: string }[] = [
  { id: "under18", hi: "18 से कम", en: "Under 18" },
  { id: "18to40", hi: "18–40 वर्ष", en: "18–40 years" },
  { id: "over40", hi: "40 से अधिक", en: "Over 40" },
];

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={AV.label}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(AV.input, "mt-1 w-full")}
      >
        {children}
      </select>
    </label>
  );
}

function ResultBanner({ kind, hi }: { kind: EligibilityResultKind; hi: boolean }) {
  const copy = resultCopy(kind);
  const tone =
    kind === "likely"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 dark:text-emerald-50"
      : kind === "need_more"
        ? "border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-50"
        : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]";

  return (
    <div className={cn("rounded-xl border px-3 py-2.5", tone)}>
      <p className="text-[13px] font-bold">{hi ? copy.titleHi : copy.titleEn}</p>
      <p className="mt-1 text-[11px] leading-relaxed">{hi ? copy.bodyHi : copy.bodyEn}</p>
    </div>
  );
}

export default function SchemeEligibilityChecker({
  hi,
  schemes,
  initialState,
  focusScheme,
  onMatches,
}: {
  hi: boolean;
  schemes: FarmerScheme[];
  initialState?: string;
  focusScheme?: FarmerScheme;
  onMatches?: (matches: FarmerScheme[]) => void;
}) {
  const [answers, setAnswers] = useState<EligibilityAnswers>({
    ...EMPTY_ELIGIBILITY,
    state: initialState ?? "",
  });
  const [submitted, setSubmitted] = useState(false);

  const patch = (next: Partial<EligibilityAnswers>) => {
    setSubmitted(false);
    setAnswers((prev) => ({ ...prev, ...next }));
  };

  const matches = useMemo(() => rankSchemesForAnswers(schemes, answers), [schemes, answers]);
  const focusKind = focusScheme ? evaluateSchemeEligibility(focusScheme, answers) : null;

  return (
    <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
      <p className="text-[15px] font-bold text-[var(--av-text-primary)]">
        {hi ? "प्रारंभिक पात्रता जांचें" : "Check preliminary eligibility"}
      </p>
      <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
        {hi
          ? "आधार, बैंक खाता, OTP या PIN न भरें। अंतिम पात्रता विभाग तय करता है।"
          : "Do not enter Aadhaar, bank numbers, OTP, or PIN. Final eligibility is official."}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <SelectField
          label={hi ? "राज्य" : "State"}
          value={answers.state}
          onChange={(state) => patch({ state })}
        >
          <option value="">{hi ? "राज्य चुनें" : "Select state"}</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </SelectField>
        <SelectField
          label={hi ? "क्या आप भूमिधारक हैं?" : "Are you a landholder?"}
          value={answers.landholder}
          onChange={(landholder) => patch({ landholder: landholder as EligibilityAnswers["landholder"] })}
        >
          <option value="">{hi ? "चुनें" : "Select"}</option>
          {LANDHOLDER.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {hi ? opt.hi : opt.en}
            </option>
          ))}
        </SelectField>
        <SelectField
          label={hi ? "भूमि आकार (लगभग)" : "Land size (approx.)"}
          value={answers.landSize}
          onChange={(landSize) => patch({ landSize: landSize as EligibilityAnswers["landSize"] })}
        >
          <option value="">{hi ? "वैकल्पिक" : "Optional"}</option>
          {LAND_SIZE.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {hi ? opt.hi : opt.en}
            </option>
          ))}
        </SelectField>
        <SelectField
          label={hi ? "मुख्य गतिविधि" : "Main activity"}
          value={answers.activity}
          onChange={(activity) => patch({ activity: activity as EligibilityAnswers["activity"] })}
        >
          <option value="">{hi ? "वैकल्पिक" : "Optional"}</option>
          {ACTIVITY.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {hi ? opt.hi : opt.en}
            </option>
          ))}
        </SelectField>
        <SelectField
          label={hi ? "आयु वर्ग (पेंशन योजनाओं के लिए)" : "Age band (pension schemes)"}
          value={answers.ageBand}
          onChange={(ageBand) => patch({ ageBand: ageBand as EligibilityAnswers["ageBand"] })}
        >
          <option value="">{hi ? "वैकल्पिक" : "Optional"}</option>
          {AGE.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {hi ? opt.hi : opt.en}
            </option>
          ))}
        </SelectField>
      </div>

      <button
        type="button"
        className={cn("mt-3 w-full", AV.btnPrimary)}
        onClick={() => {
          setSubmitted(true);
          onMatches?.(matches);
        }}
      >
        {hi ? "प्रारंभिक जाँच करें" : "Run preliminary check"}
      </button>

      {submitted && focusKind ? <div className="mt-3"><ResultBanner kind={focusKind} hi={hi} /></div> : null}
      {submitted && !focusScheme ? (
        <div className="mt-3 space-y-2">
          <ResultBanner kind={matches.length ? "likely" : "need_more"} hi={hi} />
          <p className="text-[11px] text-[var(--av-text-muted)]">
            {hi
              ? `${matches.length} योजनाएँ प्रारंभिक मेल खाती दिखती हैं — कार्ड खोलकर आधिकारिक शर्तें देखें।`
              : `${matches.length} schemes appear to match preliminarily — open a card for official conditions.`}
          </p>
        </div>
      ) : null}
    </section>
  );
}
