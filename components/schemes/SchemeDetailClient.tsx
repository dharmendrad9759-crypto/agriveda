"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  Landmark,
  Laptop,
  MapPin,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
  XCircle,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import { CATEGORY_LABEL_HI, farmerSchemes } from "@/data/schemes/farmerSchemes";
import {
  SCHEMES_MISSING_SOURCE_EN,
  SCHEMES_MISSING_SOURCE_HI,
  hasOfficialSource,
} from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import {
  INDIAN_STATES_SCHEME_META,
  SCHEME_STATE_DETAILS,
  getSchemeStateStatus,
} from "@/data/schemes/schemeStateData";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { track } from "@/lib/analytics";
import { resolveSchemeImage } from "@/lib/schemes/schemeImages";
import { farmerSchemeName } from "@/lib/schemes/farmerSchemeCopy";
import { cn } from "@/lib/cn";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

const POPULAR_STATES = [
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "Bihar",
  "Haryana",
  "Punjab",
  "Maharashtra",
  "Chhattisgarh",
];

export default function SchemeDetailClient({ id }: { id: string }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const { profile } = useFarmerProfile();

  const scheme = farmerSchemes.find((s) => s.id === id);
  if (!scheme) notFound();

  // State selection: default to profile state or "Uttar Pradesh"
  const defaultState = useMemo(() => {
    if (profile.state && INDIAN_STATES_SCHEME_META[profile.state]) {
      return profile.state;
    }
    // Check if scheme has a designated state
    if (scheme.state && INDIAN_STATES_SCHEME_META[scheme.state]) {
      return scheme.state;
    }
    return "Uttar Pradesh";
  }, [profile.state, scheme.state]);

  const [selectedState, setSelectedState] = useState<string>(defaultState);
  const [applyMode, setApplyMode] = useState<"online" | "csc">("online");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean | null>>({});

  const img = resolveSchemeImage(scheme);
  const hasGuide = GUIDED.has(scheme.id);
  const leave = useOfficialLeave();
  const official = hasOfficialSource(scheme);
  const shortName = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, hi);

  // Dynamic state status info
  const stateStatus = useMemo(
    () => getSchemeStateStatus(scheme.id, selectedState),
    [scheme.id, selectedState]
  );

  const schemeMeta = SCHEME_STATE_DETAILS[scheme.id];

  const requestPortal = (from: string) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from, state: selectedState });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  let portalHost = "";
  try {
    if (scheme.officialSourceUrl) {
      portalHost = new URL(scheme.officialSourceUrl).hostname.replace(/^www\./, "");
    }
  } catch {
    portalHost = "";
  }

  // Document checklist calculation
  const totalDocs = scheme.docsHi.length;
  const checkedDocsCount = scheme.docsHi.filter((_, idx) => checkedDocs[idx]).length;
  const docsProgressPercent = totalDocs > 0 ? Math.round((checkedDocsCount / totalDocs) * 100) : 0;

  // Toggle document checked state
  const toggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Quiz state
  const quizList = schemeMeta?.quickQuiz ?? [];
  const answeredQuizCount = Object.keys(quizAnswers).filter((k) => quizAnswers[Number(k)] !== null).length;
  const allQuizPassed =
    quizList.length > 0 &&
    quizList.every((q, idx) => quizAnswers[idx] === q.mustBeYes);

  const handleQuizAnswer = (idx: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [idx]: answer }));
  };

  const resetQuiz = () => {
    setQuizAnswers({});
  };

  // Steps
  const onlineSteps = schemeMeta?.onlineSteps ?? scheme.stepsHi.map((s, idx) => ({
    step: idx + 1,
    titleHi: `चरण ${idx + 1}`,
    descHi: s,
    badge: "कदम",
  }));

  const offlineSteps = schemeMeta?.offlineSteps ?? [
    {
      step: 1,
      titleHi: "कागज़ात तैयार करें",
      descHi: "आधार कार्ड, बैंक पासबुक और खतौनी की साफ़ फोटोकॉपी साथ रखें।",
    },
    {
      step: 2,
      titleHi: "नजदीकी CSC केंद्र या कृषि कार्यालय जाएँ",
      descHi: "संचालक या कृषि अधिकारी को योजना का नाम बताकर बायोमेट्रिक e-KYC या फॉर्म भरवाएँ।",
    },
    {
      step: 3,
      titleHi: "पक्की रसीद (Acknowledgement Slip) लें",
      descHi: "आवेदन पूरा होने पर आवेदन क्रमांक वाली कंप्यूटराइज्ड रसीद अनिवार्य रूप से लें।",
    },
  ];

  const activeSteps = applyMode === "online" ? onlineSteps : offlineSteps;

  return (
    <AppShell
      title={shortName}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: hi ? "योजनाएँ" : "Schemes", href: "/schemes" },
        { label: hi ? "विवरण व आवेदन" : "Detail" },
      ]}
    >
      <div className="space-y-4 pb-32">
        {/* Navigation & Header Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-[12px] font-bold text-[var(--av-text-secondary)] shadow-sm transition active:scale-95 hover:text-[var(--av-text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{hi ? "पीछे जाएँ" : "Back"}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              {hi ? (scheme.level === "central" ? "🇮🇳 केंद्र सरकार" : "🏛️ राज्य सरकार") : scheme.level}
            </span>
            {official && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{hi ? "सत्यापित" : "Verified"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Card */}
        <section className="relative min-h-[160px] overflow-hidden rounded-3xl border border-emerald-900/20 shadow-xl shadow-emerald-950/20">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="640px"
            className="object-cover object-center"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-black/35" />
          <div className="relative z-10 flex min-h-[160px] flex-col justify-end p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200 backdrop-blur-md">
                {CATEGORY_LABEL_HI[scheme.category]}
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                {stateStatus.stateBadgeHi}
              </span>
            </div>

            <h1 className="mt-2 text-[22px] font-black leading-tight text-white drop-shadow-sm sm:text-[24px]">
              {shortName}
            </h1>
            <p className="mt-1 text-[12px] font-medium leading-snug text-emerald-100/90">
              {scheme.nameHi}
            </p>

            {scheme.benefitAmount ? (
              <div className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-3.5 py-1.5 text-[13px] font-black text-emerald-950 shadow-lg shadow-amber-950/20">
                <Sparkles className="h-4 w-4 text-emerald-900" />
                <span>{scheme.benefitAmount}</span>
              </div>
            ) : null}
          </div>
        </section>

        {/* SECTION 1: राज्य व आवेदन स्थिति (State Availability & Status Selector) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[14px] font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "राज्य अनुसार उपलब्धता व स्थिति" : "State Availability & Status"}
                </h2>
                <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                  {hi ? "अपना राज्य चुनें और आवेदन की स्थिति देखें" : "Select state to view application status"}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              {INDIAN_STATES_SCHEME_META[selectedState]?.stateHi || selectedState}
            </span>
          </div>

          {/* Quick State Selector Chips + Dropdown */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_STATES.map((st) => {
                const isSelected = selectedState === st;
                const stateHi = INDIAN_STATES_SCHEME_META[st]?.stateHi || st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSelectedState(st);
                      track("scheme_state_change", { id: scheme.id, state: st });
                    }}
                    className={cn(
                      "rounded-xl px-2.5 py-1 text-[11px] font-bold transition active:scale-95",
                      isSelected
                        ? "bg-emerald-950 text-white shadow-sm dark:bg-emerald-600"
                        : "border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-inset)]"
                    )}
                  >
                    {stateHi}
                  </button>
                );
              })}
            </div>

            {/* Dropdown for any state */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "अन्य राज्य:" : "Other state:"}
              </span>
              <div className="relative min-w-[150px] flex-1">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    track("scheme_state_change", { id: scheme.id, state: e.target.value });
                  }}
                  className="w-full appearance-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 pr-8 text-[12px] font-bold text-[var(--av-text-primary)] shadow-sm outline-none focus:border-emerald-600"
                  aria-label={hi ? "राज्य चुनें" : "Select state"}
                >
                  {Object.keys(INDIAN_STATES_SCHEME_META).map((st) => (
                    <option key={st} value={st}>
                      {INDIAN_STATES_SCHEME_META[st].stateHi} ({st})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
              </div>
            </div>
          </div>

          {/* Dynamic State Status Box */}
          <div
            className={cn(
              "rounded-2xl border p-3.5 transition",
              stateStatus.isApplicableInState
                ? "border-emerald-700/25 bg-emerald-500/10 dark:bg-emerald-950/30"
                : "border-amber-700/30 bg-amber-500/10 dark:bg-amber-950/30"
            )}
          >
            <div className="flex items-start gap-2.5">
              {stateStatus.isApplicableInState ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-[13px] font-extrabold leading-tight",
                      stateStatus.isApplicableInState
                        ? "text-emerald-950 dark:text-emerald-100"
                        : "text-amber-950 dark:text-amber-100"
                    )}
                  >
                    {stateStatus.stateMessageHi}
                  </p>
                </div>

                {stateStatus.deptNameHi && (
                  <p className="text-[11px] font-medium text-[var(--av-text-secondary)]">
                    <span className="font-bold">{hi ? "नोडल विभाग: " : "Nodal Department: "}</span>
                    {stateStatus.deptNameHi}
                  </p>
                )}

                {stateStatus.stateNote && (
                  <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    💡 {stateStatus.stateNote}
                  </p>
                )}
              </div>
            </div>

            {/* 3 Status Metric Pills */}
            <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-[var(--av-border)]/50 sm:grid-cols-3">
              <div className="rounded-xl bg-[var(--av-surface)]/80 p-2 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {hi ? "योजना स्थिति" : "Scheme"}
                </span>
                <p className="text-[12px] font-extrabold text-emerald-700 dark:text-emerald-300">
                  🟢 {hi ? "योजना चालू है" : "Active"}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--av-surface)]/80 p-2 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {hi ? "आवेदन स्थिति" : "Applications"}
                </span>
                <p className="text-[12px] font-extrabold text-blue-700 dark:text-blue-300">
                  {stateStatus.windowStatusTextHi}
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-[var(--av-surface)]/80 p-2 text-left sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {hi ? "आवेदन माध्यम" : "Mode"}
                </span>
                <p className="text-[11px] font-bold text-[var(--av-text-primary)]">
                  {hi ? "ऑनलाइन पोर्टल + CSC केंद्र" : "Online + CSC"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: योजना का मुख्य लाभ व उद्देश्य (Purpose & Benefits) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
              <Landmark className="h-4 w-4" />
            </div>
            <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
              {hi ? "योजना का उद्देश्य व मुख्य लाभ" : "Key Benefits & Purpose"}
            </h2>
          </div>

          <div className="rounded-xl bg-[var(--av-surface-inset)]/60 p-3.5 space-y-2">
            <p className="text-[13px] font-bold leading-relaxed text-[var(--av-text-primary)]">
              {scheme.purposeHi}
            </p>
            <p className="text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
              {scheme.benefitHi}
            </p>
          </div>

          {/* Quick Benefit Highlights */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-1">
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="text-[12px]">
                <p className="font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "भुगतान का माध्यम" : "Disbursement"}
                </p>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {stateStatus.disbursementTypeHi || (hi ? "DBT - सीधे बैंक खाते में" : "Direct Bank Transfer")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
                <Clock className="h-3.5 w-3.5" />
              </span>
              <div className="text-[12px]">
                <p className="font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "समय सीमा / विंडो" : "Timeline"}
                </p>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {stateStatus.applicationWindowHi || (hi ? "वर्ष भर आवेदन खुला" : "Year-round open")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: पात्रता मानदंड — कौन पात्र है और कौन नहीं? (Eligibility & Exclusions) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "पात्रता — कौन ले सकता है लाभ?" : "Eligibility Criteria"}
                </h2>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {hi ? "आवेदन करने से पहले अपनी पात्रता अवश्य जांचें" : "Check eligibility conditions before applying"}
                </p>
              </div>
            </div>
          </div>

          {/* 1. कौन पात्र है (Who qualifies) */}
          <div className="space-y-2">
            <div className="rounded-xl border border-emerald-800/15 bg-emerald-50/60 p-3 text-[13px] font-semibold text-[var(--av-text-primary)] dark:bg-emerald-950/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  <strong className="text-emerald-900 dark:text-emerald-200">
                    {hi ? "पात्र किसान श्रेणी: " : "Eligible category: "}
                  </strong>
                  {scheme.whoHi}
                </span>
              </div>
            </div>

            {scheme.tipsHi.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 px-2 text-[12px] font-medium leading-relaxed text-[var(--av-text-secondary)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* 2. कौन अपात्र है (Exclusions / Who is NOT eligible) */}
          {schemeMeta?.ineligibilityHi && schemeMeta.ineligibilityHi.length > 0 && (
            <div className="mt-3 rounded-xl border border-rose-700/20 bg-rose-50/40 p-3 text-[12px] dark:bg-rose-950/20">
              <div className="flex items-center gap-1.5 pb-1.5 font-bold text-rose-900 dark:text-rose-200">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>{hi ? "किन किसानों को लाभ नहीं मिलेगा (अपात्रता शर्तें):" : "Who is NOT eligible:"}</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-rose-950/80 dark:text-rose-200/80">
                {schemeMeta.ineligibilityHi.map((item, idx) => (
                  <li key={idx} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. त्वरित पात्रता जांच (Instant Quick Quiz) */}
          {quizList.length > 0 && (
            <div className="mt-3 rounded-2xl border border-emerald-800/20 bg-[var(--av-surface-inset)]/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="text-[13px] font-black text-[var(--av-text-primary)]">
                    {hi ? "⚡ त्वरित पात्रता जांच (3 आसान सवाल)" : "Instant Eligibility Check"}
                  </h3>
                </div>
                {answeredQuizCount > 0 && (
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{hi ? "रीसेट" : "Reset"}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {quizList.map((q, idx) => {
                  const ans = quizAnswers[idx];
                  const hasAnswered = ans !== undefined && ans !== null;
                  const isOk = hasAnswered && ans === q.mustBeYes;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-xl border p-2.5 text-[12px] transition",
                        !hasAnswered
                          ? "border-[var(--av-border)] bg-[var(--av-surface)]"
                          : isOk
                          ? "border-emerald-600/30 bg-emerald-500/10"
                          : "border-rose-600/30 bg-rose-500/10"
                      )}
                    >
                      <p className="font-bold text-[var(--av-text-primary)]">{q.questionHi}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuizAnswer(idx, true)}
                          className={cn(
                            "rounded-lg px-3 py-1 text-[11px] font-black transition active:scale-95",
                            ans === true
                              ? "bg-emerald-700 text-white"
                              : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                          )}
                        >
                          {hi ? "हाँ (Yes)" : "Yes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuizAnswer(idx, false)}
                          className={cn(
                            "rounded-lg px-3 py-1 text-[11px] font-black transition active:scale-95",
                            ans === false
                              ? "bg-emerald-700 text-white"
                              : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                          )}
                        >
                          {hi ? "नहीं (No)" : "No"}
                        </button>

                        {hasAnswered && (
                          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold">
                            {isOk ? (
                              <span className="text-emerald-700 dark:text-emerald-300">✅ पात्र</span>
                            ) : (
                              <span className="text-rose-700 dark:text-rose-300">⚠️ ध्यान दें</span>
                            )}
                          </span>
                        )}
                      </div>

                      {hasAnswered && !isOk && (
                        <p className="mt-2 text-[11px] font-medium text-rose-800 dark:text-rose-200">
                          {q.failHintHi}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {answeredQuizCount === quizList.length && (
                <div
                  className={cn(
                    "rounded-xl p-3 text-center text-[12px] font-extrabold transition",
                    allQuizPassed
                      ? "bg-emerald-800 text-white shadow-md"
                      : "bg-amber-100 text-amber-950 border border-amber-300"
                  )}
                >
                  {allQuizPassed
                    ? hi
                      ? "🎉 बधाई! आप इस योजना के लिए पूरी तरह पात्र लग रहे हैं। नीचे दिए गए दस्तावेज़ तैयार करें और आवेदन करें।"
                      : "🎉 Congratulations! You appear fully eligible for this scheme."
                    : hi
                    ? "⚠️ कुछ शर्तों पर ध्यान देना आवश्यक है। सटीक पुष्टि के लिए नजदीकी CSC या कृषि कार्यालय से संपर्क करें।"
                    : "⚠️ Please review the criteria above before applying."}
                </div>
              )}
            </div>
          )}

          {hasGuide && (
            <AppLink
              href={`/schemes/${scheme.id}/guide`}
              className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[12px] font-extrabold text-emerald-900 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100"
            >
              <span>{hi ? "📋 विस्तृत पात्रता कैलकुलेटर व स्टेप गाइड खोलें" : "Open detailed eligibility wizard"}</span>
              <ChevronRight className="h-4 w-4" />
            </AppLink>
          )}
        </section>

        {/* SECTION 4: ज़रूरी दस्तावेज़ चेकलिस्ट (Interactive Required Documents) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "ज़रूरी दस्तावेज़ (कागज़ात चेकलिस्ट)" : "Required Documents"}
                </h2>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {hi ? "कागज़ात टिक करें और अपनी तैयारी जांचें" : "Tick documents as you prepare"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
              {checkedDocsCount} / {totalDocs} {hi ? "तैयार" : "ready"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                style={{ width: `${docsProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-[var(--av-text-muted)]">
              <span>{docsProgressPercent}% {hi ? "तैयारी पूरी" : "completed"}</span>
              <span>{docsProgressPercent === 100 ? (hi ? "✅ आवेदन के लिए तैयार!" : "Ready to apply!") : (hi ? "कागज़ात पूरे करें" : "Complete docs")}</span>
            </div>
          </div>

          {/* Interactive Document Grid */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {scheme.docsHi.map((doc, idx) => {
              const isChecked = Boolean(checkedDocs[idx]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDoc(idx)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[0.99]",
                    isChecked
                      ? "border-emerald-600/40 bg-emerald-500/10 dark:bg-emerald-950/20"
                      : "border-[var(--av-border)] bg-[var(--av-surface-inset)]/50 hover:bg-[var(--av-surface-inset)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-white transition",
                      isChecked
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-[var(--av-border)] bg-[var(--av-surface)]"
                    )}
                  >
                    {isChecked ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
                  </span>
                  <span
                    className={cn(
                      "text-[12px] font-bold leading-snug",
                      isChecked
                        ? "text-emerald-950 dark:text-emerald-100 line-through opacity-85"
                        : "text-[var(--av-text-primary)]"
                    )}
                  >
                    {doc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-amber-500/10 p-3 text-[11px] font-medium leading-relaxed text-amber-950 dark:text-amber-100">
            <span className="font-extrabold">{hi ? "💡 महत्वपूर्ण सलाह: " : "💡 Important tip: "}</span>
            {hi
              ? "आधार कार्ड और बैंक पासबुक में नाम की स्पेलिंग खतौनी से मेल खानी चाहिए। बैंक खाते में आधार NPCI (DBT) सक्रिय होना अनिवार्य है।"
              : "Spelling of applicant name across Aadhaar, Bank Passbook and Land Record must match."}
          </div>
        </section>

        {/* SECTION 5: आवेदन कैसे करें — पूरी प्रक्रिया (Step-by-Step Application Roadmap) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "आवेदन प्रक्रिया — कैसे करें आवेदन?" : "Application Process"}
                </h2>
                <p className="text-[11px] text-[var(--av-text-muted)]">
                  {hi ? "कदम-दर-कदम आसान मार्गदर्शिका" : "Step-by-step roadmap"}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher: 1. ऑनलाइन खुद करें vs 2. CSC / ऑफलाइन */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-[var(--av-surface-inset)] p-1">
            <button
              type="button"
              onClick={() => setApplyMode("online")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-black transition",
                applyMode === "online"
                  ? "bg-emerald-950 text-white shadow-sm dark:bg-emerald-600"
                  : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
              )}
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>{hi ? "ऑनलाइन खुद करें" : "Online self"}</span>
            </button>

            <button
              type="button"
              onClick={() => setApplyMode("csc")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-black transition",
                applyMode === "csc"
                  ? "bg-emerald-950 text-white shadow-sm dark:bg-emerald-600"
                  : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
              )}
            >
              <Store className="h-3.5 w-3.5" />
              <span>{hi ? "CSC / जन सेवा केंद्र" : "CSC / Offline"}</span>
            </button>
          </div>

          {/* Scheme apply location note */}
          {scheme.applyHi ? (
            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[12px] font-bold text-emerald-950 dark:text-emerald-200">
              <span className="font-extrabold">{hi ? "आधिकारिक माध्यम: " : "Official Channels: "}</span>
              {scheme.applyHi}
            </div>
          ) : null}

          {/* Stepper Timeline */}
          <div className="space-y-3 pt-1">
            {activeSteps.map((s, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[12px] font-black text-white shadow-md dark:bg-emerald-600">
                  {s.step}
                </span>

                <div className="min-w-0 flex-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-extrabold text-[var(--av-text-primary)]">
                      {s.titleHi}
                    </p>
                    {s.badge && (
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
                    {s.descHi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: आधिकारिक सरकारी पोर्टल कार्ड (Official Portal Box) */}
        <section className="space-y-3 rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-b from-emerald-900/10 to-transparent p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                {hi ? "आधिकारिक सरकारी पोर्टल" : "Official Government Portal"}
              </h2>
              <p className="text-[11px] text-[var(--av-text-muted)]">
                {scheme.authority}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-800/20 bg-[var(--av-surface)] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                  {hi ? "सरकारी वेबसाइट" : "Official Website"}
                </span>
                <p className="truncate text-[13px] font-black text-emerald-800 dark:text-emerald-300">
                  {portalHost || scheme.officialSourceTitle || "आधिकारिक पोर्टल"}
                </p>
              </div>

              {stateStatus.helpline && (
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                    {hi ? "हेल्पलाइन नंबर" : "Helpline"}
                  </span>
                  <a
                    href={`tel:${stateStatus.helpline.split(" ")[0].replace(/[^0-9]/g, "")}`}
                    className="flex items-center justify-end gap-1 text-[12px] font-black text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    <PhoneCall className="h-3 w-3" />
                    <span>{stateStatus.helpline}</span>
                  </a>
                </div>
              )}
            </div>

            {official ? (
              <button
                type="button"
                onClick={() => requestPortal("detail_body_action")}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-4 text-[13px] font-black text-white shadow-lg transition hover:bg-emerald-900 active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                <span>
                  {hi
                    ? `आधिकारिक पोर्टल पर जाएँ ${portalHost ? `(${portalHost})` : ""}`
                    : "Go to Official Portal"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </button>
            ) : (
              <p className="rounded-xl bg-amber-500/10 p-2 text-center text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                {hi ? SCHEMES_MISSING_SOURCE_HI : SCHEMES_MISSING_SOURCE_EN}
              </p>
            )}
          </div>

          <p className="px-1 text-center text-[10px] font-medium text-[var(--av-text-muted)]">
            🔒 {hi ? "AgriVeda केवल सही सरकारी पोर्टल पर मार्गदर्शन करता है और किसी भी योजना के लिए शुल्क नहीं लेता।" : "AgriVeda only guides to official government portals and charges no fee."}
          </p>
        </section>

        {/* Collapsible Subtle Legal Disclaimer & Scam Safety */}
        <SchemeTrustAndSafety hi={hi} />
      </div>

      {/* STICKY BOTTOM ACTIONS */}
      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 mx-auto flex w-full max-w-lg gap-2 px-3 lg:bottom-4">
        {hasGuide ? (
          <AppLink
            href={`/schemes/${scheme.id}/guide`}
            onClick={() => track("scheme_guide_start", { id: scheme.id, from: "detail_sticky" })}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[12px] font-black text-[#07512f] shadow-sm transition active:scale-95 dark:text-emerald-100"
          >
            {hi ? "पात्रता गाइड" : "Eligibility Guide"}
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        ) : (
          <AppLink
            href="/schemes"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[12px] font-black text-[#07512f] shadow-sm transition active:scale-95 dark:text-emerald-100"
          >
            {hi ? "अन्य योजनाएँ" : "All Schemes"}
          </AppLink>
        )}

        {official ? (
          <button
            type="button"
            onClick={() => requestPortal("detail_sticky")}
            className="flex min-h-[48px] flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#07512f] to-[#08763f] px-3 text-[13px] font-black text-white shadow-xl transition active:scale-[0.99]"
          >
            <span>{hi ? "सरकारी पोर्टल ↗" : "Official Portal ↗"}</span>
          </button>
        ) : (
          <span className="flex min-h-[48px] flex-[1.4] items-center justify-center rounded-2xl bg-[var(--av-surface-inset)] px-2 text-center text-[10px] font-semibold text-[var(--av-text-muted)]">
            {hi ? SCHEMES_MISSING_SOURCE_HI : SCHEMES_MISSING_SOURCE_EN}
          </span>
        )}
      </div>

      <OfficialLeaveConfirm
        open={Boolean(leave.pending)}
        hi={hi}
        url={leave.pending?.url ?? ""}
        title={leave.pending?.title}
        onClose={leave.closeLeave}
        onContinue={leave.continueLeave}
      />
    </AppShell>
  );
}
