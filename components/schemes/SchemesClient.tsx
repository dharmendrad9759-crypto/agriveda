"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ClipboardList,
  ExternalLink,
  FileText,
  Landmark,
  MapPin,
  Phone,
  Search,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeEligibilityChecker from "@/components/schemes/SchemeEligibilityChecker";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import { farmerSchemes, type FarmerScheme } from "@/data/schemes/farmerSchemes";
import {
  SCHEMES_HERO_DISCLAIMER_EN,
  SCHEMES_HERO_DISCLAIMER_HI,
  STATUS_LABEL,
  hasOfficialSource,
  isProminentlyCurrent,
} from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { track } from "@/lib/analytics";
import { resolveSchemeImage, SCHEMES_HOME_BANNER } from "@/lib/schemes/schemeImages";
import { cn } from "@/lib/cn";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

type SchemeGroupId =
  | "cash"
  | "equipment"
  | "protection"
  | "credit"
  | "insurance"
  | "livestock"
  | "processing";
type ViewId = "overview" | "all" | SchemeGroupId;
type LevelFilter = "all" | "central" | "state";

type SchemeGroup = {
  id: SchemeGroupId;
  index: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  image: string;
  categories: FarmerScheme["category"][];
  tintClass: string;
  numberClass: string;
};

const SCHEME_GROUPS: SchemeGroup[] = [
  {
    id: "cash",
    index: 1,
    titleHi: "आय सहायता और पेंशन",
    titleEn: "Income support and pension",
    subtitleHi: "प्रत्यक्ष सहायता और पेंशन योजनाओं की जानकारी",
    subtitleEn: "Guidance on income support and pension schemes",
    image: "/images/schemes/scheme-income.jpg",
    categories: ["income", "state"],
    tintClass: "from-emerald-950/90 via-emerald-800/55 to-transparent",
    numberClass: "bg-emerald-700 text-white",
  },
  {
    id: "equipment",
    index: 2,
    titleHi: "यंत्र, ऊर्जा और सिंचाई",
    titleEn: "Machinery, energy and irrigation",
    subtitleHi: "यंत्र, सोलर और सूक्ष्म सिंचाई सहायता की जानकारी",
    subtitleEn: "Machinery, solar and micro-irrigation guidance",
    image: "/images/schemes/scheme-machinery.jpg",
    categories: ["mechanization", "energy"],
    tintClass: "from-blue-950/90 via-blue-800/55 to-transparent",
    numberClass: "bg-blue-700 text-white",
  },
  {
    id: "protection",
    index: 3,
    titleHi: "खेत सुरक्षा एवं जल",
    titleEn: "Farm protection and water",
    subtitleHi: "तारबंदी, बोरिंग और जल संचयन — राज्य नियम अनुसार",
    subtitleEn: "Fencing, boring and water-harvesting — state rules apply",
    image: "/images/schemes/scheme-climate.jpg",
    categories: ["protection", "irrigation"],
    tintClass: "from-teal-950/90 via-teal-800/55 to-transparent",
    numberClass: "bg-teal-700 text-white",
  },
  {
    id: "credit",
    index: 4,
    titleHi: "KCC और कृषि ऋण",
    titleEn: "KCC and farm credit",
    subtitleHi: "ऋण सुविधा की जानकारी — मंजूरी बैंक तय करता है",
    subtitleEn: "Credit guidance — sanction is decided by the bank",
    image: "/images/schemes/scheme-kcc.jpg",
    categories: ["credit"],
    tintClass: "from-orange-950/90 via-orange-700/55 to-transparent",
    numberClass: "bg-orange-700 text-white",
  },
  {
    id: "insurance",
    index: 5,
    titleHi: "बीमा और राहत",
    titleEn: "Insurance and relief",
    subtitleHi: "फसल बीमा और राज्य राहत — अधिसूचना अनुसार",
    subtitleEn: "Crop insurance and state relief — as notified",
    image: "/images/schemes/scheme-insurance.jpg",
    categories: ["insurance"],
    tintClass: "from-violet-950/90 via-violet-800/55 to-transparent",
    numberClass: "bg-violet-700 text-white",
  },
  {
    id: "livestock",
    index: 6,
    titleHi: "बागवानी, पशुपालन, मत्स्य",
    titleEn: "Horticulture, livestock, fishery",
    subtitleHi: "संबंधित विभाग की योजना जानकारी",
    subtitleEn: "Guidance for allied-sector schemes",
    image: "/images/schemes/scheme-livestock.jpg",
    categories: ["livestock", "horticulture"],
    tintClass: "from-fuchsia-950/90 via-fuchsia-700/55 to-transparent",
    numberClass: "bg-fuchsia-700 text-white",
  },
  {
    id: "processing",
    index: 7,
    titleHi: "प्रोसेसिंग और उद्यम",
    titleEn: "Processing and enterprise",
    subtitleHi: "खाद्य प्रसंस्करण और स्टार्टअप कॉल की जानकारी",
    subtitleEn: "Food processing and startup-call guidance",
    image: "/images/schemes/scheme-organic.jpg",
    categories: ["processing"],
    tintClass: "from-amber-950/90 via-amber-700/60 to-transparent",
    numberClass: "bg-amber-700 text-white",
  },
];

const APPLY_STEPS = [
  { hi: "आधिकारिक शर्तें देखें", en: "Read official conditions", Icon: Search },
  { hi: "दस्तावेज तैयार करें", en: "Prepare documents", Icon: ClipboardList },
  { hi: "आधिकारिक पोर्टल / बैंक", en: "Official portal / bank", Icon: Landmark },
  { hi: "स्थिति official channel से", en: "Track on official channel", Icon: FileText },
] as const;

function schemeHref(id: string) {
  return GUIDED.has(id) ? `/schemes/${id}/guide` : `/schemes/${id}`;
}

function matchesGroup(scheme: FarmerScheme, group: SchemeGroup): boolean {
  return group.categories.includes(scheme.category);
}

function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3 px-0.5">
      <h2 className="text-[15px] font-bold text-[var(--av-text-primary)]">{children}</h2>
      {action}
    </div>
  );
}

function OfficialBadge({ hi, ok }: { hi: boolean; ok: boolean }) {
  if (!ok) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-[#07512f] dark:text-emerald-200">
      <Shield className="h-2.5 w-2.5" />
      {hi ? "आधिकारिक स्रोत उपलब्ध" : "Official source available"}
    </span>
  );
}

function TopBar({ hi }: { hi: boolean }) {
  return (
    <header className="flex items-center gap-3">
      <AppLink
        href="/"
        aria-label={hi ? "वापस जाएँ" : "Go back"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
      </AppLink>
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-[17px] font-extrabold leading-tight text-[#07512f] dark:text-emerald-100">
          {hi ? "सरकारी कृषि योजनाओं की जानकारी खोजें" : "Find government farm scheme information"}
        </h1>
        <p className="truncate text-[11px] font-medium text-[var(--av-text-muted)]">
          {hi ? "AgriVeda — कृषि सूचना प्लेटफ़ॉर्म" : "AgriVeda — agricultural information platform"}
        </p>
      </div>
      <AppLink
        href="/alerts"
        aria-label={hi ? "अलर्ट" : "Alerts"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[#07512f] active:scale-95 dark:text-emerald-100"
      >
        <Bell className="h-4 w-4" />
      </AppLink>
    </header>
  );
}

function SearchRow({
  hi,
  q,
  onQuery,
  onFilter,
}: {
  hi: boolean;
  q: string;
  onQuery: (value: string) => void;
  onFilter: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          type="search"
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={hi ? "योजना खोजें..." : "Search scheme..."}
          className="min-h-[44px] w-full rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 pl-10 pr-3 text-[13px] text-[var(--av-text-primary)] outline-none ring-[var(--av-accent)] focus:ring-2"
          aria-label={hi ? "योजना खोजें" : "Search schemes"}
        />
      </div>
      <button
        type="button"
        onClick={onFilter}
        aria-label={hi ? "श्रेणियां दिखाएँ" : "Show categories"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[#07512f] active:scale-95 dark:text-emerald-100"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function GroupTile({
  group,
  hi,
  count,
  onSelect,
}: {
  group: SchemeGroup;
  hi: boolean;
  count: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex min-h-[100px] w-full overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 text-left shadow-md shadow-emerald-900/20 transition active:scale-[0.99]"
    >
      <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 bg-emerald-950 px-3.5 py-3.5">
        <span
          className={cn(
            "mb-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black shadow-sm",
            group.numberClass
          )}
        >
          {group.index}
        </span>
        <span className="text-[14px] font-extrabold leading-snug text-white">
          {hi ? group.titleHi : group.titleEn}
        </span>
        <span className="line-clamp-2 text-[11px] font-medium leading-snug text-emerald-100/85">
          {hi ? group.subtitleHi : group.subtitleEn}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200">
          {count} {hi ? "योजनाएँ · देखें" : "schemes · open"}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </span>
      <span className="relative w-[46%] min-w-[128px] max-w-[220px] shrink-0 self-stretch">
        <Image
          src={group.image}
          alt=""
          fill
          sizes="200px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-emerald-950 via-emerald-950/55 to-transparent"
        />
      </span>
    </button>
  );
}

function SchemeListCard({
  scheme,
  hi,
  onOfficial,
}: {
  scheme: FarmerScheme;
  hi: boolean;
  onOfficial?: (scheme: FarmerScheme) => void;
}) {
  const img = resolveSchemeImage(scheme);
  const official = hasOfficialSource(scheme);
  const status = STATUS_LABEL[scheme.status];
  const current = isProminentlyCurrent(scheme);

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
      <AppLink
        href={schemeHref(scheme.id)}
        onClick={() => track("scheme_card_open", { id: scheme.id, from: "schemes_list" })}
        className="flex min-h-[88px] items-center gap-3 px-3 py-2.5 active:scale-[0.99]"
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-600/25 bg-[var(--av-surface-inset)]">
          <Image src={img} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
            {hi ? scheme.nameHi : scheme.nameEn}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
            {scheme.schemeTypeHi}
            {" · "}
            {hi ? (scheme.level === "central" ? "केंद्रीय" : "राज्य") : scheme.level}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium text-[var(--av-text-secondary)]">
            {scheme.hookHi}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <OfficialBadge hi={hi} ok={official} />
            <span className="rounded-full bg-[var(--av-surface-inset)] px-2 py-0.5 text-[9px] font-bold text-[var(--av-text-muted)]">
              {hi ? status.hi : status.en}
            </span>
            {!current ? (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-900 dark:text-amber-100">
                {hi ? "समीक्षा आवश्यक" : "Needs review"}
              </span>
            ) : null}
          </div>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[#07512f] dark:text-emerald-100">
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </AppLink>
      <div className="flex gap-2 border-t border-[var(--av-border)] px-3 py-2">
        <AppLink
          href={schemeHref(scheme.id)}
          className="flex-1 rounded-lg bg-emerald-500/10 py-2 text-center text-[11px] font-bold text-[#07512f] dark:text-emerald-100"
        >
          {hi ? "पात्रता समझें →" : "Understand eligibility →"}
        </AppLink>
        {official && onOfficial ? (
          <button
            type="button"
            onClick={() => onOfficial(scheme)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--av-border)] py-2 text-[11px] font-bold text-[var(--av-text-secondary)]"
          >
            <ExternalLink className="h-3 w-3" />
            {hi ? "आधिकारिक जानकारी देखें →" : "Official information →"}
          </button>
        ) : (
          <span className="flex-1 py-2 text-center text-[10px] font-medium text-[var(--av-text-muted)]">
            {hi ? "स्रोत उपलब्ध नहीं" : "No official URL yet"}
          </span>
        )}
      </div>
    </article>
  );
}

function GroupHero({ group, hi, count }: { group: SchemeGroup; hi: boolean; count: number }) {
  return (
    <section className="relative min-h-[150px] overflow-hidden rounded-2xl border border-[var(--av-border)] shadow-[var(--av-shadow-sm)]">
      <Image src={group.image} alt="" fill priority sizes="640px" className="object-cover" />
      <span className={cn("absolute inset-0 bg-gradient-to-r", group.tintClass)} />
      <div className="relative z-10 flex min-h-[150px] max-w-[78%] flex-col justify-center px-4 py-4">
        <span
          className={cn(
            "mb-3 flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-black shadow-sm",
            group.numberClass
          )}
        >
          {group.index}
        </span>
        <h2 className="text-[21px] font-extrabold leading-tight text-white">
          {hi ? group.titleHi : group.titleEn}
        </h2>
        <p className="mt-2 text-[12px] font-semibold leading-snug text-white/90">
          {hi ? group.subtitleHi : group.subtitleEn}
        </p>
        <p className="mt-2 text-[11px] font-bold text-white/90">
          {count} {hi ? "योजनाओं की जानकारी" : "scheme information cards"}
        </p>
      </div>
    </section>
  );
}

function NextSteps({ hi }: { hi: boolean }) {
  return (
    <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
      <p className="text-[15px] font-extrabold text-[#07512f] dark:text-emerald-100">
        {hi ? "आगे क्या करें?" : "What to do next?"}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
        {hi
          ? "AgriVeda आवेदन मंजूर नहीं करता — आधिकारिक मार्ग यह है"
          : "AgriVeda does not approve applications — this is the official path"}
      </p>
      <ol className="mt-3 grid grid-cols-4 gap-1.5">
        {APPLY_STEPS.map((step, i) => {
          const Icon = step.Icon;
          return (
            <li key={step.hi} className="text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-[12px] font-black text-[#07512f] dark:text-emerald-100">
                {i + 1}
              </span>
              <Icon className="mx-auto mt-1 h-3.5 w-3.5 text-[#08763f] dark:text-emerald-300" />
              <span className="mt-1 block text-[9px] font-bold leading-tight text-[var(--av-text-secondary)]">
                {hi ? step.hi : step.en}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function SchemesClient() {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { profile } = useFarmerProfile();
  const [view, setView] = useState<ViewId>("overview");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [q, setQ] = useState("");
  const [forYou, setForYou] = useState<FarmerScheme[] | null>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const allRef = useRef<HTMLDivElement>(null);
  const leave = useOfficialLeave();

  const byLevel = useMemo(() => {
    if (level === "all") return farmerSchemes;
    return farmerSchemes.filter((scheme) => scheme.level === level);
  }, [level]);

  const searched = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pool = byLevel;
    if (!needle) return pool;
    return pool.filter((scheme) => {
      const blob = [
        scheme.nameHi,
        scheme.nameEn,
        scheme.hookHi,
        scheme.purposeHi,
        scheme.benefitHi,
        scheme.applyHi,
        scheme.authority,
        ...(scheme.tagsHi ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(needle);
    });
  }, [q, byLevel]);

  const groupCounts = useMemo(() => {
    return SCHEME_GROUPS.reduce(
      (acc, group) => {
        acc[group.id] = farmerSchemes.filter((scheme) => matchesGroup(scheme, group)).length;
        return acc;
      },
      {} as Record<SchemeGroupId, number>
    );
  }, []);

  const recommended = useMemo(() => {
    const state = (profile.state || "").toLowerCase();
    const isUp =
      state.includes("uttar") ||
      state.includes("उत्तर") ||
      state === "up" ||
      state.includes("u.p");
    const ids = isUp
      ? ["pm-kisan", "crop-residue", "kcc"]
      : ["pm-kisan", "pm-kusum", "kcc"];

    return ids
      .map((id) => farmerSchemes.find((scheme) => scheme.id === id))
      .filter(Boolean) as FarmerScheme[];
  }, [profile.state]);

  const activeGroup = SCHEME_GROUPS.find((group) => group.id === view) ?? null;
  const activeGroupSchemes = activeGroup
    ? farmerSchemes.filter((scheme) => matchesGroup(scheme, activeGroup))
    : [];
  const hasSearch = q.trim().length > 0;
  const listForView =
    view === "all" ? searched : forYou && view === "overview" ? forYou : searched;

  const openOfficial = (scheme: FarmerScheme) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from: "schemes_card" });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  return (
    <AppShell>
      <div className="space-y-4 pb-4">
        <TopBar hi={hi} />

        <section className="overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 shadow-lg shadow-emerald-900/25">
          <div className="relative flex min-h-[128px] w-full">
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1.5 bg-emerald-950 px-3.5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">
                {hi ? "AgriVeda सूचना प्लेटफ़ॉर्म" : "AgriVeda information platform"}
              </p>
              <p className="text-[16px] font-extrabold leading-snug text-white sm:text-[17px]">
                {hi ? "आपके लिए कौन-सी सरकारी योजना है?" : "Which government scheme may apply to you?"}
              </p>
              <p className="text-[11px] font-medium leading-snug text-emerald-100/85">
                {hi
                  ? "सब्सिडी, KCC, बीमा, किसान सहायता और कृषि योजनाओं की जानकारी एक जगह देखें। अपनी प्रारंभिक पात्रता समझें और संबंधित आधिकारिक स्रोत तक जाएं।"
                  : "Find subsidy, KCC, insurance and farm-scheme information in one place. Understand preliminary eligibility, then go to the official source."}
              </p>
            </div>
            <div className="relative w-[42%] min-w-[120px] max-w-[220px] shrink-0 self-stretch">
              <Image
                src={SCHEMES_HOME_BANNER}
                alt=""
                fill
                priority
                sizes="220px"
                className="object-cover object-[center_30%]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-emerald-950 via-emerald-950/50 to-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 bg-emerald-900/80 p-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setView("overview");
                eligibilityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-white px-3 text-[13px] font-extrabold text-emerald-950"
            >
              {hi ? "मेरे लिए योजनाएं खोजें" : "Find schemes for me"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForYou(null);
                setView("all");
                allRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-white/25 px-3 text-[13px] font-bold text-white"
            >
              {hi ? "सभी योजनाएं देखें" : "See all schemes"}
            </button>
          </div>
        </section>

        <p className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-[11px] leading-relaxed text-[var(--av-text-secondary)]">
          {hi ? SCHEMES_HERO_DISCLAIMER_HI : SCHEMES_HERO_DISCLAIMER_EN}
        </p>

        <SearchRow
          hi={hi}
          q={q}
          onQuery={setQ}
          onFilter={() => {
            setQ("");
            setForYou(null);
            setView("overview");
          }}
        />

        <div className="flex gap-2">
          {(["all", "central", "state"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLevel(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-bold",
                level === id
                  ? "bg-[#08763f] text-white"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              )}
            >
              {id === "all" ? (hi ? "सभी" : "All") : id === "central" ? (hi ? "केंद्रीय" : "Central") : hi ? "राज्य" : "State"}
            </button>
          ))}
        </div>

        {hasSearch ? (
          <section className="space-y-3">
            <SectionTitle>
              {hi ? `खोज परिणाम (${searched.length})` : `Search results (${searched.length})`}
            </SectionTitle>
            {searched.length ? (
              <div className="space-y-2.5">
                {searched.map((scheme) => (
                  <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-8 text-center text-[13px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "कोई योजना नहीं मिली" : "No schemes found"}
              </p>
            )}
          </section>
        ) : activeGroup ? (
          <section className="space-y-4">
            <button
              type="button"
              onClick={() => setView("overview")}
              className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {hi ? "सभी श्रेणियाँ" : "All categories"}
            </button>
            <GroupHero group={activeGroup} hi={hi} count={activeGroupSchemes.length} />
            <div className="space-y-2.5">
              {activeGroupSchemes.map((scheme) => (
                <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
              ))}
            </div>
            <AppLink
              href="/ask-query"
              className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)] active:scale-[0.99]"
            >
              <div>
                <p className="text-[14px] font-extrabold text-[#07512f] dark:text-emerald-100">
                  {hi ? "मार्गदर्शन चाहिए?" : "Need guidance?"}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
                  {hi
                    ? "हम आपको योजना समझने और आधिकारिक आवेदन प्रक्रिया तक पहुंचने में मार्गदर्शन कर सकते हैं।"
                    : "We can help you understand the scheme and reach the official application path."}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[#07512f] dark:text-emerald-100">
                <Phone className="h-4 w-4" />
              </span>
            </AppLink>
          </section>
        ) : (
          <>
            {view === "all" || forYou ? (
              <button
                type="button"
                onClick={() => {
                  setForYou(null);
                  setView("overview");
                }}
                className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
              >
                <ArrowLeft className="h-4 w-4" />
                {hi ? "खोज होम" : "Schemes home"}
              </button>
            ) : null}

            {view === "overview" && !forYou ? (
              <>
            <section>
              <SectionTitle>
                {hi ? "श्रेणी से खोजें" : "Browse by category"}
              </SectionTitle>
              <div className="space-y-2.5">
                {SCHEME_GROUPS.map((group) => (
                  <GroupTile
                    key={group.id}
                    group={group}
                    hi={hi}
                    count={groupCounts[group.id]}
                    onSelect={() => {
                      setView(group.id);
                      track("scheme_group_open", { id: group.id });
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
              <SectionTitle
                action={
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-[#07512f] dark:text-emerald-100">
                    <MapPin className="h-3 w-3" />
                    {profile.state || (hi ? "राज्य चुनें" : "Select state")}
                  </span>
                }
              >
                {hi ? "आपके प्रोफ़ाइल से सुझाव" : "Suggested from your profile"}
              </SectionTitle>
              <p className="-mt-1 mb-3 px-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                {hi
                  ? "यह सुझाव है, पात्रता नहीं। आधिकारिक नियम अलग हो सकते हैं।"
                  : "These are suggestions, not eligibility. Official rules may differ."}
              </p>
              <div className="space-y-2.5">
                {recommended.map((scheme) => (
                  <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
                ))}
              </div>
            </section>
              </>
            ) : null}

            <div ref={eligibilityRef}>
              <SchemeEligibilityChecker
                hi={hi}
                schemes={farmerSchemes}
                initialState={profile.state}
                onMatches={(matches) => {
                  setForYou(matches);
                  setView("all");
                }}
              />
            </div>

            {view === "all" || forYou ? (
              <div ref={allRef}>
                <SectionTitle>
                  {forYou
                    ? hi
                      ? `प्रारंभिक मेल (${forYou.length})`
                      : `Preliminary matches (${forYou.length})`
                    : hi
                      ? `सभी योजनाएं (${listForView.length})`
                      : `All schemes (${listForView.length})`}
                </SectionTitle>
                <p className="mb-2 text-[11px] text-[var(--av-text-muted)]">
                  {hi
                    ? "पहले पात्रता समझें, फिर आधिकारिक पोर्टल पर आवेदन करें।"
                    : "Understand eligibility first, then apply on the official portal."}
                </p>
                <div className="space-y-2.5">
                  {listForView.map((scheme) => (
                    <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
                  ))}
                </div>
              </div>
            ) : null}

            <NextSteps hi={hi} />
            <SchemeTrustAndSafety hi={hi} />
          </>
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
