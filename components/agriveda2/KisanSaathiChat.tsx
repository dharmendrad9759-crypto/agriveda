"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { clientKisanSaathiFallback } from "@/lib/kisanSaathiClient";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "पत्तियाँ पीली हो रही हैं — क्या करूँ?",
  "स्प्रे का सही समय कब है?",
  "बुआई अभी करूँ या रुकूँ?",
  "Khud ka khad schedule batao",
];

export default function KisanSaathiChat() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const cropOptions = crops.length > 0 ? crops : cropCatalog.slice(0, 6).map((c) => ({
    slug: c.slug,
    name: c.name,
    emoji: c.emoji,
  }));

  const [cropSlug, setCropSlug] = useState(cropOptions[0]?.slug ?? "paddy");
  const activeCrop = cropOptions.find((c) => c.slug === cropSlug) ?? cropOptions[0];

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: `नमस्ते${profile.name ? ` ${profile.name} जी` : ""}! मैं Kisan Saathi हूँ।\n\nनीचे फसल चुनें, सवाल लिखें या quick button dabayein — turant jawab milega.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMsg = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      const context = {
        cropSlug: activeCrop?.slug ?? cropSlug,
        cropName: activeCrop?.name,
        district: profile.district,
        state: profile.state,
        village: profile.village,
        replyLanguage: locale,
      };

      try {
        const apiUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/api/kisan-saathi/chat`
            : "/api/kisan-saathi/chat";

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            context,
          }),
        });

        const data = (await res.json()) as { reply?: string; error?: string };

        if (!res.ok || !data.reply) {
          throw new Error(data.error || "Server response nahi mila");
        }

        setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      } catch (err) {
        const fallback = clientKisanSaathiFallback(trimmed, context);
        setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
        showToast(
          err instanceof Error ? `Offline guide: ${err.message.slice(0, 40)}` : "Offline guide mode",
          "info"
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, activeCrop, cropSlug, profile, locale, showToast]
  );

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold theme-text-muted">किस फसल पर सलाह चाहिए?</label>
      <select
        value={cropSlug}
        onChange={(e) => setCropSlug(e.target.value)}
        className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm font-semibold"
      >
        {cropOptions.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.emoji} {c.name}
          </option>
        ))}
      </select>

      <GlassCard className="flex max-h-[min(58vh,480px)] flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-200 bg-white theme-text-primary dark:border-white/10 dark:bg-black/30"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              सोच रहा हूँ…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-200 p-3 dark:border-white/10">
          <div className="mb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                disabled={loading}
                className="shrink-0 rounded-full border border-emerald-500/30 px-3 py-1.5 text-[10px] font-bold text-emerald-700 active:scale-95 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="अपनी बात लिखें…"
              className="theme-input flex-1 rounded-xl border px-3 py-2.5 text-sm"
              disabled={loading}
            />
            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={() => void send(input)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white active:scale-95 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
