"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  MapPin,
  Search,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import { farmerSchemes, type FarmerScheme } from "@/data/schemes/farmerSchemes";
import { hasOfficialSource } from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import {
  INDIAN_STATES_SCHEME_META,
  SCHEME_STATE_DETAILS,
  getSchemeStateStatus,
} from "@/data/schemes/schemeStateData";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { track } from "@/lib/analytics";
import { resolveSchemeImage, SCHEMES_HOME_BANNER } from "@/lib/schemes/schemeImages";
import {
  farmerSchemeHook,
  farmerSchemeName,
} from "@/lib/schemes/farmerSchemeCopy";
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
  titleHi: string;
  titleEn: string;
  blurbHi: string;
  blurbEn: string;
  image: string;
  categories: FarmerScheme["category"][];
};

const SCHEME_GROUPS: SchemeGroup[] = [
  {
    id: "cash",
    titleHi: "पैसे की मदद",
    titleEn: "Cash help",
    blurbHi: "सीधा पैसा · पेंशन",
    blurbEn: "Direct cash · pension",
    image: "/images/schemes/scheme-income.jpg",
    categories: ["income", "state"],
  },
  {
    id: "equipment",
    titleHi: "मशीन · सोलर · पानी",
    titleEn: "Machine · solar · water",
    blurbHi: "यंत्र और सिंचाई",
    blurbEn: "Machines & irrigation",
    image: "/images/schemes/scheme-machinery.jpg",
    categories: ["mechanization", "energy"],
  },
  {
    id: "protection",
    titleHi: "खेत बचाव",
    titleEn: "Farm protection",
    blurbHi: "तार · बोरिंग · तालाब",
    blurbEn: "Fence · bore · pond",
    image: "/images/schemes/scheme-climate.jpg",
    categories: ["protection", "irrigation"],
  },
  {
    id: "credit",
    titleHi: "KCC · कर्ज",
    titleEn: "KCC · credit",
    blurbHi: "सस्ता कृषि कर्ज",
    blurbEn: "Cheap farm credit",
    image: "/images/schemes/scheme-kcc.jpg",
    categories: ["credit"],
  },
  {
    id: "insurance",
    titleHi: "बीमा · राहत",
    titleEn: "Insurance · relief",
    blurbHi: "फसल बीमा · आपदा",
    blurbEn: "Crop cover · relief",
    image: "/images/schemes/scheme-insurance.jpg",
    categories: ["insurance"],
  },
  {
    id: "livestock",
    titleHi: "पशु · बाग · मछली",
    titleEn: "Livestock · garden · fish",
    blurbHi: "संबंधित मदद",
    blurbEn: "Allied help",
    image: "/images/schemes/scheme-livestock.jpg",
    categories: ["livestock", "horticulture"],
  },
  {
    id: "processing",
    titleHi: "प्रोसेस · धंधा",
    titleEn: "Process · business",
    blurbHi: "खाना प्रोसेस · स्टार्टअप",
    blurbEn: "Food process · startup",
    image: "/images/schemes/scheme-organic.jpg",
    categories: ["processing"],
  },
];

const POPULAR_STATES = [
  "all",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "Bihar",
  "Haryana",
  "Punjab",
  "Maharashtra",
];

function schemeHref(id: string) {
  return `/schemes/${id}`;
}

function matchesGroup(scheme: FarmerScheme, group: SchemeGroup) {
  return group.categories.includes(scheme.category);
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 px-0.5 text-[15px] font-extrabold tracking-tight text-[var(--av-text-primary)]">
      {children}
    </h2>
  );
}

function TopBar({ hi }: { hi: boolean }) {
  const router = useRouter();
  return (
    <header className="flex items-center gap-3">
      <button
        type="button"
        aria-label={hi ? "वापस" : "Back"}
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) router.back();
          else router.push("/");
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] shadow-sm active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-[16px] font-extrabold text-[#07512f] dark:text-emerald-100">
          {hi ? "किसान योजनाएँ एवं सब्सिडी" : "Farmer Schemes & Subsidy"}
        </h1>
      </div>
      <span className="w-10" aria-hidden />
    </header>
  );
}

/** Split card: text left · photo right */
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
      className="group relative flex min-h-[96px] w-full overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 text-left shadow-md shadow-emerald-900/20 transition active:scale-[0.99]"
    >
      <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 bg-emerald-950 px-3.5 py-3">
        <span className="text-[14px] font-extrabold leading-snug text-white">
          {hi ? group.titleHi : group.titleEn}
        </span>
        <span className="line-clamp-2 text-[11px] font-medium leading-snug text-emerald-100/85">
          {hi ? group.blurbHi : group.blurbEn}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200">
          {count} {hi ? "योजनाएँ · देखें" : "schemes · open"}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </span>
      <span className="relative w-[44%] min-w-[120px] max-w-[180px] shrink-0 self-stretch">
        <Image
          src={group.image}
          alt=""
          fill
          sizes="220px"
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

/** Premium Scheme Card with Highlights, Badges & State Details */
function SchemeListCard({
  scheme,
  hi,
  selectedState,
  onOfficial,
}: {
  scheme: FarmerScheme;
  hi: boolean;
  selectedState: string;
  onOfficial?: (scheme: FarmerScheme) => void;
}) {
  const img = resolveSchemeImage(scheme);
  const official = hasOfficialSource(scheme);
  const title = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, hi);
  const hook = farmerSchemeHook(scheme.id, scheme.hookHi, hi);

  const schemeMeta = SCHEME_STATE_DETAILS[scheme.id];
  const stateStatus = getSchemeStateStatus(scheme.id, selectedState === "all" ? "Uttar Pradesh" : selectedState);

  // Status text for card
  const statusBadge =
    schemeMeta?.windowStatus === "open"
      ? { text: hi ? "आवेदन चालू" : "Open", color: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-600/20" }
      : schemeMeta?.windowStatus === "seasonal"
      ? { text: hi ? "मौसमी विंडो" : "Seasonal", color: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-600/20" }
      : schemeMeta?.windowStatus === "quota"
      ? { text: hi ? "टोकन कोटा" : "Quota", color: "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-600/20" }
      : { text: hi ? "सक्रिय" : "Active", color: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-600/20" };

  const isStateSpecificMatch =
    selectedState !== "all" &&
    scheme.level === "state" &&
    scheme.state?.toLowerCase() === selectedState.toLowerCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition hover:shadow-md">
      <AppLink
        href={schemeHref(scheme.id)}
        onClick={() => track("scheme_card_open", { id: scheme.id, from: "schemes_list", state: selectedState })}
        className="group relative flex min-h-[96px] active:scale-[0.99]"
      >
        <span className="relative w-[34%] min-w-[105px] max-w-[140px] shrink-0 self-stretch">
          <Image
            src={img}
            alt=""
            fill
            sizes="150px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-[var(--av-surface)]/40" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-800 dark:text-emerald-300">
              {hi ? (scheme.level === "central" ? "केंद्र सरकार" : "राज्य सरकार") : scheme.level}
            </span>

            {scheme.level === "state" && scheme.state ? (
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-800 dark:text-amber-300">
                ⭐ {INDIAN_STATES_SCHEME_META[scheme.state]?.stateHi || scheme.state} {hi ? "विशेष" : "Govt"}
              </span>
            ) : null}

            <span className={cn("rounded-md border px-1.5 py-0.5 text-[9px] font-bold", statusBadge.color)}>
              {statusBadge.text}
            </span>
          </div>

          <h3 className="line-clamp-1 text-[14px] font-black leading-snug text-[var(--av-text-primary)]">
            {title}
          </h3>

          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-[var(--av-text-secondary)]">
            {hook}
          </p>

          {scheme.benefitAmount && (
            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 dark:text-amber-300">
              <Sparkles className="h-3 w-3" />
              <span>{scheme.benefitAmount}</span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between pt-1 border-t border-[var(--av-border)]/40">
            {official ? (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span>{hi ? "आधिकारिक पोर्टल" : "Official portal"}</span>
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[var(--av-text-muted)]">
                {hi ? "मार्गदर्शन" : "Guidance"}
              </span>
            )}

            <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-[#07512f] dark:text-emerald-300 group-hover:translate-x-0.5 transition">
              {hi ? "पात्रता व प्रक्रिया →" : "Details →"}
            </span>
          </div>
        </span>
      </AppLink>

      {official && onOfficial ? (
        <div className="border-t border-[var(--av-border)] bg-[var(--av-surface-inset)]/30 px-3 py-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-[var(--av-text-muted)] truncate max-w-[60%]">
            {scheme.authority ? scheme.authority.split(",")[0] : ""}
          </span>
          <button
            type="button"
            onClick={() => onOfficial(scheme)}
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            <span>{hi ? "पोर्टल खोलें" : "Open portal"}</span>
          </button>
        </div>
      ) : null}
    </article>
  );
}

function GroupHero({ group, hi, count }: { group: SchemeGroup; hi: boolean; count: number }) {
  return (
    <section className="relative min-h-[120px] overflow-hidden rounded-2xl shadow-md shadow-black/20">
      <Image src={group.image} alt="" fill priority sizes="640px" className="object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />
      <div className="relative z-10 flex min-h-[120px] flex-col justify-end px-3.5 pb-3.5 pt-8">
        <h2 className="text-[18px] font-extrabold leading-tight text-white">
          {hi ? group.titleHi : group.titleEn}
        </h2>
        <p className="mt-1 text-[12px] font-semibold text-white/90">
          {hi ? group.blurbHi : group.blurbEn} · {count} {hi ? "योजनाएँ" : "schemes"}
        </p>
      </div>
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
  const [selectedState, setSelectedState] = useState<string>("all");
  const [forYou, setForYou] = useState<FarmerScheme[] | null>(null);
  const allRef = useRef<HTMLDivElement>(null);
  const leave = useOfficialLeave();

  // Filter schemes by level and state
  const filteredSchemes = useMemo(() => {
    let pool = farmerSchemes;

    // Filter by Level (all, central, state)
    if (level !== "all") {
      pool = pool.filter((scheme) => scheme.level === level);
    }

    // Filter by State if specific state selected
    if (selectedState !== "all") {
      pool = pool.filter((scheme) => {
        // Central schemes apply in all states
        if (scheme.level === "central") return true;

        // State schemes: match state name or multi-state notes
        if (scheme.state) {
          const schemeState = scheme.state.toLowerCase();
          const targetState = selectedState.toLowerCase();
          if (schemeState.includes(targetState) || targetState.includes(schemeState)) {
            return true;
          }
        }

        // Scheme meta state mapping
        const meta = SCHEME_STATE_DETAILS[scheme.id];
        if (meta?.applicableStates === "all") return true;
        if (Array.isArray(meta?.applicableStates)) {
          return meta.applicableStates.some((s) => s.toLowerCase() === selectedState.toLowerCase());
        }

        return false;
      });
    }

    return pool;
  }, [level, selectedState]);

  // Search filter
  const searched = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pool = filteredSchemes;
    if (!needle) return pool;
    return pool.filter((scheme) => {
      const farmer = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, true);
      const blob = [
        farmer,
        scheme.nameHi,
        scheme.nameEn,
        scheme.hookHi,
        farmerSchemeHook(scheme.id, scheme.hookHi, true),
        scheme.benefitAmount || "",
        ...(scheme.tagsHi ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(needle);
    });
  }, [q, filteredSchemes]);

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
    const state = (selectedState !== "all" ? selectedState : profile.state || "").toLowerCase();
    const isUp =
      state.includes("uttar") ||
      state.includes("उत्तर") ||
      state === "up" ||
      state.includes("u.p");
    const isRj = state.includes("rajasthan") || state.includes("राजस्थान") || state === "rj";
    const isMp = state.includes("madhya") || state.includes("मध्य") || state === "mp";
    const isBihar = state.includes("bihar") || state.includes("बिहार") || state === "br";
    const isHaryana = state.includes("haryana") || state.includes("हरियाणा") || state === "hr";
    const isMh = state.includes("maharashtra") || state.includes("महाराष्ट्र") || state === "mh";
    const isPunjab = state.includes("punjab") || state.includes("पंजाब") || state === "pb";

    const ids = isBihar
      ? ["bihar-fasal-sahayata", "bihar-diesel-anudan", "pm-kisan", "pm-kusum"]
      : isHaryana
      ? ["haryana-bhavantar", "haryana-mera-pani", "pm-kisan", "kcc"]
      : isMh
      ? ["mh-namo-shetkari", "mh-magel-tyala-shettale", "pm-kisan", "pm-kusum"]
      : isUp
      ? ["up-khet-talab", "up-gopalak", "pm-kisan", "pm-kusum"]
      : isRj
      ? ["rj-fencing", "rj-diggi-anudan", "pm-kisan", "pm-kusum"]
      : isPunjab
      ? ["punjab-crm-machinery", "pm-kisan", "kcc", "pm-kusum"]
      : isMp
      ? ["mp-cm-kisan", "pm-kisan", "pm-kusum", "kcc"]
      : ["pm-kisan", "pm-kusum", "kcc", "pmfby"];

    return ids
      .map((id) => farmerSchemes.find((scheme) => scheme.id === id))
      .filter(Boolean) as FarmerScheme[];
  }, [selectedState, profile.state]);

  const activeGroup = SCHEME_GROUPS.find((group) => group.id === view) ?? null;
  const activeGroupSchemes = activeGroup
    ? filteredSchemes.filter((scheme) => matchesGroup(scheme, activeGroup))
    : [];
  const hasSearch = q.trim().length > 0;
  const listForView =
    view === "all" ? searched : forYou && view === "overview" ? forYou : searched;

  const openOfficial = (scheme: FarmerScheme) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from: "schemes_card" });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  const selectedStateNameHi =
    selectedState === "all"
      ? hi ? "सभी राज्य (All India)" : "All States"
      : INDIAN_STATES_SCHEME_META[selectedState]?.stateHi || selectedState;

  return (
    <AppShell>
      <div className="space-y-4 pb-12">
        <TopBar hi={hi} />

        {/* Cinematic hero */}
        <section className="relative min-h-[130px] overflow-hidden rounded-3xl shadow-xl shadow-emerald-950/20">
          <Image
            src={SCHEMES_HOME_BANNER}
            alt=""
            fill
            priority
            sizes="640px"
            className="object-cover object-[center_28%]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-black/25" />
          <div className="relative z-10 flex min-h-[130px] flex-col justify-end p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
              AgriVeda Schemes
            </p>
            <h1 className="mt-0.5 text-[19px] font-black leading-tight text-white sm:text-[22px]">
              {hi ? "सरकारी योजनाएँ, सब्सिडी व पात्रता" : "Government Schemes & Subsidy"}
            </h1>
            <p className="mt-1 max-w-[95%] text-[11px] font-semibold text-emerald-50/90 leading-snug">
              {hi
                ? "पात्रता शर्तें · ज़रूरी कागज़ात · आवेदन प्रक्रिया व आधिकारिक पोर्टल"
                : "Eligibility · Documents · Application process & official portals"}
            </p>
          </div>
        </section>

        {/* State Filter Bar with Dropdown & Chips */}
        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px] font-black text-[#07512f] dark:text-emerald-300">
              <MapPin className="h-3.5 w-3.5" />
              <span>{hi ? "राज्य अनुसार योजनाएँ देखें:" : "Filter by state:"}</span>
            </div>
            <span className="text-[11px] font-bold text-[var(--av-text-muted)]">
              {selectedStateNameHi}
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {POPULAR_STATES.map((st) => {
              const isSelected = selectedState === st;
              const label =
                st === "all"
                  ? hi ? "सभी राज्य" : "All India"
                  : INDIAN_STATES_SCHEME_META[st]?.stateHi || st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedState(st);
                    track("scheme_filter_state", { state: st });
                  }}
                  className={cn(
                    "shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-black transition active:scale-95",
                    isSelected
                      ? "bg-emerald-950 text-white shadow-sm dark:bg-emerald-600"
                      : "border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-inset)]"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={hi ? "योजना या लाभ खोजें… जैसे KCC, PM-KISAN, तारबंदी, सोलर" : "Search schemes… KCC, PM-KISAN, solar"}
            className="min-h-[46px] w-full rounded-2xl border border-emerald-800/20 bg-[var(--av-surface)] py-2.5 pl-12 pr-3 text-[13px] font-medium text-[var(--av-text-primary)] shadow-sm outline-none ring-emerald-600/30 focus:ring-2"
            aria-label={hi ? "योजना खोजें" : "Search schemes"}
          />
        </div>

        {/* Level Filters (All, Central, State) */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {(["all", "central", "state"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLevel(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-black transition",
                level === id
                  ? "bg-emerald-950 text-white shadow-md dark:bg-emerald-600"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              )}
            >
              {id === "all" ? (hi ? "सभी स्तर" : "All") : id === "central" ? (hi ? "🇮🇳 केंद्र सरकार" : "Central") : hi ? "🏛️ राज्य सरकार" : "State"}
            </button>
          ))}
        </div>

        {/* Search Results */}
        {hasSearch ? (
          <section className="space-y-3">
            <SectionTitle>
              {hi ? `खोज परिणाम (${searched.length})` : `Search results (${searched.length})`}
            </SectionTitle>
            {searched.length ? (
              <div className="space-y-3">
                {searched.map((scheme) => (
                  <SchemeListCard
                    key={scheme.id}
                    scheme={scheme}
                    hi={hi}
                    selectedState={selectedState}
                    onOfficial={openOfficial}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--av-border)] p-8 text-center text-[13px] font-semibold text-[var(--av-text-muted)] space-y-2">
                <p>{hi ? "इस नाम से कोई योजना नहीं मिली।" : "No schemes found matching search."}</p>
                <p className="text-[11px] text-[var(--av-text-secondary)]">
                  {hi ? "सुझाव: KCC, सोलर, बीमा या नकद लिखकर खोजें।" : "Tip: Try searching KCC, solar, or insurance."}
                </p>
              </div>
            )}
          </section>
        ) : activeGroup ? (
          <section className="space-y-3">
            <button
              type="button"
              onClick={() => setView("overview")}
              className="inline-flex items-center gap-1.5 text-[13px] font-black text-[#07512f] dark:text-emerald-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{hi ? "सभी श्रेणियाँ वापस देखें" : "Back to all categories"}</span>
            </button>
            <GroupHero group={activeGroup} hi={hi} count={activeGroupSchemes.length} />
            <div className="space-y-3">
              {activeGroupSchemes.map((scheme) => (
                <SchemeListCard
                  key={scheme.id}
                  scheme={scheme}
                  hi={hi}
                  selectedState={selectedState}
                  onOfficial={openOfficial}
                />
              ))}
            </div>
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
                className="inline-flex items-center gap-1.5 text-[13px] font-black text-[#07512f] dark:text-emerald-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{hi ? "वापस श्रेणियाँ" : "Back to categories"}</span>
              </button>
            ) : null}

            {view === "overview" && !forYou ? (
              <>
                {/* Categories */}
                <section>
                  <SectionTitle>{hi ? "किस प्रकार की मदद चाहिए?" : "What help do you need?"}</SectionTitle>
                  <div className="space-y-3">
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

                {/* Recommended / Popular in state */}
                <section>
                  <SectionTitle>
                    {selectedState !== "all"
                      ? hi
                        ? `${selectedStateNameHi} में सबसे ज़्यादा पूछी जाने वाली`
                        : `Most Popular in ${selectedStateNameHi}`
                      : hi
                      ? "अक्सर पूछी जाने वाली प्रमुख योजनाएँ"
                      : "Most Popular Schemes"}
                  </SectionTitle>
                  <div className="space-y-3">
                    {recommended.map((scheme) => (
                      <SchemeListCard
                        key={scheme.id}
                        scheme={scheme}
                        hi={hi}
                        selectedState={selectedState}
                        onOfficial={openOfficial}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForYou(null);
                      setView("all");
                      allRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-2xl bg-emerald-950 text-[13px] font-black text-white shadow-md active:scale-95 transition dark:bg-emerald-700 hover:bg-emerald-900"
                  >
                    <span>{hi ? `सभी ${filteredSchemes.length} योजनाएँ देखें` : `See all ${filteredSchemes.length} schemes`}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </section>
              </>
            ) : null}

            {view === "all" || forYou ? (
              <div ref={allRef} className="space-y-3">
                <SectionTitle>
                  {forYou
                    ? hi
                      ? `अनुशंसित (${forYou.length})`
                      : `Recommended (${forYou.length})`
                    : hi
                    ? `सभी योजनाएँ (${listForView.length})`
                    : `All Schemes (${listForView.length})`}
                </SectionTitle>
                <div className="space-y-3">
                  {listForView.map((scheme) => (
                    <SchemeListCard
                      key={scheme.id}
                      scheme={scheme}
                      hi={hi}
                      selectedState={selectedState}
                      onOfficial={openOfficial}
                    />
                  ))}
                </div>
              </div>
            ) : null}

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
