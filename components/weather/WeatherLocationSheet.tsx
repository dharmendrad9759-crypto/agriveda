"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { lookupPincode } from "@/lib/pincodeLookup";

interface Props {
  open: boolean;
  onClose: () => void;
  manualCity: string;
  onManualCityChange: (value: string) => void;
  onGps: () => void | Promise<void>;
  onCitySearch: (city: string) => void | Promise<void>;
  loading?: boolean;
  locLoading?: boolean;
}

export default function WeatherLocationSheet({
  open,
  onClose,
  manualCity,
  onManualCityChange,
  onGps,
  onCitySearch,
  loading,
  locLoading,
}: Props) {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const [pincode, setPincode] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const searchPincode = async () => {
    const pin = pincode.replace(/\D/g, "").slice(0, 6);
    if (pin.length !== 6) {
      setPinError(isHi ? "6 अंकों का पिनकोड लिखें" : "Enter 6-digit pincode");
      return;
    }
    setPinBusy(true);
    setPinError(null);
    try {
      const result = await lookupPincode(pin);
      if (!result?.district) {
        setPinError(isHi ? "पिनकोड नहीं मिला" : "Pincode not found");
        return;
      }
      onManualCityChange(result.district);
      await onCitySearch(result.district);
      onClose();
    } finally {
      setPinBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg animate-sheet-up">
        <div className="rounded-t-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] px-4 pb-8 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--av-border)]" />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--av-text-primary)]">
              {isHi ? "स्थान बदलें" : "Change location"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--av-border)] text-[var(--av-text-muted)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void onGps()}
              disabled={locLoading || loading}
              className="flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-left active:scale-[0.99] disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                {locLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5" />
                )}
              </span>
              <span>
                <span className="block text-[14px] font-bold text-[var(--av-text-primary)]">
                  {t("weatherMyLocation")}
                </span>
                <span className="block text-[12px] text-[var(--av-text-muted)]">
                  {isHi ? "GPS से सही जगह" : "Accurate GPS location"}
                </span>
              </span>
            </button>

            <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <p className="mb-2 text-[12px] font-bold text-[var(--av-text-muted)]">
                {isHi ? "शहर खोजें" : "Search city"}
              </p>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
                  <input
                    value={manualCity}
                    onChange={(e) => onManualCityChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && manualCity.trim()) {
                        void onCitySearch(manualCity.trim());
                        onClose();
                      }
                    }}
                    placeholder={t("weatherCityPlaceholder")}
                    className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-3 pl-10 pr-3 text-[14px] outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  disabled={loading || !manualCity.trim()}
                  onClick={() => {
                    void onCitySearch(manualCity.trim());
                    onClose();
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--av-accent)] text-white disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <p className="mb-2 text-[12px] font-bold text-[var(--av-text-muted)]">
                {isHi ? "पिनकोड खोजें" : "Search pincode"}
              </p>
              <div className="flex gap-2">
                <input
                  inputMode="numeric"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPinError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && void searchPincode()}
                  placeholder={isHi ? "6 अंक — जैसे 226001" : "6 digits — e.g. 226001"}
                  className="min-w-0 flex-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-3 text-[14px] outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  disabled={pinBusy || pincode.length !== 6}
                  onClick={() => void searchPincode()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] disabled:opacity-50"
                >
                  {pinBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>
              </div>
              {pinError ? <p className="mt-2 text-[11px] font-medium text-rose-600">{pinError}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
