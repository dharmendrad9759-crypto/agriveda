"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Save,
  Layers,
  Info,
} from "lucide-react";
import {
  LatLng,
  getFieldMeasurement,
  validateFieldPolygon,
} from "@/lib/geo/fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS } from "@/lib/bighaConversion";
import { cn } from "@/lib/cn";

interface FieldHUDProps {
  coords: LatLng[];
  onSave?: () => void;
  canSave?: boolean;
  selectedBighaId?: string;
  onBighaIdChange?: (id: string) => void;
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

export default function FieldHUD({
  coords,
  onSave,
  canSave = true,
  selectedBighaId = "up",
  onBighaIdChange,
  className = "",
}: FieldHUDProps) {
  const [bighaId, setBighaId] = useState(selectedBighaId);

  const selectedBigha = useMemo(() => {
    return (
      REGIONAL_BIGHA_OPTIONS.find(
        (option) =>
          option.id === (onBighaIdChange ? selectedBighaId : bighaId)
      ) || REGIONAL_BIGHA_OPTIONS[0]
    );
  }, [bighaId, selectedBighaId, onBighaIdChange]);

  const validation = useMemo(
    () => validateFieldPolygon(coords),
    [coords]
  );

  const measurement = useMemo(() => {
    if (!validation.valid || coords.length < 3) return null;
    return getFieldMeasurement(
      coords,
      selectedBigha.acresPerBigha,
      selectedBigha.label,
      selectedBigha.note
    );
  }, [coords, validation.valid, selectedBigha]);

  const handleBighaChange = (newId: string) => {
    setBighaId(newId);
    onBighaIdChange?.(newId);
  };

  const canSubmit = canSave && validation.valid && coords.length >= 3;

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
            सटीक माप तैयार · {coords.length} कोने
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2 py-1 text-[10px] font-medium text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {validation.error || "सीमा रेखा अमान्य है"}
          </span>
        )}

        <label className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-1 text-[10px] text-[var(--av-text-secondary)]">
          <Layers className="h-3 w-3 text-emerald-600 dark:text-emerald-300" />
          <span className="sr-only">क्षेत्रीय बीघा मानक</span>
          <select
            value={onBighaIdChange ? selectedBighaId : bighaId}
            onChange={(event) => handleBighaChange(event.target.value)}
            className="max-w-[7.5rem] cursor-pointer bg-transparent text-[10px] font-medium text-[var(--av-text-secondary)] outline-none"
          >
            {REGIONAL_BIGHA_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.state} · {option.acresPerBigha} एकड़
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-2.5 grid grid-cols-4 divide-x divide-[var(--av-border-subtle)] rounded-xl bg-[var(--av-surface-inset)] py-1">
        <Stat
          label="एकड़"
          value={measurement ? measurement.acres.toFixed(2) : "0.00"}
        />
        <Stat
          label={selectedBigha.state}
          value={
            measurement?.bigha ? measurement.bigha.value.toFixed(2) : "0.00"
          }
          unit="बीघा"
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

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[9.5px] leading-snug text-[var(--av-text-muted)]">
          WGS84 उपग्रह आधारित अनुमानित माप — कानूनी सर्वेक्षण के लिए मान्य नहीं।
        </p>

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
            खेत सहेजें
          </button>
        ) : null}
      </div>
    </div>
  );
}
