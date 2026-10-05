"use client";

import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  User,
  MapPin,
  Phone,
  Save,
  Calendar,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect, useMemo, type ReactNode } from "react";
import {
  getDistrictsForState,
  INDIAN_STATES,
  isValidDistrict,
  isValidState,
} from "@/lib/india-locations";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "").slice(0, 10);
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="px-0.5">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700/70 dark:text-emerald-300/70">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">{title}</h2>
      </div>
      <div className="space-y-3.5 rounded-[1.35rem] border border-emerald-900/8 bg-[var(--av-surface)] px-3.5 py-4 shadow-[0_10px_28px_-18px_rgba(11,61,40,0.35)] dark:border-white/8">
        {children}
      </div>
    </section>
  );
}

function FieldLabel({ icon: Icon, children }: { icon: typeof User; children: ReactNode }) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export default function EditProfilePage() {
  const { profile, hydrated, saveProfile, setSowingDate } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const router = useRouter();

  const [form, setForm] = useState(profile);

  const districtOptions = useMemo(
    () => (isValidState(form.state) ? getDistrictsForState(form.state) : []),
    [form.state]
  );

  // Hydrate form once localStorage profile loads (client-only storage).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

  // Live preview + completion — same card language as Settings / Profile
  const previewName = form.name.trim() || profile.name.trim() || (isHi ? "किसान भाई" : "Kisan");
  const previewInitial = (previewName.trim().charAt(0) || "क").toUpperCase();
  const previewPlace = [form.village, form.district, form.state].filter(Boolean).join(" · ");
  const previewPhone = form.phone ? `+91 ${form.phone}` : t("settingsAddPhone");

  const completeness = useMemo(() => {
    const parts = [
      form.name.trim().length > 0,
      form.phone.length === 10,
      form.state.length > 0,
      form.district.length > 0,
      form.village.trim().length > 0,
    ];
    return Math.round((parts.filter(Boolean).length / parts.length) * 100);
  }, [form]);

  const handleSave = () => {
    const name = form.name.trim();
    const phone = digitsOnly(form.phone);
    if (!name) {
      showToast(isHi ? "अपना नाम लिखें" : "Please enter your name", "error");
      return;
    }
    if (phone && phone.length !== 10) {
      showToast(isHi ? "मोबाइल 10 अंकों का होना चाहिए" : "Mobile must be 10 digits", "error");
      return;
    }
    if (!form.state || !form.district) {
      showToast(
        isHi ? "राज्य और ज़िला चुनें — मौसम/मंडी इसी से चलते हैं" : "Select state & district",
        "error"
      );
      return;
    }

    const next = {
      ...form,
      name,
      village: form.village.trim(),
      phone,
    };
    setForm(next);
    saveProfile(next);
    track("profile_save", { hasPhone: Boolean(phone), state: next.state, district: next.district });
    showToast(isHi ? "प्रोफ़ाइल सहेज ली गई" : "Profile saved ✓");
    router.push("/profile");
  };

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "प्रोफ़ाइल बदलें" : "Edit profile"}
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: isHi ? "प्रोफ़ाइल" : "Profile", href: "/profile" },
        { label: isHi ? "बदलें" : "Edit" },
      ]}
      backHref="/profile"
    >
      <div className="mx-auto max-w-lg space-y-5">
        {/* Live preview — mirrors Settings account hero */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-emerald-950 text-white shadow-[0_18px_40px_-20px_rgba(6,78,59,0.7)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-amber-300/15 blur-3xl"
          />
          <div className="relative p-4 pb-3.5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 text-[1.65rem] font-black text-emerald-950 shadow-lg shadow-emerald-950/30 ring-2 ring-white/25">
                {previewInitial}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/80">
                  {isHi ? "ऐसे दिखेगा" : "Preview"}
                </p>
                <h2 className="mt-0.5 truncate font-display text-[1.35rem] font-bold leading-tight">
                  {previewName}
                </h2>
                <p className="mt-1 truncate text-[12px] font-medium text-emerald-100/80">
                  {previewPhone}
                  {previewPlace ? ` · ${previewPlace}` : ""}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-100/70">
                <span>{isHi ? "प्रोफ़ाइल पूरी" : "Profile complete"}</span>
                <span>{completeness}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-200 transition-all"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <Section eyebrow={isHi ? "पहचान" : "Identity"} title={isHi ? "नाम और मोबाइल" : "Name & mobile"}>
          <label className="block">
            <FieldLabel icon={User}>{isHi ? "आपका नाम" : "Your name"}</FieldLabel>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="av-input min-h-12 w-full text-[15px] font-semibold"
              placeholder={isHi ? "जैसे: राम सिंह" : "e.g. Ram Singh"}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <FieldLabel icon={Phone}>{isHi ? "मोबाइल नंबर" : "Mobile number"}</FieldLabel>
            <div className="flex overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <span className="flex items-center border-r border-[var(--av-border)] px-3 text-sm font-bold text-[var(--av-text-muted)]">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: digitsOnly(e.target.value) })}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-[15px] font-semibold text-[var(--av-text-primary)] outline-none placeholder:font-normal placeholder:text-[var(--av-text-muted)]"
                placeholder="98765 43210"
                autoComplete="tel"
                maxLength={10}
              />
              {form.phone.length === 10 ? (
                <span className="flex items-center pr-3 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          </label>
        </Section>

        <Section eyebrow={isHi ? "खेत" : "Farm"} title={isHi ? "खेत की जगह" : "Farm location"}>
          <div className="flex items-center gap-2 rounded-2xl bg-sky-500/10 px-3 py-2.5 text-[11px] font-semibold text-sky-900 dark:text-sky-200">
            <MapPin className="h-4 w-4 shrink-0" />
            {isHi
              ? "पहले राज्य चुनें, फिर ज़िला — मौसम और मंडी यहीं से मिलेंगे।"
              : "Pick state first, then district — weather & mandi use this."}
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-[var(--av-text-muted)]">
              {isHi ? "गाँव (वैकल्पिक)" : "Village (optional)"}
            </span>
            <input
              value={form.village}
              onChange={(e) => setForm({ ...form, village: e.target.value })}
              placeholder={isHi ? "गाँव का नाम" : "Village name"}
              className="av-input min-h-12 w-full text-[15px] font-semibold"
              autoComplete="address-level3"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <SearchableSelect
              key={`state-${form.state}`}
              label={isHi ? "राज्य *" : "State *"}
              placeholder={t("statePlaceholder")}
              value={form.state}
              onChange={(state) => {
                const district =
                  isValidState(state) && isValidDistrict(state, form.district)
                    ? form.district
                    : "";
                setForm({ ...form, state, district });
              }}
              options={INDIAN_STATES}
            />
            <SearchableSelect
              key={`district-${form.state}`}
              label={isHi ? "ज़िला *" : "District *"}
              placeholder={
                form.state ? t("districtPlaceholder") : t("districtSelectStateFirst")
              }
              value={form.district}
              onChange={(district) => setForm({ ...form, district })}
              options={districtOptions}
              disabled={!isValidState(form.state)}
            />
          </div>
        </Section>

        {crops.length > 0 && (
          <Section
            eyebrow={isHi ? "फसल" : "Crop"}
            title={isHi ? "बुवाई की तारीख" : "Sowing dates"}
          >
            <div className="space-y-2">
              {crops.map((crop) => (
                <div
                  key={crop.slug}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate text-sm font-bold text-[var(--av-text-primary)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                      {crop.emoji || "🌱"}
                    </span>
                    <span className="truncate">{crop.name}</span>
                  </span>
                  <input
                    type="date"
                    value={profile.sowingDates[crop.slug] ?? ""}
                    onChange={(e) => setSowingDate(crop.slug, e.target.value)}
                    className="av-input max-w-[9.5rem] shrink-0 rounded-xl px-2 py-2 text-xs"
                    aria-label={`${crop.name} sowing date`}
                  />
                </div>
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--av-text-muted)]">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              {isHi
                ? "तारीख डालने पर फसल का सही स्टेज दिखेगा।"
                : "Dates unlock the right crop growth stage."}
            </p>
          </Section>
        )}

        <div className="space-y-2 pb-2">
          <button type="button" onClick={handleSave} className="av-btn av-btn-primary w-full min-h-12 text-[15px]">
            <Save className="mr-2 inline h-4 w-4" />
            {isHi ? "सहेजें" : "Save"}
          </button>
          <AppLink
            href="/profile"
            className="av-btn av-btn-secondary flex w-full items-center justify-center text-[13px]"
          >
            {isHi ? "रद्द करें" : "Cancel"}
          </AppLink>
          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[10px] font-medium text-[var(--av-text-muted)]">
            <Sprout className="h-3 w-3 text-emerald-600" />
            {isHi ? "सहेजते ही प्रोफ़ाइल पर दिखेगा" : "Shows on your profile right after saving"}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
