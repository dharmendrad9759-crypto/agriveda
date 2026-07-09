"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useTheme } from "@/components/theme/ThemeProvider";
import { AV } from "@/lib/design/tokens";
import { Crown, ChevronRight, User, LogOut } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { APP_VERSION } from "@/lib/appMeta";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-[var(--av-accent)]" : "bg-[#374151]"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function SettingsRow({ label, value, href, toggle }: { label: string; value?: string; href?: string; toggle?: { on: boolean; onChange: (v: boolean) => void } }) {
  const inner = (
    <div className="flex min-h-[36px] items-center justify-between gap-3 py-2">
      <span className="text-sm text-[var(--av-text-primary)]">{label}</span>
      {toggle ? <Toggle on={toggle.on} onChange={toggle.onChange} /> : (
        <span className="flex items-center gap-1 text-xs text-[var(--av-text-muted)]">
          {value} {href && <ChevronRight className="h-4 w-4" />}
        </span>
      )}
    </div>
  );
  if (href) return <AppLink href={href} className="block border-b border-[var(--av-border)] last:border-0">{inner}</AppLink>;
  return <div className="border-b border-[var(--av-border)] last:border-0">{inner}</div>;
}

export default function SettingsPage() {
  const { profile } = useFarmerProfile();
  const { theme, setTheme } = useTheme();
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [pestAlerts, setPestAlerts] = useState(true);
  const [fertReminders, setFertReminders] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [twoFa, setTwoFa] = useState(false);

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your preferences, alerts, account and app settings"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DarkCard delay={0}>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--av-accent)]/20">
              <User className="h-8 w-8 text-[var(--av-accent)]" />
            </div>
            <h2 className="mt-3 text-base font-bold text-[var(--av-text-primary)]">{profile.name || "Deepak Chouhan"}</h2>
            <p className="text-xs text-[var(--av-text-muted)]">{profile.phone || "+91 6262 123 456"}</p>
            <AppLink href="/profile" className={`mt-4 flex w-full justify-center ${AV.btnSecondarySm}`}>
              Edit Profile
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Preferences</h3>
          <div className="mt-2">
            <SettingsRow label="Display Theme" value={theme === "dark" ? "Dark Mode" : "Light Mode"} href="/settings" />
            <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="mt-2 w-full rounded-lg bg-[var(--av-surface-inset)] py-2 text-xs text-[var(--av-accent)]">Toggle Theme</button>
            <SettingsRow label="App Language" value="English" />
            <SettingsRow label="Content Language" value="Hindi" />
            <SettingsRow label="Font Size" value="Medium" />
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Alerts & Notifications</h3>
          <div className="mt-2">
            <SettingsRow label="Weather Alerts" toggle={{ on: weatherAlerts, onChange: setWeatherAlerts }} />
            <SettingsRow label="Pest & Disease Alerts" toggle={{ on: pestAlerts, onChange: setPestAlerts }} />
            <SettingsRow label="Fertilizer Reminders" toggle={{ on: fertReminders, onChange: setFertReminders }} />
            <SettingsRow label="Market Price Alerts" toggle={{ on: priceAlerts, onChange: setPriceAlerts }} />
            <SettingsRow label="Quiet Hours" value="10:00 PM - 6:00 AM" />
          </div>
        </DarkCard>

        <DarkCard delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Units & Language</h3>
          <div className="mt-2">
            <SettingsRow label="Temperature" value="°C" />
            <SettingsRow label="Area Unit" value="Acre" />
            <SettingsRow label="Weight Unit" value="Quintal" />
          </div>
        </DarkCard>

        <DarkCard delay={4}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Location & Farm</h3>
          <div className="mt-2">
            <SettingsRow label="My Location" value={[profile.district, profile.state].filter(Boolean).join(", ") || "Sehore, MP"} href="/profile" />
            <SettingsRow label="Manage Farms" value="2 Farms Added" href="/my-farm" />
            <SettingsRow label="Default Farm" value="Main Farm (12.50 Acre)" />
          </div>
        </DarkCard>

        <DarkCard delay={5}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Account & Security</h3>
          <div className="mt-2">
            <SettingsRow label="Change Password" href="/profile" />
            <SettingsRow label="Two-Factor Auth" toggle={{ on: twoFa, onChange: setTwoFa }} />
            <AppLink href="/profile" className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <LogOut className="h-4 w-4" /> Logout
            </AppLink>
          </div>
        </DarkCard>

        <DarkCard delay={6}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Data & Sync</h3>
          <div className="mt-2">
            <SettingsRow label="Auto Sync" toggle={{ on: autoSync, onChange: setAutoSync }} />
            <SettingsRow label="Last Synced" value="07 May 2024, 09:30 AM" />
            <SettingsRow label="Clear Cache" value="45.2 MB" />
          </div>
        </DarkCard>

        <DarkCard delay={7}>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">AgriVeda Premium</h3>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">Active</span>
          </div>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">Valid till 15 June 2025</p>
          <ul className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
            {["Advanced AI Doctor", "Unlimited Alerts", "Expert Consultation", "Priority Support"].map((f) => (
              <li key={f} className="flex gap-2"><span className="text-[var(--av-accent)]">✓</span>{f}</li>
            ))}
          </ul>
          <AppLink href="/settings/upgrade" className={`mt-4 flex justify-center ${AV.btnPrimarySm}`}>
            Manage Subscription
          </AppLink>
        </DarkCard>

        <DarkCard delay={8}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">About {BRAND}</h3>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">v{APP_VERSION}</p>
          <p className="mt-1 text-xs text-[var(--av-text-secondary)]">Smart farming companion for Indian farmers.</p>
          <div className="mt-3 space-y-1">
            <SettingsRow label="Terms & Conditions" href="/profile" />
            <SettingsRow label="Privacy Policy" href="/profile" />
            <SettingsRow label="Rate Us on Play Store" href="/profile" />
          </div>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="Need Help?"
        description="Our support team is always here to help you."
        buttonLabel="Contact Support"
        href="/ask-query"
      />
    </AppShell>
  );
}
