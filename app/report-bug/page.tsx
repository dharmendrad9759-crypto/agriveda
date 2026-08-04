"use client";

import { useState } from "react";
import { Bug, Mail, Send } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { AV } from "@/lib/design/tokens";
import { track } from "@/lib/analytics";
import { useToast } from "@/components/ui/Toast";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { APP_VERSION, SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/appMeta";

const TOPICS = [
  { id: "bug", label: "ऐप में गड़बड़ / Bug" },
  { id: "ai", label: "AI Doctor गलत जवाब" },
  { id: "slow", label: "ऐप धीमा खुलता है" },
  { id: "other", label: "और सुझाव" },
] as const;

export default function ReportBugPage() {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["id"]>("bug");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = () => {
    const text = message.trim();
    if (text.length < 8) {
      showToast("थोड़ा विस्तार से लिखें (कम से कम 8 अक्षर)", "error");
      return;
    }
    setSending(true);

    // Privacy: never put message body / location in analytics
    track("bug_report", {
      topic,
      length: text.length,
      native: isCapacitorNative(),
    });

    const topicLabel = TOPICS.find((x) => x.id === topic)?.label ?? topic;
    const subject = encodeURIComponent(`[Agriveda ${APP_VERSION}] ${topicLabel}`);
    const body = encodeURIComponent(
      `${text}\n\n---\nApp ${APP_VERSION} · ${isCapacitorNative() ? "Android" : "Web"}`
    );
    window.location.href = `${SUPPORT_MAILTO}?subject=${subject}&body=${body}`;

    setSending(false);
    setMessage("");
    showToast(`ईमेल ऐप खुलेगा → ${SUPPORT_EMAIL}`, "success");
  };

  return (
    <AppShell
      className="!bg-transparent"
      title="समस्या बताएँ"
      subtitle="सीधे support ईमेल — डेटा बिना तीसरे SDK के"
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: t("shellReportBug") },
      ]}
    >
      <DarkCard>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
            <Bug className="h-4 w-4" />
          </span>
          <div>
            <h2 className={AV.sectionTitle}>क्या समस्या है?</h2>
            <p className={AV.micro}>
              रिपोर्ट आपके ईमेल ऐप से {SUPPORT_EMAIL} पर जाएगी
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTopic(item.id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                topic === item.id
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-[var(--av-border)] text-[var(--av-text-secondary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="उदाहरण: AI Doctor खोलते ही ऐप रुक जाता है…"
          className="av-input mt-3 w-full resize-none text-sm"
        />

        <button
          type="button"
          disabled={sending}
          onClick={submit}
          className={`mt-3 flex w-full items-center justify-center gap-2 ${AV.btnPrimary}`}
        >
          <Send className="h-4 w-4" />
          {sending ? "…" : "ईमेल से भेजें"}
        </button>

        <a
          href={SUPPORT_MAILTO}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--av-border)] py-2.5 text-sm font-bold text-[var(--av-text-secondary)]"
        >
          <Mail className="h-4 w-4" />
          {SUPPORT_EMAIL}
        </a>
      </DarkCard>
    </AppShell>
  );
}
