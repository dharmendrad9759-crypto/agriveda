"use client";

import { useCallback, useEffect, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  MessageCircle,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import {
  buildConsultWhatsAppText,
  openWhatsAppWithText,
} from "@/lib/whatsappShare";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/analytics";

type FarmerQuery = {
  id: string;
  cropName: string;
  queryText: string;
  photoUrl: string | null;
  aiDiagnosis: { diseaseName?: string; confidence?: number } | null;
  source: string;
  status: string;
  expertReply: string | null;
  expertName: string | null;
  answeredAt: string | null;
  createdAt: string;
};

function formatWhen(iso: string, hi: boolean): string {
  try {
    return new Date(iso).toLocaleString(hi ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function MyQueriesPage() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<FarmerQuery[]>([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const shareAnswerOnWhatsApp = (q: FarmerQuery) => {
    if (!q.expertReply) return;
    const text = buildConsultWhatsAppText({
      cropName: q.cropName,
      question: q.queryText,
      answer: q.expertReply,
      expertName: q.expertName,
      isHi,
    });
    const ok = openWhatsAppWithText(text);
    track("consult_whatsapp_share", { queryId: q.id, ok });
    if (ok) {
      showToast(
        isHi ? "WhatsApp खुल गया — भेजें" : "WhatsApp opened — send it",
        "success"
      );
    } else {
      showToast(
        isHi ? "WhatsApp नहीं खुला" : "Could not open WhatsApp",
        "error"
      );
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/expert-queries`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ||
            (isHi
              ? res.status === 401
                ? "पहले मोबाइल लॉगिन करें — फिर अपने सवाल दिखेंगे"
                : "लोड नहीं हुआ"
              : res.status === 401
                ? "Please log in first"
                : "Failed to load")
        );
        return;
      }
      setQueries((data.queries ?? []) as FarmerQuery[]);
    } catch {
      setError(isHi ? "नेटवर्क त्रुटि" : "Network error");
    } finally {
      setLoading(false);
    }
  }, [isHi]);

  useEffect(() => {
    load();
    const t = window.setInterval(() => {
      void load();
    }, 45_000);
    return () => window.clearInterval(t);
  }, [load]);

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "मेरे सवाल" : "My queries"}
      subtitle={
        isHi
          ? "जवाब आया तो WhatsApp पर भी भेज सकते हो"
          : "Share expert answers on WhatsApp"
      }
      breadcrumbs={[
        { label: isHi ? "होम" : "Home", href: "/" },
        { label: isHi ? "मेरे सवाल" : "My queries" },
      ]}
    >
      <div className="mx-auto max-w-lg space-y-3 pb-8">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[var(--av-text-muted)]">
            {isHi ? `${queries.length} सवाल` : `${queries.length} queries`}
          </p>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--av-border)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--av-accent)]"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            {isHi ? "रिफ्रेश" : "Refresh"}
          </button>
        </div>

        {error ? (
          <DarkCard className="border border-red-500/25 text-sm text-red-600">{error}</DarkCard>
        ) : null}

        {loading && queries.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : null}

        {!loading && queries.length === 0 ? (
          <DarkCard className="py-10 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-[var(--av-text-muted)]" />
            <p className="mt-3 text-sm font-semibold text-[var(--av-text-primary)]">
              {isHi ? "अभी कोई सवाल नहीं" : "No queries yet"}
            </p>
            <p className="mt-1 text-xs text-[var(--av-text-muted)]">
              {isHi
                ? "AI Doctor से विशेषज्ञ को भेजें — यहाँ दिखेगा"
                : "Send from AI Doctor → Ask expert — it appears here"}
            </p>
            <AppLink href="/ask-query" className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
              {isHi ? "सवाल पूछें" : "Ask a question"}
            </AppLink>
          </DarkCard>
        ) : null}

        {queries.map((q) => {
          const open = openId === q.id;
          const answered = q.status === "answered" && q.expertReply;
          return (
            <DarkCard key={q.id} className="!p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : q.id)}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    answered ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700"
                  )}
                >
                  {answered ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-[var(--av-text-primary)]">
                      {q.cropName}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold text-[var(--av-text-muted)]">
                      {answered
                        ? isHi
                          ? "जवाब मिल गया"
                          : "Answered"
                        : isHi
                          ? "प्रतीक्षा"
                          : "Pending"}
                    </span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs text-[var(--av-text-muted)]">
                    {q.queryText}
                  </span>
                  <span className="mt-1.5 block text-[10px] text-[var(--av-text-muted)]">
                    {formatWhen(q.createdAt, isHi)}
                    {q.source === "ai-doctor" ? " · AI Doctor" : ""}
                  </span>
                </span>
              </button>

              {open ? (
                <div className="space-y-3 border-t border-[var(--av-border-subtle)] px-4 pb-4 pt-3">
                  {q.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={q.photoUrl}
                      alt=""
                      className="h-36 w-full rounded-xl object-cover border border-[var(--av-border)]"
                    />
                  ) : null}
                  {q.aiDiagnosis?.diseaseName ? (
                    <div className="rounded-xl bg-emerald-500/8 px-3 py-2 text-xs">
                      <p className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-200">
                        <Stethoscope className="h-3.5 w-3.5" />
                        {q.aiDiagnosis.diseaseName}
                        {q.aiDiagnosis.confidence != null
                          ? ` · ${q.aiDiagnosis.confidence}%`
                          : ""}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                      {isHi ? "आपका सवाल" : "Your question"}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--av-text-secondary)]">
                      {q.queryText}
                    </p>
                  </div>
                  {answered ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-3 py-3">
                        <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                          {q.expertName || (isHi ? "विशेषज्ञ" : "Expert")}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--av-text-secondary)]">
                          {q.expertReply}
                        </p>
                        {q.answeredAt ? (
                          <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">
                            {formatWhen(q.answeredAt, isHi)}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareAnswerOnWhatsApp(q);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-[13px] font-bold text-white shadow-sm active:scale-[0.98]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {isHi
                          ? "WhatsApp पर जवाब भेजें"
                          : "Send answer on WhatsApp"}
                      </button>
                      <p className="text-center text-[10px] text-[var(--av-text-muted)]">
                        {isHi
                          ? "भाई / पड़ोसी / दूकानदार को आगे भेज सकते हो"
                          : "Forward to family, neighbour, or dealer"}
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-xl bg-[var(--av-surface-inset)] px-3 py-3 text-xs text-[var(--av-text-muted)]">
                      {isHi
                        ? "एडमिन / विशेषज्ञ जवाब लिख रहे हैं। थोड़ी देर बाद रिफ्रेश करें।"
                        : "Admin/expert is reviewing. Refresh in a while."}
                    </p>
                  )}
                </div>
              ) : answered ? (
                <div className="border-t border-[var(--av-border-subtle)] px-4 pb-3">
                  <button
                    type="button"
                    onClick={() => shareAnswerOnWhatsApp(q)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366]/95 px-3 py-2.5 text-[12px] font-bold text-white active:scale-[0.98]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {isHi ? "WhatsApp पर भेजें" : "Send on WhatsApp"}
                  </button>
                </div>
              ) : null}
            </DarkCard>
          );
        })}

        <AppLink href="/ask-query" className={`flex justify-center ${AV.btnSecondarySm}`}>
          {isHi ? "नया सवाल पूछें" : "Ask a new question"}
        </AppLink>
      </div>
    </AppShell>
  );
}
