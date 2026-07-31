"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import CommunityQueryCard from "@/components/community/CommunityQueryCard";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { MessageCirclePlus, Stethoscope, Users } from "lucide-react";

const TABS_HI = [
  { id: "mine", label: "मेरे सवाल" },
  { id: "answered", label: "जवाब मिले" },
] as const;

type TabId = (typeof TABS_HI)[number]["id"];

export default function CommunityPage() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const { queries: myQueries, hydrated } = useQueryHistory();
  const [tab, setTab] = useState<TabId>("mine");

  const filtered = useMemo(() => {
    if (tab === "answered") {
      return myQueries.filter((q) => Boolean(q.expertResponse?.fullAnswer || q.expertResponse?.preview));
    }
    return myQueries;
  }, [myQueries, tab]);

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "किसान समुदाय" : "Community"}
      subtitle={isHi ? "आपके सवाल और विशेषज्ञ सलाह" : "Your questions and expert advice"}
      breadcrumbs={[
        { label: isHi ? "होम" : "Home", href: "/" },
        { label: isHi ? "समुदाय" : "Community" },
      ]}
    >
      <div className="relative mx-auto min-w-0 max-w-lg space-y-4 pb-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-20px] -top-4 h-56 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.16),transparent_55%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(180deg,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        </div>

        <DarkCard className="relative overflow-hidden !p-0">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-5 text-white sm:px-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100/90">
                  Agriveda
                </p>
                <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight">
                  {isHi ? "मेरे खेत के सवाल" : "My field questions"}
                </h2>
                <p className="mt-1 text-sm text-emerald-50/90">
                  {isHi
                    ? "यहाँ आपके भेजे सवाल और मिली सलाह दिखती है।"
                    : "Your sent questions and advice appear here."}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <AppLink
                href="/ask-query"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-emerald-800"
              >
                <MessageCirclePlus className="h-3.5 w-3.5" />
                {isHi ? "नया सवाल" : "New question"}
              </AppLink>
              <AppLink
                href="/ai-doctor"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-xs font-bold text-white"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                {isHi ? "AI डॉक्टर" : "AI Doctor"}
              </AppLink>
            </div>
          </div>
        </DarkCard>

        <div className="relative flex gap-1 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-1">
          {TABS_HI.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                tab === t.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[var(--av-text-secondary)]"
              }`}
            >
              {isHi ? t.label : t.id === "mine" ? "My asks" : "Answered"}
              {t.id === "mine" && hydrated ? ` (${myQueries.length})` : ""}
            </button>
          ))}
        </div>

        {!hydrated ? (
          <DarkCard>
            <p className="py-8 text-center text-sm text-[var(--av-text-muted)]">
              {isHi ? "लोड हो रहा है…" : "Loading…"}
            </p>
          </DarkCard>
        ) : filtered.length === 0 ? (
          <DarkCard className="text-center">
            <p className="text-sm font-bold text-[var(--av-text-primary)]">
              {isHi ? "अभी कोई सवाल नहीं" : "No questions yet"}
            </p>
            <p className="mt-1 text-xs text-[var(--av-text-muted)]">
              {isHi
                ? "AI डॉक्टर से निदान करके विशेषज्ञ से पूछें — जवाब यहाँ दिखेगा।"
                : "Ask via AI Doctor → expert confirm — answers show here."}
            </p>
            <AppLink href="/ask-query" className={`mt-4 inline-flex ${AV.btnPrimary}`}>
              {isHi ? "सवाल पूछें" : "Ask a question"}
            </AppLink>
          </DarkCard>
        ) : (
          <ul className="relative space-y-3">
            {filtered.map((q) => (
              <li key={q.id}>
                <CommunityQueryCard query={q} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
