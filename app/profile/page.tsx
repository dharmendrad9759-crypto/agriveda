"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useState } from "react";
import { Bug, ChevronRight, LogOut, Settings2, Sprout } from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { APP_NAME, APP_VERSION } from "@/lib/appMeta";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getCropEmoji, getCropHindiName } from "@/lib/crops/crop-display";
import { logoutAndReload } from "@/lib/appReset";
import { cn } from "@/lib/cn";
import type { AppLocale } from "@/lib/i18n/farmer-ui";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "क";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-[#3d6b56] dark:text-emerald-100/80">
        {label}
      </p>
      <div
        className="grid gap-1 rounded-2xl bg-[#e7f6ee] p-1 dark:bg-white/8"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const on = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(opt.id)}
              className={cn(
                "h-11 rounded-[14px] text-[15px] font-semibold transition active:scale-[0.99]",
                on
                  ? "bg-[#059669] text-white shadow-sm"
                  : "text-[#3d6b56] dark:text-emerald-50/80"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { history } = useAIHistory();
  const { queries } = useQueryHistory();
  const { locale, setLocale } = useLocale();
  const { theme, setTheme, mounted } = useTheme();
  const isHi = locale === "hi";
  const [busyLogout, setBusyLogout] = useState(false);

  const placeLine = [profile.village, profile.district, profile.state]
    .filter(Boolean)
    .join(" · ");
  const displayName = profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");

  const stats = [
    {
      href: "/select-crops",
      k: isHi ? "फसल" : "Crops",
      v: String(crops.length),
    },
    {
      href: "/ai-doctor",
      k: isHi ? "जाँच" : "Checks",
      v: String(history.length),
    },
    {
      href: "/my-queries",
      k: isHi ? "सवाल" : "Questions",
      v: String(queries.length),
    },
  ];

  const links = [
    {
      href: "/settings",
      icon: Settings2,
      label: isHi ? "सेटिंग्स" : "Settings",
    },
    {
      href: "/report-bug",
      icon: Bug,
      label: isHi ? "समस्या बताएँ" : "Report a problem",
    },
  ];

  return (
    <AppShell className="!bg-transparent" title={isHi ? "मेरी प्रोफ़ाइल" : "My profile"}>
      <div className="mx-auto max-w-lg space-y-4">
        <section className="rounded-[28px] border border-[#d5eadc] bg-[#f4fbf7] p-4 dark:border-white/10 dark:bg-[var(--av-surface)]">
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e7f6ee] text-[18px] font-bold text-[#0f6b45] dark:bg-emerald-400/15 dark:text-emerald-200">
              {initials(displayName)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="truncate font-display text-[20px] font-semibold leading-tight text-[#143028] dark:text-white">
                  {displayName}
                </h2>
                <AppLink
                  href="/profile/edit"
                  className="shrink-0 pt-0.5 text-[14px] font-semibold text-[#0f6b45] dark:text-emerald-300"
                >
                  {isHi ? "बदलें" : "Edit"}
                </AppLink>
              </div>
              {placeLine ? (
                <p className="mt-1 truncate text-[13px] text-[#3d6b56] dark:text-emerald-100/70">
                  {placeLine}
                </p>
              ) : null}
              {profile.phone ? (
                <p className="mt-0.5 text-[13px] text-[#3d6b56] dark:text-emerald-100/70">
                  +91 {profile.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#d7ebdf] bg-white dark:border-white/10 dark:bg-black/20">
            {stats.map((item, index) => (
              <AppLink
                key={item.href}
                href={item.href}
                className={cn(
                  "px-2 py-3 text-center active:bg-[#e7f6ee] dark:active:bg-white/5",
                  index > 0 && "border-l border-[#d7ebdf] dark:border-white/10"
                )}
              >
                <p className="text-[18px] font-semibold leading-none text-[#143028] dark:text-white">
                  {item.v}
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#3d6b56] dark:text-emerald-100/70">
                  {item.k}
                </p>
              </AppLink>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#d5eadc] bg-white p-4 dark:border-white/10 dark:bg-[var(--av-surface)]">
          <h2 className="text-[15px] font-semibold text-[#143028] dark:text-white">
            {isHi ? "मेरी फसलें" : "My crops"}
          </h2>
          {crops.length > 0 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {crops.map((crop) => {
                const label = isHi
                  ? getCropHindiName(crop.slug, crop.name) ?? crop.name
                  : crop.name;
                return (
                  <AppLink
                    key={crop.slug}
                    href={`/crops/${crop.slug}`}
                    className="flex min-w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-[#f4fbf7] px-3 py-3 dark:bg-white/5"
                  >
                    <span className="text-[22px] leading-none" aria-hidden>
                      {crop.emoji || getCropEmoji(crop.slug)}
                    </span>
                    <span className="max-w-[72px] truncate text-[12px] font-semibold text-[#143028] dark:text-white">
                      {label}
                    </span>
                  </AppLink>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#f4fbf7] px-3 py-3 dark:bg-white/5">
              <p className="flex items-center gap-2 text-[13px] text-[#3d6b56] dark:text-emerald-100/70">
                <Sprout className="h-4 w-4 text-[#059669]" />
                {isHi ? "अभी कोई फसल नहीं" : "No crop yet"}
              </p>
              <AppLink
                href="/select-crops"
                className="shrink-0 text-[14px] font-semibold text-[#0f6b45] dark:text-emerald-300"
              >
                {isHi ? "जोड़ें" : "Add"}
              </AppLink>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-[28px] border border-[#d5eadc] bg-white p-4 dark:border-white/10 dark:bg-[var(--av-surface)]">
          <Choice
            label={isHi ? "दिखावट" : "Theme"}
            value={mounted ? theme : "light"}
            onChange={(id) => setTheme(id as "light" | "dark")}
            options={[
              { id: "light", label: isHi ? "उजाला" : "Light" },
              { id: "dark", label: isHi ? "अँधेरा" : "Dark" },
            ]}
          />
          <Choice
            label={isHi ? "भाषा" : "Language"}
            value={locale}
            onChange={(id) => setLocale(id as AppLocale)}
            options={[
              { id: "hi", label: "हिंदी" },
              { id: "en", label: "English" },
            ]}
          />
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#d5eadc] bg-white dark:border-white/10 dark:bg-[var(--av-surface)]">
          {links.map((row, index) => (
            <AppLink
              key={row.href}
              href={row.href}
              className={cn(
                "flex min-h-14 items-center gap-3 px-4 active:bg-[#f4fbf7] dark:active:bg-white/5",
                index > 0 && "border-t border-[#e7f3ec] dark:border-white/10"
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f6ee] text-[#0f6b45] dark:bg-emerald-400/15 dark:text-emerald-200">
                <row.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-[#143028] dark:text-white">
                {row.label}
              </span>
              <ChevronRight className="h-4 w-4 text-[#5f8f74]" />
            </AppLink>
          ))}
        </section>

        <button
          type="button"
          disabled={busyLogout}
          onClick={async () => {
            if (busyLogout) return;
            setBusyLogout(true);
            try {
              await logoutAndReload();
            } catch {
              setBusyLogout(false);
            }
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-rose-700 active:bg-rose-50 disabled:opacity-50 dark:text-rose-300 dark:active:bg-rose-950/30"
        >
          <LogOut className="h-4 w-4" />
          {isHi ? "लॉग आउट" : "Log out"}
        </button>

        <p className="pb-2 text-center text-[11px] text-[#5f8f74] dark:text-emerald-100/50">
          {APP_NAME} · {APP_VERSION}
        </p>
      </div>
    </AppShell>
  );
}
