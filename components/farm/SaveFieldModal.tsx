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
  Plus,
  Ruler,
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
import { resolveCropImage } from "@/lib/crops/cropImages";
import { suggestFieldName } from "@/lib/farm/fieldName";
import {
  FARM_SOIL_OPTIONS,
  matchFarmSoil,
  soilForPlace,
} from "@/lib/farm/placeProfile";

interface SaveFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  coords: LatLng[];
  bighaDisplay?: string;
  placeVillage?: string;
  placeSoil?: string;
  climateNote?: string;
  placeState?: string;
  placeDistrict?: string;
  initialData?: Partial<FarmField>;
  existingFields?: Pick<FarmField, "name">[];
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

function listedOrCustomSoil(value?: string): { listed: string; custom: string } {
  const raw = (value || "").trim();
  if (!raw) return { listed: "", custom: "" };
  const listed = matchFarmSoil(raw);
  if (listed) return { listed, custom: "" };
  return { listed: "", custom: raw };
}

function geoSoilHint(args: {
  placeSoil?: string;
  placeState?: string;
  placeDistrict?: string;
  profileState?: string;
  profileDistrict?: string;
}): string {
  return (
    matchFarmSoil(args.placeSoil) ||
    matchFarmSoil(soilForPlace(args.placeState, args.placeDistrict)) ||
    matchFarmSoil(soilForPlace(args.profileState, args.profileDistrict))
  );
}

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
  placeVillage,
  placeSoil,
  climateNote,
  placeState,
  placeDistrict,
  initialData,
  existingFields = [],
  onSave,
}: SaveFieldModalProps) {
  const { profile } = useFarmerProfile();

  const sqMeters = calculateGeodesicArea(coords);
  const acres = sqMeters / ACRE_TO_SQ_METERS;
  const hectares = sqMeters / HECTARE_TO_SQ_METERS;
  const perimeter = calculateGeodesicPerimeter(coords);

  const seasonalCrops = useMemo(() => sortCropsByCurrentSeason(CROPS_CATALOG), []);
  const initialCrop = useMemo(() => resolveCrop(initialData), [initialData]);

  const villageFromPlace = (placeVillage || "").trim();
  const villageEdited = useRef(false);
  const mapCenterKey = useMemo(() => {
    if (coords.length === 0) return "";
    const center = getPolygonCenter(coords);
    return `${center.lat.toFixed(4)},${center.lng.toFixed(4)}`;
  }, [coords]);
  const [name, setName] = useState(
    initialData?.name ||
      suggestFieldName({
        existing: existingFields,
        cropHi: initialCrop.nameHi,
        village: initialData?.village || villageFromPlace || profile?.village,
      })
  );
  const [village, setVillage] = useState(
    initialData?.village || villageFromPlace || ""
  );
  const [villageLooking, setVillageLooking] = useState(false);
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
    listedOrCustomSoil(initialData?.soilType).listed ||
      listedOrCustomSoil(initialData?.soilType).custom ||
      geoSoilHint({
        placeSoil,
        placeState,
        placeDistrict,
        profileState: profile?.state,
        profileDistrict: profile?.district,
      })
  );
  const [customSoil, setCustomSoil] = useState(
    listedOrCustomSoil(initialData?.soilType).custom
  );
  const [showCustomSoil, setShowCustomSoil] = useState(
    Boolean(listedOrCustomSoil(initialData?.soilType).custom)
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const soilTouched = useRef(Boolean(initialData?.soilType));

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
    villageEdited.current = Boolean(initialData?.village);
    soilTouched.current = Boolean(initialData?.soilType);

    const crop = resolveCrop(initialData);
    const initialVariety = initialData?.variety || "";
    const isKnownVariety = crop.popularVarieties.includes(initialVariety);
    const fromPlace = (placeVillage || placeDistrict || "").trim();

    setName(
      initialData?.name ||
        suggestFieldName({
          existing: existingFields,
          cropHi: crop.nameHi,
          village: initialData?.village || fromPlace || profile?.village,
        })
    );
    setVillage(initialData?.village || fromPlace);
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
    const seededSoil = listedOrCustomSoil(initialData?.soilType);
    const suggested = geoSoilHint({
      placeSoil,
      placeState,
      placeDistrict,
      profileState: profile?.state,
      profileDistrict: profile?.district,
    });
    setSoilType(seededSoil.listed || suggested);
    setCustomSoil(seededSoil.custom);
    setShowCustomSoil(Boolean(seededSoil.custom));
    setNotes(initialData?.notes || "");
    setError(null);
  }, [
    isOpen,
    seedKey,
    initialData,
    profile?.village,
    profile?.district,
    profile?.name,
    profile?.state,
    placeSoil,
    placeVillage,
    placeState,
    placeDistrict,
    existingFields,
  ]);

  useEffect(() => {
    if (!isOpen) {
      villageEdited.current = false;
      setVillageLooking(false);
      return;
    }

    const fromVillage = (placeVillage || "").trim();
    const fromDistrict = (placeDistrict || "").trim();
    if (!villageEdited.current) {
      if (fromVillage) {
        setVillage(fromVillage);
        setVillageLooking(false);
      } else if (fromDistrict) {
        setVillage((current) => current || fromDistrict);
      }
    }

    if (!mapCenterKey) return;
    const [lat, lon] = mapCenterKey.split(",");

    let cancelled = false;
    setVillageLooking(true);
    fetch(`/api/geo/reverse?lat=${lat}&lon=${lon}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: { village?: string; district?: string; state?: string } | null
        ) => {
          if (cancelled) return;
          if (!villageEdited.current) {
            const next = (data?.village || data?.district || fromDistrict || "").trim();
            if (next) setVillage(next);
          }
          if (!soilTouched.current) {
            const fromMap = matchFarmSoil(
              soilForPlace(data?.state, data?.district)
            );
            if (fromMap) {
              setSoilType(fromMap);
              setShowCustomSoil(false);
              setCustomSoil("");
            }
          }
        }
      )
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setVillageLooking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, placeVillage, placeDistrict, mapCenterKey]);

  useEffect(() => {
    if (!isOpen || soilTouched.current) return;
    const suggested = geoSoilHint({
      placeSoil,
      placeState,
      placeDistrict,
      profileState: profile?.state,
      profileDistrict: profile?.district,
    });
    if (!suggested) return;
    setSoilType((current) => current || suggested);
  }, [
    isOpen,
    placeSoil,
    placeState,
    placeDistrict,
    profile?.state,
    profile?.district,
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
    const finalSoil = showCustomSoil
      ? customSoil.trim() || soilType
      : soilType || customSoil.trim();
    if (!finalSoil) {
      setError("मिट्टी चुनें, या अपनी मिट्टी लिखें");
      return;
    }

    const isPolygon = coords.length >= 3;
    const geoJson = isPolygon ? coordsToGeoJsonPolygon(coords) : undefined;
    const centerPoint = coords.length > 0 ? getPolygonCenter(coords) : undefined;
    const finalVariety = customVariety.trim() || variety;
    const villageName =
      village.trim() || placeVillage?.trim() || placeDistrict?.trim() || "";
    const fieldName =
      (initialData?.name || "").trim() ||
      suggestFieldName({
        existing: existingFields,
        cropHi: activeCropObj.nameHi,
        village: villageName,
      });

    onSave({
      name: fieldName,
      village: villageName,
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
        ? sowingDate.slice(0, 10)
        : initialData?.sowingDateIso,
      irrigationType,
      soilType: finalSoil,
      placeState: placeState || initialData?.placeState,
      placeDistrict: placeDistrict || initialData?.placeDistrict,
      climateNote: climateNote || initialData?.climateNote,
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
      title={initialData?.id ? "खेत विवरण संशोधित करें" : "खेत जोड़ें"}
      subtitle="नापा रकबा, फसल और किस्म सहेजें"
      icon={<Ruler className="h-5 w-5" />}
      size="lg"
      level={10000}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="av-btn av-btn-secondary min-h-12 flex-1 rounded-2xl text-[14px]"
          >
            रद्द करें
          </button>
          <button
            type="submit"
            form="save-field-form"
            className="av-btn av-btn-primary min-h-12 flex-[1.35] rounded-2xl text-[14px] shadow-[0_10px_24px_-10px_rgba(5,150,105,0.7)]"
          >
            <Check className="h-4 w-4" />
            {initialData?.id ? "बदलाव सहेजें" : "खेत जोड़ें"}
          </button>
        </div>
      }
    >
      <div className="relative mb-4 overflow-hidden rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-[#063224] via-[#0a4a32] to-[#0f3d36] p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-300/15 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-emerald-200/85">
              नापा गया रकबा
            </p>
            <p className="mt-1 flex items-end gap-2">
              <span className="font-av-serif text-[2.35rem] font-bold leading-none tabular-nums tracking-tight">
                {acres.toFixed(2)}
              </span>
              <span className="mb-1 text-[15px] font-semibold text-emerald-50/90">
                एकड़
              </span>
            </p>
            {bighaDisplay ? (
              <p className="mt-1.5 text-[12px] font-medium text-amber-200/90">
                {bighaDisplay}
              </p>
            ) : null}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-100">
            <Ruler className="h-5 w-5" />
          </span>
        </div>
        <div className="relative mt-3.5 grid grid-cols-3 gap-2">
          {[
            { label: "हेक्टेयर", value: hectares.toFixed(3) },
            {
              label: "क्षेत्र",
              value: `${Math.round(sqMeters).toLocaleString("en-IN")} m²`,
            },
            { label: "परिधि", value: `${Math.round(perimeter)} m` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-black/20 px-2.5 py-2 ring-1 ring-white/10"
            >
              <p className="text-[11px] font-medium text-emerald-100/70">{stat.label}</p>
              <p className="mt-0.5 text-[13px] font-semibold tabular-nums tracking-tight text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <p className="relative mt-2.5 text-[12px] font-medium text-emerald-100/75">
          {coords.length} बिंदु नापे गए
        </p>
      </div>

      {error ? (
        <div className="mb-3 flex items-start gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-[13px] font-medium text-rose-700 dark:text-rose-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <form id="save-field-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
            गांव / कस्बा
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700 dark:text-emerald-300" />
            <input
              type="text"
              placeholder={
                villageLooking ? "लोकेशन से गांव आ रहा है…" : "उदा. नगला बीच"
              }
              value={village}
              onChange={(event) => {
                villageEdited.current = true;
                setVillage(event.target.value);
              }}
              className="av-input min-h-11 rounded-2xl bg-[var(--av-surface)] pl-10 text-[14px] font-medium"
            />
          </div>
          {villageLooking && !village ? (
            <p className="mt-1.5 text-[12px] font-medium text-[var(--av-text-muted)]">
              नक्शे की जगह से गांव भर रहे हैं
            </p>
          ) : village && !villageEdited.current ? (
            <p className="mt-1.5 inline-flex rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-800 dark:text-emerald-200">
              लोकेशन से भरा गया
            </p>
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
              <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              मुख्य फसल
            </label>
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--av-text-primary)]">
              <span className="relative inline-block h-5 w-5 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-black/10">
                <img
                  src={resolveCropImage({ slug: activeCropObj.slug, name: activeCropObj.nameEn })}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              {activeCropObj.nameHi}
            </span>
          </div>

          <div className="grid max-h-52 grid-cols-4 gap-1.5 overflow-y-auto rounded-[22px] bg-[var(--av-surface-inset)] p-2 sm:grid-cols-6">
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
                    if (!initialData?.name) {
                      setName(
                        suggestFieldName({
                          existing: existingFields,
                          cropHi: crop.nameHi,
                          village: village || placeVillage,
                        })
                      );
                    }
                  }}
                  className={cn(
                    "rounded-[16px] px-1 py-2 text-center transition-[transform,background-color,color,box-shadow] duration-150 active:scale-[0.96]",
                    selected
                      ? "bg-emerald-800 text-white shadow-[0_8px_18px_-10px_rgba(6,78,59,0.7)]"
                      : "bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
                  )}
                >
                  <span
                    className="relative mx-auto block h-10 w-10 overflow-hidden rounded-[14px] outline outline-1 outline-offset-[-1px] outline-black/10"
                    aria-hidden
                  >
                    <img
                      src={resolveCropImage({ slug: crop.slug, name: crop.nameEn })}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="mt-1.5 block truncate text-[12px] font-semibold leading-tight">
                    {crop.nameHi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
            बीज किस्म
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            {activeCropObj.popularVarieties.map((item) => {
              const selected = variety === item && !customVariety;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setVariety(item);
                    setCustomVariety("");
                  }}
                  className={cn(
                    "min-h-10 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-[transform,background-color,color,border-color] duration-150 active:scale-[0.97]",
                    selected
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-emerald-500/40 hover:text-[var(--av-text-primary)]"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="या अपनी किस्म लिखें…"
            value={customVariety}
            onChange={(event) => setCustomVariety(event.target.value)}
            className="av-input min-h-11 rounded-2xl bg-[var(--av-surface)] text-[14px] font-medium"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
              <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              बुवाई की तारीख
            </label>
            <span className="text-[12px] font-semibold tabular-nums text-[var(--av-text-muted)]">
              {sowingDate}
            </span>
          </div>

          <div className="mb-2 grid grid-cols-4 gap-1.5">
            {[
              { days: 0, label: "आज" },
              { days: 10, label: "10 दिन पहले" },
              { days: 21, label: "21 दिन पहले" },
              { days: 35, label: "35 दिन पहले" },
            ].map((preset) => {
              const selected = sowingDate === daysAgoISO(preset.days);
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleApplySowingPreset(preset.days)}
                  className={cn(
                    "min-h-10 rounded-2xl px-1 text-[12px] font-semibold leading-tight transition-[transform,background-color,color] duration-150 active:scale-[0.97]",
                    selected
                      ? "bg-emerald-800 text-white"
                      : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <input
            type="date"
            value={sowingDate}
            onChange={(event) => setSowingDate(event.target.value)}
            className="av-input min-h-11 rounded-2xl bg-[var(--av-surface)] text-[14px] font-medium tabular-nums"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
              <Droplets className="h-4 w-4 text-sky-600 dark:text-sky-300" />
              सिंचाई व्यवस्था
            </label>
            <div className="flex flex-wrap gap-2">
              {IRRIGATION_OPTIONS.map((option) => {
                const selected = irrigationType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIrrigationType(option.value)}
                    className={cn(
                      "min-h-10 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-[transform,background-color,color] duration-150 active:scale-[0.97]",
                      selected
                        ? "bg-sky-800 text-white"
                        : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
              <Mountain className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              मिट्टी का प्रकार
            </label>
            <div className="flex flex-wrap gap-2">
              {FARM_SOIL_OPTIONS.map((option) => {
                const selected = !showCustomSoil && soilType === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      soilTouched.current = true;
                      setShowCustomSoil(false);
                      setCustomSoil("");
                      setSoilType(option);
                      setError(null);
                    }}
                    className={cn(
                      "min-h-10 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-[transform,background-color,color] duration-150 active:scale-[0.97]",
                      selected
                        ? "bg-amber-800 text-white"
                        : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                    )}
                  >
                    {option.replace(/\s*\(.*\)$/, "")}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  soilTouched.current = true;
                  setShowCustomSoil(true);
                  setSoilType("");
                  setError(null);
                }}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-[transform,background-color,color] duration-150 active:scale-[0.97]",
                  showCustomSoil
                    ? "bg-amber-800 text-white"
                    : "border border-dashed border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                )}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                अपनी लिखें
              </button>
            </div>
            {showCustomSoil ? (
              <input
                value={customSoil}
                onChange={(event) => {
                  soilTouched.current = true;
                  setCustomSoil(event.target.value);
                  setError(null);
                }}
                placeholder="जैसे: ऊसर, रेतीली, कंकड़ वाली…"
                className="av-input mt-2 min-h-11 rounded-2xl bg-[var(--av-surface)] text-[14px] font-medium"
                autoFocus
              />
            ) : null}
            {climateNote || initialData?.climateNote ? (
              <p className="mt-2 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                {climateNote || initialData?.climateNote}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-[var(--av-text-secondary)]">
            <FileText className="h-4 w-4 text-[var(--av-text-muted)]" />
            नोट्स
          </label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="खेत, मिट्टी या सिंचाई से जुड़ी कोई खास बात…"
            rows={2}
            className="av-input min-h-[4.5rem] resize-none rounded-2xl bg-[var(--av-surface)] py-3 text-[14px] font-medium"
          />
        </div>
      </form>
    </FarmSheet>
  );
}
