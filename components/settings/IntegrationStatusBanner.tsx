"use client";

import { useEffect, useState } from "react";
import AppLink from "@/components/ui/AppLink";

type Services = Record<string, string>;

const LABELS: Record<string, string> = {
  gemini: "AI (Gemini)",
  supabase: "Supabase",
  firebase: "Google लॉगिन",
  mandi: "मंडी",
  sessionSecret: "Session",
  fcm: "Push (FCM)",
};

/**
 * Settings/admin honesty banner — shows which production services are missing keys.
 */
export default function IntegrationStatusBanner() {
  const [services, setServices] = useState<Services | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: { services?: Services }) => {
        if (!cancelled && json.services) setServices(json.services);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!services) return null;

  const down = Object.entries(services).filter(([, v]) => v !== "ready" && v !== "dev_fallback");
  if (down.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-[12px] text-emerald-900 dark:text-emerald-100">
        सर्वर सेवाएँ तैयार · AI / लॉगिन / क्लाउड सिंक
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[12px] leading-relaxed text-amber-950 dark:text-amber-50">
      <p className="font-bold">कुछ सेवाएँ बंद / अधूरी</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-4">
        {down.map(([k, v]) => (
          <li key={k}>
            {LABELS[k] || k}: {v}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11px] opacity-90">
        Vercel / .env.local में keys लगाएँ · SQL:{" "}
        <span className="font-mono">supabase/farmer-cloud-sync.sql</span>
      </p>
      <AppLink href="/admin" className="mt-1 inline-block text-[11px] font-bold text-amber-900 underline dark:text-amber-100">
        एडमिन देखें
      </AppLink>
    </div>
  );
}
