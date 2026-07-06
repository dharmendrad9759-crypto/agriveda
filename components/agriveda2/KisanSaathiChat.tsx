"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "पत्तियाँ पीली हो रही हैं — क्या करूँ?",
  "स्प्रे का सही समय कब है?",
  "बुआई अभी करूँ या रुकूँ?",
];

export default function KisanSaathiChat() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: `नमस्ते${profile.name ? ` ${profile.name} जी` : ""}! मैं Kisan Saathi हूँ। आपकी फसल ${crops[0]?.name ?? "Paddy"} और जगह ${profile.district || "—"} के हिसाब से सलाह दूँगा।`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/kisan-saathi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.role === "user" || m.content),
          context: {
            cropSlug: crops[0]?.slug,
            cropName: crops[0]?.name,
            district: profile.district,
            state: profile.state,
            village: profile.village,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Chat error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="flex max-h-[min(58vh,480px)] flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
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
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-700"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपनी बात लिखें…"
              className="theme-input flex-1 rounded-xl border px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
