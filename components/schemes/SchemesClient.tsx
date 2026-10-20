"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { navigateBack } from "@/lib/navigationTracker";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Tractor,
  X,
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

function TopBar({
  hi,
  selectedStateNameHi,
  onOpenStateModal,
}: {
  hi: boolean;
  selectedStateNameHi: string;
  onOpenStateModal: () => void;
}) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          aria-label={hi ? "वापस" : "Back"}
          onClick={() => navigateBack({ router })}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-stone-200/90 bg-white text-stone-700 shadow-xs transition hover:bg-stone-50 active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-black tracking-tight text-stone-900 dark:text-white">
            {hi ? "सरकारी योजनाएँ" : "Govt Schemes"}
          </h1>
          <p className="truncate text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            {hi ? "सब्सिडी, पात्रता व आवेदन" : "Subsidies & Eligibility"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenStateModal}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50/90 px-3 py-1.5 text-[12px] font-black text-emerald-900 shadow-xs transition hover:bg-emerald-100/90 active:scale-95 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300"
      >
        <MapPin className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        <span className="max-w-[105px] truncate">{selectedStateNameHi}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
      </button>
    </header>
  );
}

const BENTO_ICONS: Record<string, { icon: typeof Banknote; bg: string; color: string }> = {
  cash: { icon: Banknote, bg: "bg-emerald-50 dark:bg-emerald-950/50", color: "text-emerald-700 dark:text-emerald-300" },
  equipment: { icon: Tractor, bg: "bg-amber-50 dark:bg-amber-950/50", color: "text-amber-700 dark:text-amber-300" },
  protection: { icon: ShieldAlert, bg: "bg-blue-50 dark:bg-blue-950/50", color: "text-blue-700 dark:text-blue-300" },
  credit: { icon: CreditCard, bg: "bg-purple-50 dark:bg-purple-950/50", color: "text-purple-700 dark:text-purple-300" },
};

/** 2x2 Bento Grid Card: Pure white, clean icon, bold typography */
function BentoCategoryCard({
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
  const meta = BENTO_ICONS[group.id] || {
    icon: Sparkles,
    bg: "bg-stone-50 dark:bg-stone-800",
    color: "text-stone-700 dark:text-stone-300",
  };
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-3.5 text-left shadow-xs transition hover:border-emerald-600/40 hover:shadow-md active:scale-[0.98] dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", meta.bg, meta.color)}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          {count} {hi ? "योजनाएँ" : "schemes"}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-[13.5px] font-black leading-snug text-stone-900 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
          {hi ? group.titleHi : group.titleEn}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">
          {hi ? group.blurbHi : group.blurbEn}
        </p>
      </div>
    </button>
  );
}

/** Clean State Selection Sheet/Modal */
function StateSelectModal({
  open,
  onClose,
  selectedState,
  onSelect,
  hi,
}: {
  open: boolean;
  onClose: () => void;
  selectedState: string;
  onSelect: (st: string) => void;
  hi: boolean;
}) {
  const [filter, setFilter] = useState("");
  if (!open) return null;

  const allStateKeys = ["all", ...Object.keys(INDIAN_STATES_SCHEME_META)];
  const filtered = allStateKeys.filter((st) => {
    if (st === "all") return true;
    const meta = INDIAN_STATES_SCHEME_META[st];
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      st.toLowerCase().includes(q) ||
      (meta?.stateHi && meta.stateHi.toLowerCase().includes(q))
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-2xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              {hi ? "📍 अपना राज्य चुनें" : "Select Your State"}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {hi ? "राज्य के अनुसार सटीक योजनाएं दिखेंगी" : "Filter schemes by your state"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 p-1.5 text-stone-600 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative my-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={hi ? "राज्य का नाम खोजें…" : "Search state…"}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-xs font-semibold text-stone-900 outline-none focus:border-emerald-600 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[50vh]">
          {filtered.map((st) => {
            const isSelected = selectedState === st;
            const label =
              st === "all"
                ? hi ? "🇮🇳 सभी राज्य (All India)" : "All States (All India)"
                : `${INDIAN_STATES_SCHEME_META[st]?.stateHi || st} (${st})`;
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  onSelect(st);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition active:scale-[0.99]",
                  isSelected
                    ? "bg-emerald-950 text-white shadow-xs dark:bg-emerald-600"
                    : "bg-stone-50/80 text-stone-800 hover:bg-stone-100 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800"
                )}
              >
                <span>{label}</span>
                {isSelected ? <Check className="h-4 w-4 text-emerald-300" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
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

  const statusBadge =
    schemeMeta?.windowStatus === "open"
      ? { text: hi ? "🟢 आवेदन चालू" : "🟢 Open", color: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" }
      : schemeMeta?.windowStatus === "seasonal"
      ? { text: hi ? "🟡 मौसमी विंडो" : "🟡 Seasonal", color: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40" }
      : schemeMeta?.windowStatus === "quota"
      ? { text: hi ? "🔵 टोकन कोटा" : "🔵 Quota", color: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40" }
      : { text: hi ? "🟢 सक्रिय" : "🟢 Active", color: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" };

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition hover:border-emerald-500/40 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      <AppLink
        href={schemeHref(scheme.id)}
        onClick={() => track("scheme_card_open", { id: scheme.id, from: "schemes_list", state: selectedState })}
        className="group relative flex min-h-[96px] active:scale-[0.99]"
      >
        <span className="relative w-[32%] min-w-[100px] max-w-[130px] shrink-0 self-stretch">
          <Image
            src={img}
            alt=""
            fill
            sizes="150px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-white/40 dark:to-stone-900/40" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9.5px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {hi ? (scheme.level === "central" ? "🇮🇳 केंद्र सरकार" : "🏛️ राज्य सरकार") : scheme.level}
            </span>

            {scheme.level === "state" && scheme.state ? (
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-black text-amber-800 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                ⭐ {INDIAN_STATES_SCHEME_META[scheme.state]?.stateHi || scheme.state}
              </span>
            ) : null}

            <span className={cn("rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold", statusBadge.color)}>
              {statusBadge.text}
            </span>
          </div>

          <h3 className="line-clamp-1 text-[14px] font-extrabold leading-snug text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
            {title}
          </h3>

          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-stone-500 dark:text-stone-400">
            {hook}
          </p>

          {scheme.benefitAmount && (
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 w-fit">
              <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{scheme.benefitAmount}</span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
            {official ? (
              <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-emerald-800 dark:text-emerald-400">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span>{hi ? "आधिकारिक पोर्टल" : "Official portal"}</span>
              </span>
            ) : (
              <span className="text-[10px] font-medium text-stone-400">
                {hi ? "मार्गदर्शन" : "Guidance"}
              </span>
            )}

            <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-emerald-800 transition group-hover:translate-x-0.5 dark:text-emerald-300">
              {hi ? "पात्रता व प्रक्रिया →" : "Details →"}
            </span>
          </div>
        </span>
      </AppLink>

      {official && onOfficial ? (
        <div className="border-t border-stone-100 bg-stone-50/60 px-3 py-1.5 flex items-center justify-between dark:border-stone-800 dark:bg-stone-900/60">
          <span className="text-[11px] font-medium text-stone-400 truncate max-w-[60%]">
            {scheme.authority ? scheme.authority.split(",")[0] : ""}
          </span>
          <button
            type="button"
            onClick={() => onOfficial(scheme)}
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 hover:underline dark:text-emerald-300"
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
  const [showStateModal, setShowStateModal] = useState<boolean>(false);
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
      ? hi ? "सभी राज्य" : "All India"
      : INDIAN_STATES_SCHEME_META[selectedState]?.stateHi || selectedState;

  // Split into 4 Core categories for 2x2 Bento and secondary
  const coreGroups = SCHEME_GROUPS.slice(0, 4);
  const secondaryGroups = SCHEME_GROUPS.slice(4);

  return (
    <AppShell>
      <div className="space-y-4 pb-12">
        <TopBar
          hi={hi}
          selectedStateNameHi={selectedStateNameHi}
          onOpenStateModal={() => setShowStateModal(true)}
        />

        {/* Search Bar with Clear Button */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              hi
                ? "योजना या लाभ खोजें… जैसे KCC, सोलर, तारबंदी, PM-KISAN"
                : "Search schemes… KCC, solar, fencing, PM-KISAN"
            }
            className="min-h-[46px] w-full rounded-2xl border border-stone-200/90 bg-white py-2.5 pl-11 pr-10 text-[13px] font-medium text-stone-900 shadow-xs outline-none transition ring-emerald-500/20 focus:border-emerald-600 focus:ring-4 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            aria-label={hi ? "योजना खोजें" : "Search schemes"}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Segmented Switch (All | Central | State) */}
        <div className="flex rounded-2xl border border-stone-200/90 bg-stone-100/80 p-1 dark:border-stone-800 dark:bg-stone-900/90">
          {(["all", "central", "state"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLevel(id)}
              className={cn(
                "flex-1 rounded-xl py-2 text-center text-[12px] font-extrabold transition",
                level === id
                  ? "bg-white text-stone-900 shadow-xs dark:bg-stone-800 dark:text-white"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              )}
            >
              {id === "all"
                ? hi
                  ? "सभी स्तर"
                  : "All"
                : id === "central"
                ? hi
                  ? "🇮🇳 केंद्र सरकार"
                  : "Central"
                : hi
                ? "🏛️ राज्य सरकार"
                : "State"}
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
              <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-[13px] font-semibold text-stone-500 dark:border-stone-800 dark:bg-stone-900 space-y-2">
                <p>{hi ? "इस नाम से कोई योजना नहीं मिली।" : "No schemes found matching search."}</p>
                <p className="text-[11px] text-stone-400">
                  {hi
                    ? "सुझाव: KCC, सोलर, बीमा या नकद लिखकर खोजें।"
                    : "Tip: Try searching KCC, solar, or insurance."}
                </p>
              </div>
            )}
          </section>
        ) : activeGroup ? (
          <section className="space-y-3">
            <button
              type="button"
              onClick={() => setView("overview")}
              className="inline-flex items-center gap-1.5 text-[13px] font-black text-emerald-800 dark:text-emerald-300"
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
                className="inline-flex items-center gap-1.5 text-[13px] font-black text-emerald-800 dark:text-emerald-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{hi ? "वापस श्रेणियाँ" : "Back to categories"}</span>
              </button>
            ) : null}

            {view === "overview" && !forYou ? (
              <>
                {/* 2x2 Bento Grid for Core Scheme Categories */}
                <section>
                  <SectionTitle>
                    {hi ? "किस प्रकार की मदद चाहिए?" : "What help do you need?"}
                  </SectionTitle>

                  {/* 2x2 Clean Bento Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {coreGroups.map((group) => (
                      <BentoCategoryCard
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

                  {/* Secondary Categories Pill Strip */}
                  <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {secondaryGroups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => {
                          setView(group.id);
                          track("scheme_group_open", { id: group.id });
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-[12px] font-black text-stone-700 shadow-xs transition hover:border-emerald-600/40 hover:text-emerald-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                      >
                        <span>{hi ? group.titleHi : group.titleEn}</span>
                        <span className="rounded-full bg-stone-100 px-1.5 py-0.2 text-[10px] font-bold text-stone-500 dark:bg-stone-800">
                          {groupCounts[group.id]}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Recommended / Popular in state */}
                <section className="pt-1">
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
                    className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-2xl bg-emerald-950 text-[13px] font-black text-white shadow-xs transition hover:bg-emerald-900 active:scale-95 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  >
                    <span>
                      {hi
                        ? `सभी ${filteredSchemes.length} योजनाएँ देखें`
                        : `See all ${filteredSchemes.length} schemes`}
                    </span>
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

      {/* State Selection Modal */}
      <StateSelectModal
        open={showStateModal}
        onClose={() => setShowStateModal(false)}
        selectedState={selectedState}
        onSelect={(st) => {
          setSelectedState(st);
          track("scheme_filter_state", { state: st });
        }}
        hi={hi}
      />

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
