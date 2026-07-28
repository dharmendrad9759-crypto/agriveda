"use client";

import { useState } from "react";
import { Bug, Send } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { AV } from "@/lib/design/tokens";
import { track } from "@/lib/analytics";
import { useToast } from "@/components/ui/Toast";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { isCapacitorNative } from "@/lib/capacitorNav";

const TOPICS = [
  { id: "bug", label: "ऐप में गड़बड़ / Bug" },
  { id: "ai", label: "AI Doctor गलत जवाब" },
  { id: "slow", label: "ऐप धीमा खुलता है" },
  { id: "other", label: "और सुझाव" },
] as const;

export default function ReportBugPage() {
  const { showToast } = useToast();
  const { profile } = useFarmerProfile();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["id"]>("bug");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    const text = message.trim();
    if (text.length < 8) {
      showToast("थोड़ा विस्तार से लिखें (कम से कम 8 अक्षर)", "error");
      return;
    }
    setSending(true);
    track("bug_report", {
      topic,
      length: text.length,
      district: profile.district || "",
      state: profile.state || "",
      native: isCapacitorNative(),
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "bug_report_detail",
          props: {
            topic,
            message: text.slice(0, 800),
            district: profile.district || "",
            state: profile.state || "",
            native: isCapacitorNative(),
          },
          t: new Date().toISOString(),
        }),
      });
    } catch {
      /* local track already saved */
    }
    setSending(false);
    setMessage("");
    showToast("रिपोर्ट मिल गई — धन्यवाद ✓", "success");
  };

  return (
    <AppShell
      className="!bg-transparent"
      title="समस्या बताएँ"
      subtitle="Bug या सुझाव — हम सुधारेंगे"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Report" },
      ]}
    >
      <DarkCard>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
            <Bug className="h-4 w-4" />
          </span>
          <div>
            <h2 className={AV.sectionTitle}>क्या समस्या है?</h2>
            <p className={AV.micro}>बिना नाम के भी भेज सकते हैं</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                topic === t.id
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-[var(--av-border)] text-[var(--av-text-secondary)]"
              }`}
            >
              {t.label}
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
          onClick={() => void submit()}
          className={`mt-3 flex w-full items-center justify-center gap-2 ${AV.btnPrimary}`}
        >
          <Send className="h-4 w-4" />
          {sending ? "भेज रहे हैं…" : "रिपोर्ट भेजें"}
        </button>
      </DarkCard>
    </AppShell>
  );
}
