"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Check,
  MapPin,
  Sprout,
  CalendarDays,
  Droplets,
  Mountain,
  FileText,
  Info,
} from "lucide-react";
import {
  LatLng,
  coordsToGeoJsonPolygon,
  calculateGeodesicArea,
  calculateGeodesicPerimeter,
  getPolygonCenter,
  ACRE_TO_SQ_METERS,
  HECTARE_TO_SQ_METERS,
} from "@/lib/geo/fieldGeometry";
import { FarmField } from "@/lib/farm/types";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import FarmSheet from "@/components/farm/FarmSheet";
import { cn } from "@/lib/cn";
import { sortCropsByCurrentSeason } from "@/lib/crops/seasonalCropEngine";

interface SaveFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  coords: LatLng[];
  bighaDisplay?: string;
  initialData?: Partial<FarmField>;
  onSave: (fieldData: Omit<FarmField, "id">) => void;
}

interface CropOption {
  slug: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  popularVarieties: string[];
}

const CROPS_CATALOG: CropOption[] = [
  {
    slug: "wheat",
    nameHi: "गेहूँ",
    nameEn: "Wheat",
    emoji: "🌾",
    popularVarieties: ["DBW 187", "HD 2967", "HD 3086", "DBW 222", "PBW 373"],
  },
  {
    slug: "paddy",
    nameHi: "धान",
    nameEn: "Paddy",
    emoji: "🌾",
    popularVarieties: ["पूसा 1121", "पूसा 1509", "PR 126", "सरबती", "IR 64"],
  },
  {
    slug: "mustard",
    nameHi: "सरसों",
    nameEn: "Mustard",
    emoji: "🌼",
    popularVarieties: ["पूसा मस्टर्ड 25", "गिरिराज", "RH 725", "वरुणा"],
  },
  {
    slug: "potato",
    nameHi: "आलू",
    nameEn: "Potato",
    emoji: "🥔",
    popularVarieties: ["कुफरी ख्याति", "कुफरी पुखराज", "कुफरी बहार", "कुफरी ज्योति"],
  },
  {
    slug: "tomato",
    nameHi: "टमाटर",
    nameEn: "Tomato",
    emoji: "🍅",
    popularVarieties: ["अभिनव", "साहो 3251", "हिमसोना", "आर्यमान"],
  },
  {
    slug: "maize",
    nameHi: "मक्का",
    nameEn: "Maize",
    emoji: "🌽",
    popularVarieties: ["पायनियर 3396", "डीकेसी 9108", "गंगा 11", "सरताज"],
  },
  {
    slug: "sugarcane",
    nameHi: "गन्ना",
    nameEn: "Sugarcane",
    emoji: "🎋",
    popularVarieties: ["Co 0238", "Co 0118", "Co 15023", "CoLk 94184"],
  },
  {
    slug: "cotton",
    nameHi: "कपास",
    nameEn: "Cotton",
    emoji: "☁️",
    popularVarieties: ["रासी 659", "अंकुर 3028", "कावेरी जादू", "अजीत 155"],
  },
  {
    slug: "chana",
    nameHi: "चना",
    nameEn: "Gram",
    emoji: "🌿",
    popularVarieties: ["पूसा 372", "जेजी 11", "जाकी 9218", "पूसा 362"],
  },
  {
    slug: "soybean",
    nameHi: "सोयाबीन",
    nameEn: "Soybean",
    emoji: "🌱",
    popularVarieties: ["JS 20-34", "JS 95-60", "JS 20-29", "NRC 37"],
  },
  {
    slug: "onion",
    nameHi: "प्याज",
    nameEn: "Onion",
    emoji: "🧅",
    popularVarieties: ["एग्रीफाउंड डार्क रेड", "भीमा सुपर", "पुणे फुरसुंगी"],
  },
  {
    slug: "chilli",
    nameHi: "मिर्च",
    nameEn: "Chilli",
    emoji: "🌶️",
    popularVarieties: ["वीएनआर 332", "तेजा 4", "आर्मर", "सितारा"],
  },
];

const IRRIGATION_OPTIONS = [
  { value: "Tubewell / बोरवेल", label: "बोरवेल / ट्यूबवेल" },
  { value: "Canal / नहर", label: "नहर (Canal)" },
  { value: "Drip / टपक सिंचाई", label: "ड्रिप सिंचाई" },
  { value: "Sprinkler / फव्वारा", label: "फव्वारा (Sprinkler)" },
  { value: "Rainfed / वर्षा-आधारित", label: "वर्षा-आधारित (बारानी)" },
];

const SOIL_OPTIONS = [
  "दोमट मिट्टी (Loam)",
  "काली मिट्टी (Black)",
  "जलोढ़ मिट्टी (Alluvial)",
  "बलुई दोमट (Sandy Loam)",
  "चिकनी मिट्टी (Clay)",
];

function resolveCrop(initialData?: Partial<FarmField>): CropOption {
  const bySlug = initialData?.cropSlug
    ? CROPS_CATALOG.find((crop) => crop.slug === initialData.cropSlug)
    : undefined;
  if (bySlug) return bySlug;

  const name = (initialData?.crop || "").toLowerCase();
  const byName = CROPS_CATALOG.find(
    (crop) =>
      name.includes(crop.nameHi) || name.includes(crop.nameEn.toLowerCase())
  );
  return byName ?? sortCropsByCurrentSeason(CROPS_CATALOG)[0];
}

function toDateInput(value?: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export default function SaveFieldModal({
  isOpen,
  onClose,
  coords,
  bighaDisplay,
  initialData,
  onSave,
}: SaveFieldModalProps) {
  const { profile } = useFarmerProfile();

  const sqMeters = calculateGeodesicArea(coords);
  const acres = sqMeters / ACRE_TO_SQ_METERS;
  const hectares = sqMeters / HECTARE_TO_SQ_METERS;
  const perimeter = calculateGeodesicPerimeter(coords);

  const seasonalCrops = useMemo(() => sortCropsByCurrentSeason(CROPS_CATALOG), []);
  const initialCrop = useMemo(() => resolveCrop(initialData), [initialData]);

  const [name, setName] = useState(initialData?.name || "मेरा खेत 1");
  const [village, setVillage] = useState(
    initialData?.village || profile?.village || profile?.district || "मेरा गांव"
  );
  const [farmerName, setFarmerName] = useState(
    initialData?.farmerName || profile?.name || ""
  );
  const [selectedCropSlug, setSelectedCropSlug] = useState(initialCrop.slug);
  const [variety, setVariety] = useState(
    initialData?.variety || initialCrop.popularVarieties[0] || ""
  );
  const [customVariety, setCustomVariety] = useState("");
  const [sowingDate, setSowingDate] = useState(() =>
    toDateInput(initialData?.sowingDateIso || initialData?.sowingDate)
  );
  const [irrigationType, setIrrigationType] = useState(
    initialData?.irrigationType || IRRIGATION_OPTIONS[0].value
  );
  const [soilType, setSoilType] = useState(
    initialData?.soilType || SOIL_OPTIONS[0]
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);

  // Re-seed on every open and when async "edit field" data arrives with an id.
  const seedKey = isOpen ? initialData?.id ?? "new" : "";
  const seededFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      seededFor.current = null;
      return;
    }
    if (seededFor.current === seedKey) return;
    seededFor.current = seedKey;

    const crop = resolveCrop(initialData);
    const initialVariety = initialData?.variety || "";
    const isKnownVariety = crop.popularVarieties.includes(initialVariety);

    setName(initialData?.name || "मेरा खेत 1");
    setVillage(
      initialData?.village || profile?.village || profile?.district || "मेरा गांव"
    );
    setFarmerName(initialData?.farmerName || profile?.name || "");
    setSelectedCropSlug(crop.slug);
    setVariety(isKnownVariety ? initialVariety : crop.popularVarieties[0] || "");
    setCustomVariety(
      initialVariety && !isKnownVariety ? initialVariety : ""
    );
    setSowingDate(
      toDateInput(initialData?.sowingDateIso || initialData?.sowingDate) ||
        daysAgoISO(22)
    );
    setIrrigationType(initialData?.irrigationType || IRRIGATION_OPTIONS[0].value);
    setSoilType(initialData?.soilType || SOIL_OPTIONS[0]);
    setNotes(initialData?.notes || "");
    setError(null);
  }, [
    isOpen,
    seedKey,
    initialData,
    profile?.village,
    profile?.district,
    profile?.name,
  ]);

  const activeCropObj = useMemo(
    () =>
      CROPS_CATALOG.find((crop) => crop.slug === selectedCropSlug) ||
      CROPS_CATALOG[0],
    [selectedCropSlug]
  );

  const handleApplySowingPreset = (daysAgo: number) => {
    setSowingDate(daysAgoISO(daysAgo));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("कृपया खेत का नाम दर्ज करें");
      return;
    }

    const isPolygon = coords.length >= 3;
    const geoJson = isPolygon ? coordsToGeoJsonPolygon(coords) : undefined;
    const centerPoint = coords.length > 0 ? getPolygonCenter(coords) : undefined;
    const finalVariety = customVariety.trim() || variety;

    onSave({
      name: name.trim(),
      village: village.trim() || "मेरा गांव",
      farmerName: farmerName.trim() || undefined,
      crop: activeCropObj.nameHi,
      cropSlug: activeCropObj.slug,
      variety: finalVariety || undefined,
      area: isPolygon
        ? `${acres.toFixed(2)} एकड़`
        : initialData?.area || "लोकेशन सहेजी गई",
      areaAcres: isPolygon
        ? Math.round(acres * 100) / 100
        : initialData?.areaAcres,
      areaHectares: isPolygon
        ? Math.round(hectares * 1000) / 1000
        : initialData?.areaHectares,
      areaSqMeters: isPolygon
        ? Math.round(sqMeters)
        : initialData?.areaSqMeters,
      perimeterMeters: isPolygon
        ? Math.round(perimeter)
        : initialData?.perimeterMeters,
      bighaDisplay: isPolygon
        ? bighaDisplay || initialData?.bighaDisplay
        : initialData?.bighaDisplay,
      ownership: initialData?.ownership || "Owned",
      emoji: activeCropObj.emoji,
      stage: initialData?.stage || "सक्रिय",
      status: initialData?.status || "Active",
      boundary: isPolygon ? coords : initialData?.boundary,
      geoJson: isPolygon ? geoJson : initialData?.geoJson,
      location: centerPoint || initialData?.location,
      isLocationOnly: !isPolygon,
      measurementMethod: isPolygon
        ? initialData?.measurementMethod || "manual_map"
        : initialData?.measurementMethod || "manual_entry",
      sowingDate,
      sowingDateIso: sowingDate
        ? new Date(sowingDate).toISOString()
        : initialData?.sowingDateIso,
      irrigationType,
      soilType,
      notes: notes.trim() || undefined,
      createdAt: initialData?.createdAt,
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <FarmSheet
      open={isOpen}
      onClose={onClose}
      title={initialData?.id ? "खेत विवरण संशोधित करें" : "खेत सहेजें"}
      subtitle="उपग्रह सीमा, रकबा और फसल चक्र सक्रिय करें"
      icon={<MapPin className="h-4 w-4" />}
      size="lg"
      level={10000}
    >
      <div className="mb-3.5 grid grid-cols-3 divide-x divide-[var(--av-border-subtle)] rounded-2xl bg-[var(--av-surface-inset)] py-2.5 text-center">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--av-text-muted)]">
            रकबा
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--av-text-primary)]">
            {acres.toFixed(2)} <span className="text-[9px]">एकड़</span>
          </p>
          {bighaDisplay ? (
            <p className="mt-0.5 text-[9px] text-amber-700 dark:text-amber-300">
              {bighaDisplay}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--av-text-muted)]">
            हेक्टेयर
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--av-text-primary)]">
            {hectares.toFixed(3)}
          </p>
          <p className="mt-0.5 text-[9px] text-[var(--av-text-muted)]">
            {Math.round(sqMeters).toLocaleString("en-IN")} m²
          </p>
        </div>
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--av-text-muted)]">
            परिधि
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--av-text-primary)]">
            {Math.round(perimeter)} m
          </p>
          <p className="mt-0.5 text-[9px] text-[var(--av-text-muted)]">
            {coords.length} कोने
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-2.5 text-[11px] font-medium text-rose-700 dark:text-rose-300">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
              खेत का नाम <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="उदा. उत्तर वाला खेत"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-xs font-medium text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
              गांव / कस्बा
            </label>
            <input
              type="text"
              placeholder="उदा. नगला बीच"
              value={village}
              onChange={(event) => setVillage(event.target.value)}
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label className="flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
              <Sprout className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              मुख्य फसल
            </label>
            <span className="text-[10px] text-[var(--av-text-muted)]">
              {activeCropObj.emoji} {activeCropObj.nameHi}
            </span>
          </div>

          <div className="grid max-h-40 grid-cols-4 gap-1.5 overflow-y-auto rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-1.5 sm:grid-cols-6">
            {seasonalCrops.map((crop) => {
              const selected = crop.slug === selectedCropSlug;
              return (
                <button
                  key={crop.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCropSlug(crop.slug);
                    setVariety(crop.popularVarieties[0] || "");
                    setCustomVariety("");
                  }}
                  className={cn(
                    "rounded-xl px-1 py-2 text-center transition active:scale-95",
                    selected
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
                  )}
                >
                  <span className="block text-base leading-none" aria-hidden>
                    {crop.emoji}
                  </span>
                  <span className="mt-1 block truncate text-[10px] font-medium">
                    {crop.nameHi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
            बीज किस्म
          </label>
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {activeCropObj.popularVarieties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setVariety(item);
                  setCustomVariety("");
                }}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[10.5px] font-medium transition",
                  variety === item && !customVariety
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="या अपनी किस्म लिखें…"
            value={customVariety}
            onChange={(event) => setCustomVariety(event.target.value)}
            className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label className="flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
              <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              बुवाई की तारीख
            </label>
            <span className="text-[10px] text-[var(--av-text-muted)]">
              {sowingDate}
            </span>
          </div>

          <div className="mb-2 grid grid-cols-4 gap-1.5">
            {[
              { days: 0, label: "आज" },
              { days: 10, label: "10 दिन" },
              { days: 21, label: "21 दिन" },
              { days: 35, label: "35 दिन" },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handleApplySowingPreset(preset.days)}
                className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-1.5 text-[10px] font-medium text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)]"
              >
                {preset.label} पहले
              </button>
            ))}
          </div>

          <input
            type="date"
            value={sowingDate}
            onChange={(event) => setSowingDate(event.target.value)}
            className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs font-medium text-[var(--av-text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
              <Droplets className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
              सिंचाई व्यवस्था
            </label>
            <select
              value={irrigationType}
              onChange={(event) => setIrrigationType(event.target.value)}
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
            >
              {IRRIGATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
              <Mountain className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
              मिट्टी का प्रकार
            </label>
            <select
              value={soilType}
              onChange={(event) => setSoilType(event.target.value)}
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
            >
              {SOIL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
            <FileText className="h-3.5 w-3.5 text-[var(--av-text-muted)]" />
            नोट्स
          </label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="खेत, मिट्टी या सिंचाई से जुड़ी कोई खास बात…"
            rows={2}
            className="w-full resize-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex gap-2 border-t border-[var(--av-border-subtle)] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
          >
            रद्द करें
          </button>
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
          >
            <Check className="h-4 w-4" />
            {initialData?.id ? "बदलाव सहेजें" : "खेत सक्रिय करें"}
          </button>
        </div>
      </form>
    </FarmSheet>
  );
}
