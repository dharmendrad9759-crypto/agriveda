"use client";

import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  User,
  MapPin,
  Phone,
  Save,
  Calendar,
} from "lucide-react";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect, useMemo } from "react";
import {
  getDistrictsForState,
  INDIAN_STATES,
  isValidDistrict,
  isValidState,
} from "@/lib/india-locations";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { track } from "@/lib/analytics";
import { useRouter } from "next/navigation";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "").slice(0, 10);
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

  useEffect(() => {
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

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
    showToast(isHi ? "प्रोफ़ाइल सेव हो गई ✓" : "Profile saved ✓");
    router.push("/profile");
  };

  return (
    <AppShell
      title={isHi ? "प्रोफ़ाइल संपादित करें" : "Edit profile"}
      subtitle={
        isHi
          ? "नाम, मोबाइल और जगह अपडेट करें"
          : "Update name, mobile and farm location"
      }
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: isHi ? "प्रोफ़ाइल" : "Profile", href: "/profile" },
        { label: isHi ? "एडिट" : "Edit" },
      ]}
      backHref="/profile"
    >
      <DarkCard className="!p-0 overflow-hidden">
        <div className="space-y-3.5 px-4 py-4">
          <label className="block">
            <span className={`mb-1.5 flex items-center gap-1.5 ${AV.label}`}>
              <User className="h-3.5 w-3.5" />
              {isHi ? "आपका नाम" : "Your name"}
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="av-input w-full"
              placeholder={isHi ? "जैसे: राम सिंह" : "e.g. Ram Singh"}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className={`mb-1.5 flex items-center gap-1.5 ${AV.label}`}>
              <Phone className="h-3.5 w-3.5" />
              {isHi ? "मोबाइल नंबर" : "Mobile number"}
            </span>
            <div className="flex overflow-hidden rounded-[var(--av-radius)] border border-[var(--av-border)] bg-[var(--av-surface)] focus-within:border-[var(--av-accent)] focus-within:ring-2 focus-within:ring-[var(--av-accent-ring)]">
              <span className="flex items-center border-r border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 text-sm font-semibold text-[var(--av-text-muted)]">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: digitsOnly(e.target.value) })}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-[var(--av-text-primary)] outline-none placeholder:text-[var(--av-text-muted)]"
                placeholder="98765 43210"
                autoComplete="tel"
                maxLength={10}
              />
            </div>
          </label>

          <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 p-3">
            <p className={`mb-2.5 flex items-center gap-1.5 ${AV.label}`}>
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              {isHi ? "खेत की जगह" : "Farm location"}
            </p>

            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-[var(--av-text-muted)]">
                {isHi ? "गाँव (वैकल्पिक)" : "Village (optional)"}
              </span>
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder={isHi ? "गाँव का नाम" : "Village name"}
                className="av-input w-full"
                autoComplete="address-level3"
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
            <p className={`mt-2 ${AV.micro}`}>
              {isHi
                ? "पहले राज्य चुनें, फिर ज़िला — मौसम और मंडी यहीं से मिलेंगे।"
                : "Pick state first, then district — weather & mandi use this."}
            </p>
          </div>

          <button type="button" onClick={handleSave} className={`w-full ${AV.btnPrimary}`}>
            <Save className="mr-2 inline h-4 w-4" />
            {isHi ? "सेव करें" : "Save"}
          </button>
        </div>
      </DarkCard>

      {crops.length > 0 && (
        <DarkCard className="mt-4" delay={1}>
          <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
            <Calendar className="h-4 w-4 text-[var(--av-accent)]" />
            {isHi ? "बुवाई की तारीख" : "Sowing dates"}
          </h2>
          <div className="mt-3 space-y-2">
            {crops.map((crop) => (
              <div
                key={crop.slug}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <span className="min-w-0 truncate text-sm font-semibold text-[var(--av-text-primary)]">
                  {crop.emoji} {crop.name}
                </span>
                <input
                  type="date"
                  value={profile.sowingDates[crop.slug] ?? ""}
                  onChange={(e) => setSowingDate(crop.slug, e.target.value)}
                  className="av-input max-w-[9.5rem] rounded-lg px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
          <p className={`mt-2 ${AV.micro}`}>
            {isHi
              ? "तारीख डालने पर फसल का सही स्टेज दिखेगा।"
              : "Dates unlock the right crop growth stage."}
          </p>
        </DarkCard>
      )}
    </AppShell>
  );
}
