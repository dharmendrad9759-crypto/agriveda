"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Search,
  Shield,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import { farmerSchemes, type FarmerScheme } from "@/data/schemes/farmerSchemes";
import { hasOfficialSource } from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
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

function schemeHref(id: string) {
  return GUIDED.has(id) ? `/schemes/${id}/guide` : `/schemes/${id}`;
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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-[16px] font-extrabold text-[#07512f] dark:text-emerald-100">
          {hi ? "किसान योजनाएँ" : "Farmer Schemes"}
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
      <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 bg-emerald-950 px-3 py-3">
        <span className="text-[14px] font-extrabold leading-snug text-white">
          {hi ? group.titleHi : group.titleEn}
        </span>
        <span className="line-clamp-2 text-[11px] font-medium leading-snug text-emerald-100/85">
          {hi ? group.blurbHi : group.blurbEn}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200">
          {count} {hi ? "योजनाएँ · देखो" : "schemes · open"}
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

/** Photo-forward scheme card */
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
  const title = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, hi);
  const hook = farmerSchemeHook(scheme.id, scheme.hookHi, hi);

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[var(--av-surface)] shadow-[0_10px_28px_-14px_rgba(6,78,59,0.35)]">
      <AppLink
        href={schemeHref(scheme.id)}
        onClick={() => track("scheme_card_open", { id: scheme.id, from: "schemes_list" })}
        className="group relative flex min-h-[88px] active:scale-[0.99]"
      >
        <span className="relative w-[38%] min-w-[110px] max-w-[150px] shrink-0 self-stretch">
          <Image
            src={img}
            alt=""
            fill
            sizes="150px"
            className="object-cover transition duration-400 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--av-surface)]/30" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-2.5 py-2.5">
          <span className="line-clamp-2 text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
            {title}
          </span>
          <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--av-text-secondary)]">
            {hook}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-[#07512f] dark:text-emerald-200">
              {hi ? (scheme.level === "central" ? "केंद्र" : "राज्य") : scheme.level}
            </span>
            {official ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-600/15 px-1.5 py-0.5 text-[9px] font-bold text-[#07512f] dark:text-emerald-200">
                <Shield className="h-2.5 w-2.5" />
                {hi ? "सरकारी" : "Official"}
              </span>
            ) : null}
            <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
              {hi ? "खोलो" : "Open"}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </span>
      </AppLink>
      {official && onOfficial ? (
        <div className="border-t border-[var(--av-border)] px-3 py-1.5">
          <button
            type="button"
            onClick={() => onOfficial(scheme)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-950 py-2 text-[12px] font-bold text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {hi ? "सरकारी साइट खोलो" : "Open official site"}
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
  const [forYou, setForYou] = useState<FarmerScheme[] | null>(null);
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
      const farmer = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, true);
      const blob = [
        farmer,
        scheme.nameHi,
        scheme.nameEn,
        scheme.hookHi,
        farmerSchemeHook(scheme.id, scheme.hookHi, true),
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
    const ids = isUp ? ["pm-kisan", "crop-residue", "kcc"] : ["pm-kisan", "pm-kusum", "kcc"];
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

        {/* Cinematic hero */}
        <section className="relative min-h-[120px] overflow-hidden rounded-2xl shadow-lg shadow-emerald-950/25">
          <Image
            src={SCHEMES_HOME_BANNER}
            alt=""
            fill
            priority
            sizes="640px"
            className="object-cover object-[center_28%]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/55 to-black/20" />
          <div className="relative z-10 flex min-h-[120px] flex-col justify-end p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200/90">
              AgriVeda
            </p>
            <p className="mt-0.5 text-[17px] font-extrabold leading-tight text-white">
              {hi ? "सरकारी मदद समझो" : "Understand govt help"}
            </p>
            <p className="mt-0.5 max-w-[92%] text-[11px] font-medium text-emerald-50/90">
              {hi
                ? "पैसा · कर्ज · बीमा · मशीन — आसान भाषा में"
                : "Cash · credit · insurance · machines — simple words"}
            </p>
          </div>
        </section>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={hi ? "योजना खोजो… जैसे KCC, बीमा" : "Search… KCC, insurance"}
            className="min-h-[44px] w-full rounded-2xl border border-emerald-800/15 bg-[var(--av-surface)] py-2.5 pl-10 pr-3 text-[13px] font-medium text-[var(--av-text-primary)] shadow-sm outline-none ring-emerald-600/30 focus:ring-2"
            aria-label={hi ? "योजना खोजो" : "Search schemes"}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {(["all", "central", "state"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLevel(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[12px] font-extrabold transition",
                level === id
                  ? "bg-emerald-950 text-white shadow-md"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              )}
            >
              {id === "all" ? (hi ? "सभी" : "All") : id === "central" ? (hi ? "केंद्र" : "Central") : hi ? "राज्य" : "State"}
            </button>
          ))}
        </div>

        {hasSearch ? (
          <section className="space-y-3">
            <SectionTitle>
              {hi ? `खोज (${searched.length})` : `Search (${searched.length})`}
            </SectionTitle>
            {searched.length ? (
              <div className="space-y-3">
                {searched.map((scheme) => (
                  <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--av-border)] px-4 py-10 text-center text-[13px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "कुछ नहीं मिला — दूसरा नाम लिखो" : "Nothing found — try another word"}
              </p>
            )}
          </section>
        ) : activeGroup ? (
          <section className="space-y-3">
            <button
              type="button"
              onClick={() => setView("overview")}
              className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {hi ? "सभी श्रेणियाँ" : "All categories"}
            </button>
            <GroupHero group={activeGroup} hi={hi} count={activeGroupSchemes.length} />
            <div className="space-y-3">
              {activeGroupSchemes.map((scheme) => (
                <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
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
                className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
              >
                <ArrowLeft className="h-4 w-4" />
                {hi ? "वापस" : "Back"}
              </button>
            ) : null}

            {view === "overview" && !forYou ? (
              <>
                <section>
                  <SectionTitle>{hi ? "किस मदद की ज़रूरत?" : "What help do you need?"}</SectionTitle>
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

                <section>
                  <SectionTitle>{hi ? "अक्सर पूछी जाती हैं" : "Often asked"}</SectionTitle>
                  <div className="space-y-3">
                    {recommended.map((scheme) => (
                      <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForYou(null);
                      setView("all");
                      allRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1 rounded-2xl bg-emerald-950 text-[13px] font-extrabold text-white shadow-md"
                  >
                    {hi ? "सभी योजनाएँ देखो" : "See all schemes"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </section>
              </>
            ) : null}

            {view === "all" || forYou ? (
              <div ref={allRef}>
                <SectionTitle>
                  {forYou
                    ? hi
                      ? `मेल (${forYou.length})`
                      : `Matches (${forYou.length})`
                    : hi
                      ? `सभी (${listForView.length})`
                      : `All (${listForView.length})`}
                </SectionTitle>
                <div className="space-y-3">
                  {listForView.map((scheme) => (
                    <SchemeListCard key={scheme.id} scheme={scheme} hi={hi} onOfficial={openOfficial} />
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

