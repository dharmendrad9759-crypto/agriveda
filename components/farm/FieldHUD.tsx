"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Save,
  MapPin,
  Info,
  ChevronRight,
} from "lucide-react";
import {
  LatLng,
  getFieldMeasurement,
  validateFieldPolygon,
} from "@/lib/geo/fieldGeometry";
import { cn } from "@/lib/cn";
import StatePlaceSheet from "@/components/farm/StatePlaceSheet";
import { fieldPlaceFor, matchStateName, type FieldPlace } from "@/lib/farm/placeProfile";
import { INDIAN_STATES } from "@/lib/india-locations";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

export type FieldViewCenter = {
  lat: number;
  lng: number;
  villageHint?: string;
};

interface FieldHUDProps {
  coords: LatLng[];
  viewCenter?: FieldViewCenter | null;
  onSave?: () => void;
  canSave?: boolean;
  place?: FieldPlace | null;
  onPlaceChange?: (place: FieldPlace) => void;
  className?: string;
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="px-2 py-1.5 text-center">
      <p className="text-[8.5px] font-medium uppercase tracking-wider text-[var(--av-text-muted)]">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-semibold leading-none tabular-nums text-[var(--av-text-primary)]">
        {value}
        {unit ? (
          <span className="ml-0.5 text-[8.5px] font-normal text-[var(--av-text-muted)]">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function cellKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

export default function FieldHUD({
  coords,
  viewCenter = null,
  onSave,
  canSave = true,
  place = null,
  onPlaceChange,
  className = "",
}: FieldHUDProps) {
  const { profile } = useFarmerProfile();
  const [placeOpen, setPlaceOpen] = useState(false);
  const [looking, setLooking] = useState(false);
  const lockedCell = useRef<string | null>(null);
  const onPlaceChangeRef = useRef(onPlaceChange);
  onPlaceChangeRef.current = onPlaceChange;

  const validation = useMemo(
    () => validateFieldPolygon(coords),
    [coords]
  );

  const center = useMemo(() => {
    if (coords.length >= 3) {
      const lat = coords.reduce((sum, point) => sum + point.lat, 0) / coords.length;
      const lng = coords.reduce((sum, point) => sum + point.lng, 0) / coords.length;
      const hintNear =
        viewCenter &&
        Math.abs(viewCenter.lat - lat) < 0.05 &&
        Math.abs(viewCenter.lng - lng) < 0.05
          ? viewCenter.villageHint
          : undefined;
      return { lat, lng, villageHint: hintNear };
    }
    return viewCenter;
  }, [coords, viewCenter]);

  useEffect(() => {
    if (!center) return;
    const here = cellKey(center.lat, center.lng);
    if (lockedCell.current === here) return;
    const lat = center.lat;
    const lng = center.lng;
    const villageHint = center.villageHint;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLooking(true);
      fetch(`/api/geo/reverse?lat=${lat}&lon=${lng}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { state?: string; district?: string; village?: string } | null) => {
          if (cancelled || lockedCell.current === here || !data?.state) return;
          onPlaceChangeRef.current?.(
            fieldPlaceFor(data.state, data.district, villageHint || data.village)
          );
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLooking(false);
        });
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [center]);

  const measurement = useMemo(() => {
    if (!validation.valid || coords.length < 3) return null;
    return getFieldMeasurement(
      coords,
      place && place.acresPerBigha > 0 ? place.acresPerBigha : undefined,
      place?.bighaLineHi,
      place?.climateHi
    );
  }, [coords, validation.valid, place]);

  const canSubmit = canSave && validation.valid && coords.length >= 3 && Boolean(place);

  const profileState = matchStateName(profile?.state || "", INDIAN_STATES);
  const hints = profileState
    ? [
        {
          label: "आपकी प्रोफ़ाइल",
          state: profileState,
          district: profile?.district || undefined,
        },
      ]
    : [];

  const placeTitle = place
    ? [place.village, place.district, place.stateHi].filter(Boolean).join(" · ")
    : looking
      ? "जगह देख रहे हैं"
      : "राज्य चुनें";
  const placeDetail = place
    ? [place.soil, place.climateHi].filter(Boolean).join(" · ")
    : looking
      ? "मिट्टी और जलवायु इसी जगह से लगेंगे"
      : "नक्शे पर जगह चुनें";

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {coords.length < 3 ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-700 dark:text-amber-300">
            <Info className="h-3 w-3 shrink-0" />
            {coords.length === 0
              ? "नक्शे पर खेत के कोने दबाएं"
              : `कम से कम 3 कोने चाहिए (${coords.length}/3)`}
          </span>
        ) : validation.valid ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            माप तैयार
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2 py-1 text-[10px] font-medium text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {validation.error || "सीमा रेखा अमान्य है"}
          </span>
        )}

      </div>

      <button
        type="button"
        onClick={() => setPlaceOpen(true)}
        className="mt-2.5 flex w-full items-center gap-2 rounded-xl border border-emerald-700/30 bg-emerald-500/10 px-3 py-2.5 text-left"
      >
        <MapPin className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-extrabold text-[var(--av-text-primary)]">
            {placeTitle}
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-[var(--av-text-secondary)]">
            {placeDetail}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
      </button>

      <div className="mt-2.5 grid grid-cols-4 divide-x divide-[var(--av-border-subtle)] rounded-xl bg-[var(--av-surface-inset)] py-1">
        <Stat
          label="एकड़"
          value={measurement ? measurement.acres.toFixed(2) : "0.00"}
        />
        <Stat
          label={place ? "बीघा" : "बीघा"}
          value={
            place && measurement?.bigha
              ? measurement.bigha.value.toFixed(2)
              : "—"
          }
          unit=""
        />
        <Stat
          label="हेक्टेयर"
          value={measurement ? measurement.hectares.toFixed(3) : "0.000"}
        />
        <Stat
          label="परिधि"
          value={measurement ? String(Math.round(measurement.perimeterMeters)) : "0"}
          unit="m"
        />
      </div>

      <div className="mt-2 flex items-center justify-end">
        {onSave ? (
          <button
            type="button"
            onClick={onSave}
            disabled={!canSubmit}
            className={cn(
              "inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-semibold shadow-sm transition active:scale-[0.99] sm:w-auto",
              canSubmit
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "cursor-not-allowed bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
            )}
          >
            <Save className="h-3.5 w-3.5" />
            खेत जोड़ें
          </button>
        ) : null}
      </div>

      <StatePlaceSheet
        open={placeOpen}
        onClose={() => setPlaceOpen(false)}
        hints={hints}
        onPick={(next) => {
          if (center) lockedCell.current = cellKey(center.lat, center.lng);
          onPlaceChange?.(next);
        }}
      />
    </div>
  );
}
