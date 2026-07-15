"use client";

import { useMemo, useState, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import PageHero from "@/components/shell/PageHero";
import CommunityQueryCard from "@/components/community/CommunityQueryCard";
import {
  COMMUNITY_DISCUSSIONS,
  COMMUNITY_EXPERTS,
  POPULAR_TOPICS,
  TRENDING,
  COMMUNITY_POLL,
} from "@/data/mock/community";
import { communityQueries } from "@/data/queries";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useToast } from "@/components/ui/Toast";
import { readStorage, writeStorage } from "@/lib/storage";
import { AV } from "@/lib/design/tokens";
import { Eye, MessageCircle, Flame, Users } from "lucide-react";

const TABS = ["All", "My Questions", "Unanswered", "Following"] as const;
const POLL_KEY = "agriveda-community-poll";
const FOLLOWING_KEY = "agriveda-community-following";

const GUIDELINES = [
  "Crop name aur stage clearly likhein — photo attach karein jahan possible ho.",
  "Chemical dose hamesha label / CIB&RC registration se verify karein.",
  "Dusre kisanon ka respect karein — spam ya wrong advice share na karein.",
  "Personal phone / bank details public post mein na daalein.",
  "Urgent field emergency ke liye AI Doctor ya local KVK se contact karein.",
];

export default function CommunityPage() {
  const { showToast } = useToast();
  const { queries: myQueries, hydrated } = useQueryHistory();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [pollVote, setPollVote] = useState<string | null>(null);

  useEffect(() => {
    setPollVote(readStorage<string | null>(POLL_KEY, null));
    const saved = readStorage<string[]>(FOLLOWING_KEY, []);
    setFollowing(new Set(saved));
  }, []);

  const allQueries = useMemo(() => {
    if (!hydrated) return communityQueries;
    const ids = new Set(myQueries.map((q) => q.id));
    const merged = [...myQueries, ...communityQueries.filter((q) => !ids.has(q.id))];
    return merged;
  }, [myQueries, hydrated]);

  const filteredQueries = useMemo(() => {
    if (tab === "My Questions") return allQueries.filter((q) => q.isMine);
    if (tab === "Unanswered") return allQueries.filter((q) => q.expertResponse?.date === "Pending review");
    if (tab === "Following") {
      const expertNames = new Set(
        COMMUNITY_EXPERTS.filter((e) => following.has(e.name)).map((e) => e.name)
      );
      return allQueries.filter((q) => q.expertResponse && expertNames.has(q.expertResponse.expertName));
    }
    return allQueries;
  }, [allQueries, tab, following]);

  const votePoll = (label: string) => {
    setPollVote(label);
    writeStorage(POLL_KEY, label);
    showToast(`Vote saved: ${label}`);
  };

  const followExpert = (name: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.add(name);
      writeStorage(FOLLOWING_KEY, [...next]);
      return next;
    });
    showToast(`${name} ko follow kiya`);
  };

  return (
    <AppShell
      className="!bg-transparent"
      title="Community"
      subtitle="Connect, share, learn and grow together"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Community" }]}
    >
      <PageHero
        title="Kisan Community"
        subtitle="Apne sawal phone pe save karein. Turant jawab ke liye AI Doctor use karein — expert network abhi live nahi."
        badge="Local"
        icon={Users}
        action={{ label: "Ask AI Doctor", href: "/ai-doctor" }}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <DarkCard delay={0} className="text-center">
          <p className="text-lg font-bold text-[var(--av-accent)]">{hydrated ? myQueries.length : "—"}</p>
          <p className="text-[10px] font-semibold text-[var(--av-text-primary)]">My saved asks</p>
          <p className="text-[9px] text-[var(--av-text-muted)]">On this phone</p>
        </DarkCard>
        <DarkCard delay={1} className="text-center">
          <p className="text-lg font-bold text-[var(--av-accent)]">AI</p>
          <p className="text-[10px] font-semibold text-[var(--av-text-primary)]">Field doctor</p>
          <p className="text-[9px] text-[var(--av-text-muted)]">Photo + text answers</p>
        </DarkCard>
        <DarkCard delay={2} className="text-center">
          <p className="text-lg font-bold text-[var(--av-accent)]">Guide</p>
          <p className="text-[10px] font-semibold text-[var(--av-text-primary)]">Crop tips</p>
          <p className="text-[9px] text-[var(--av-text-muted)]">Per crop tabs</p>
        </DarkCard>
        <DarkCard delay={3} className="text-center">
          <p className="text-lg font-bold text-[var(--av-accent)]">KVK</p>
          <p className="text-[10px] font-semibold text-[var(--av-text-primary)]">Local help</p>
          <p className="text-[9px] text-[var(--av-text-muted)]">District agri office</p>
        </DarkCard>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <AppLink href="/ai-doctor" className="av-chip">
          Ask AI Doctor
        </AppLink>
        <AppLink href="/ask-query" className="av-chip">
          Save a question
        </AppLink>
        <AppLink href="/crops" className="av-chip">
          Crop guides
        </AppLink>
      </div>

      <DarkCard className="mt-4 border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent" delay={0}>
        <h3 className={AV.sectionTitle}>Community guidelines</h3>
        <ul className={`mt-2 space-y-1 ${AV.micro}`}>
          {GUIDELINES.map((g) => (
            <li key={g} className="flex gap-2 text-[var(--av-text-secondary)]">
              <span className="text-[var(--av-accent)]">•</span>
              {g}
            </li>
          ))}
        </ul>
      </DarkCard>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tab === t ? "bg-[var(--av-accent)]/20 text-[var(--av-accent)]" : "text-[var(--av-text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQueries.length > 0 ? (
              filteredQueries.map((q) => <CommunityQueryCard key={q.id} query={q} />)
            ) : (
              <DarkCard className="text-center">
                <p className="text-sm font-semibold text-[var(--av-text-primary)]">कोई query नहीं</p>
                <AppLink href="/ask-query" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
                  Ask a Question
                </AppLink>
              </DarkCard>
            )}
          </div>

          <DarkCard delay={2}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recent Discussions</h3>
            <ul className="mt-3 space-y-2">
              {COMMUNITY_DISCUSSIONS.map((d) => (
                <li key={d.id}>
                  <AppLink href="/ask-query" className="block rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 transition hover:border-[#10b981]/30">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[var(--av-accent)]/15 px-2 py-0.5 text-[9px] font-bold text-[var(--av-accent)]">{d.crop}</span>
                      <span className="text-[9px] text-[var(--av-text-muted)]">{d.time}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--av-text-primary)]">{d.title}</p>
                    <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{d.author} · {d.location}</p>
                    <div className="mt-2 flex gap-3 text-[10px] text-[var(--av-text-muted)]">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {d.views}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {d.comments}</span>
                    </div>
                  </AppLink>
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard delay={2}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Trending in Community</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {TRENDING.map((t) => (
                <AppLink
                  key={t.title}
                  href="/ask-query"
                  className="w-48 shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 transition hover:border-[var(--av-accent)]/30"
                >
                  <span className="flex items-center gap-1 text-[9px] font-bold text-orange-400"><Flame className="h-3 w-3" /> Trending</span>
                  <p className="mt-2 text-xs font-semibold text-[var(--av-text-primary)]">{t.title}</p>
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{t.answers} answers</p>
                </AppLink>
              ))}
            </div>
          </DarkCard>
        </div>

        <div className="space-y-4">
          <DarkCard hover delay={1}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Expert Corner</h3>
            <ul className="mt-3 space-y-2">
              {COMMUNITY_EXPERTS.map((e) => (
                <li key={e.name} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-[var(--av-text-primary)]">{e.name}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{e.role} · {e.exp}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => followExpert(e.name)}
                    className={`text-[10px] font-bold ${following.has(e.name) ? "text-[var(--av-text-muted)]" : "text-[var(--av-accent)]"}`}
                  >
                    {following.has(e.name) ? "Following" : "Follow"}
                  </button>
                </li>
              ))}
            </ul>
            <AppLink href="/ask-query" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
              Ask an Expert
            </AppLink>
          </DarkCard>

          <DarkCard hover delay={2}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Popular Topics</h3>
            <ul className="mt-3 space-y-2">
              {POPULAR_TOPICS.map((t) => (
                <li key={t.topic} className="flex justify-between text-xs">
                  <span className="text-[var(--av-text-secondary)]">{t.topic}</span>
                  <span className="text-[var(--av-text-muted)]">{t.count}</span>
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard hover delay={3}>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Community Poll</h3>
            <p className="mt-2 text-xs text-[var(--av-text-secondary)]">{COMMUNITY_POLL.question}</p>
            <div className="mt-3 space-y-2">
              {COMMUNITY_POLL.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => votePoll(o.label)}
                  className={`block w-full rounded-lg border px-2 py-1.5 text-left transition ${
                    pollVote === o.label
                      ? "border-[var(--av-accent)] bg-[var(--av-accent)]/10"
                      : "border-transparent hover:border-[var(--av-border)]"
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-[var(--av-text-muted)]">
                    <span>{o.label}</span><span>{o.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[#1f2937]">
                    <div className="h-full rounded-full bg-[var(--av-accent)]" style={{ width: `${o.pct}%` }} />
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[9px] text-[var(--av-text-muted)]">{COMMUNITY_POLL.votes} votes</p>
          </DarkCard>
        </div>
      </div>

      <ShellCtaBanner
        title="Ask AI Community Assistant"
        description="Get instant answers, crop solutions & expert suggestions."
        buttonLabel="Chat Now"
        href="/kisan-saathi"
      />
    </AppShell>
  );
}
