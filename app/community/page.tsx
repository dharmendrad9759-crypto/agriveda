"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import {
  COMMUNITY_STATS,
  COMMUNITY_DISCUSSIONS,
  COMMUNITY_EXPERTS,
  POPULAR_TOPICS,
  TRENDING,
  COMMUNITY_POLL,
} from "@/data/mock/community";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";
import { Eye, MessageCircle, Flame } from "lucide-react";

const TABS = ["All", "My Questions", "Unanswered", "Following"] as const;

export default function CommunityPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [pollVote, setPollVote] = useState<string | null>(null);

  return (
    <AppShell
      title="Community"
      subtitle="Connect, share, learn and grow together"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Community" }]}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {COMMUNITY_STATS.map((s, i) => (
          <DarkCard key={s.label} delay={i} className="text-center">
            <p className="text-lg font-bold text-[var(--av-accent)]">{s.value}</p>
            <p className="text-[10px] font-semibold text-[var(--av-text-primary)]">{s.label}</p>
            <p className="text-[9px] text-[var(--av-text-muted)]">{s.sub}</p>
          </DarkCard>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Ask a Question", "Share Experience", "Post Photo", "Polls & Surveys"].map((label) => (
          <AppLink key={label} href="/ask-query" className="av-chip">
            {label}
          </AppLink>
        ))}
      </div>

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

          <DarkCard delay={1}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recent Discussions</h3>
              <AppLink href="/ask-query" className="text-xs text-[var(--av-accent)]">View All →</AppLink>
            </div>
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
                    onClick={() => {
                      setFollowing((prev) => new Set(prev).add(e.name));
                      showToast(`${e.name} ko follow kiya`);
                    }}
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
                  onClick={() => {
                    setPollVote(o.label);
                    showToast(`Vote: ${o.label}`);
                  }}
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
