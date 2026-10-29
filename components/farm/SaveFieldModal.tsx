"use client";

import { useState, useMemo } from "react";
import {
  X,
  Check,
  MapPin,
  Sprout,
  Calendar,
  Droplets,
  Mountain,
  FileText,
  User,
  Sparkles,
  Award,
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
  { value: "Tubewell / बोरवेल", label: "💧 बोरवेल / ट्यूबवेल" },
  { value: "Canal / नहर", label: "🌊 नहर (Canal)" },
  { value: "Drip / टपक सिंचाई", label: "🚰 ड्रिप सिंचाई" },
  { value: "Sprinkler / फव्वारा", label: "🚿 फव्वारा (Sprinkler)" },
  { value: "Rainfed / वर्षा-आधारित", label: "🌧️ वर्षा-आधारित (बारानी)" },
];

const SOIL_OPTIONS = [
  "दोमट मिट्टी (Loam)",
  "काली मिट्टी (Black)",
  "जलोढ़ मिट्टी (Alluvial)",
  "बलुई दोमट (Sandy Loam)",
  "चिकनी मिट्टी (Clay)",
];

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

  const [name, setName] = useState(initialData?.name || "मेरा खेत 1");
  const [village, setVillage] = useState(
    initialData?.village || profile?.village || profile?.district || "मेरा गांव"
  );
  const [farmerName, setFarmerName] = useState(initialData?.farmerName || profile?.name || "");

  // Crop & Variety
  const [selectedCropSlug, setSelectedCropSlug] = useState<string>("wheat");
  const [variety, setVariety] = useState<string>(initialData?.variety || "DBW 187");
  const [customVariety, setCustomCropVariety] = useState("");

  // Sowing Date Preset calculation (Default: 22 days ago for CRI active wheat stage)
  const defaultSowing = useMemo(() => {
    const d = new Date(Date.now() - 22 * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  }, []);

  const [sowingDate, setSowingDate] = useState<string>(initialData?.sowingDate || defaultSowing);
  const [irrigationType, setIrrigationType] = useState<string>(
    initialData?.irrigationType || "Tubewell / बोरवेल"
  );
  const [soilType, setSoilType] = useState<string>(
    initialData?.soilType || "दोमट मिट्टी (Loam)"
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);

  const activeCropObj = useMemo(() => {
    return CROPS_CATALOG.find((c) => c.slug === selectedCropSlug) || CROPS_CATALOG[0];
  }, [selectedCropSlug]);

  if (!isOpen) return null;

  const handleApplySowingPreset = (daysAgo: number) => {
    const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    setSowingDate(d.toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      area: isPolygon ? `${acres.toFixed(2)} एकड़` : (initialData?.area || "लोकेशन सहेजी गई"),
      areaAcres: isPolygon ? Math.round(acres * 100) / 100 : initialData?.areaAcres,
      areaHectares: isPolygon ? Math.round(hectares * 1000) / 1000 : initialData?.areaHectares,
      areaSqMeters: isPolygon ? Math.round(sqMeters) : initialData?.areaSqMeters,
      perimeterMeters: isPolygon ? Math.round(perimeter) : initialData?.perimeterMeters,
      bighaDisplay: isPolygon ? bighaDisplay : undefined,
      ownership: initialData?.ownership || "Owned",
      emoji: activeCropObj.emoji,
      stage: initialData?.stage || "सक्रिय",
      status: "Active",
      boundary: isPolygon ? coords : undefined,
      geoJson,
      location: centerPoint,
      isLocationOnly: !isPolygon,
      measurementMethod: isPolygon ? "manual_map" : "manual_entry",
      sowingDate,
      sowingDateIso: sowingDate ? new Date(sowingDate).toISOString() : undefined,
      irrigationType,
      soilType,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-emerald-100 flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600/15 via-[#103C32]/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#103C32] text-white flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                अपना खेत सहेजें
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                  Agriveda 360°
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                उपग्रह सीमा, रकबा और फसल चक्र सक्रिय करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Tech Measurement Telemetry Bar */}
        <div className="mx-4 sm:mx-5 mt-3.5 p-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl shadow-md flex items-center justify-around text-center">
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              सटीक रकबा (Area)
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              {acres.toFixed(2)} एकड़
            </div>
            {bighaDisplay && (
              <div className="text-[10px] text-amber-300 font-bold">
                {bighaDisplay}
              </div>
            )}
          </div>
          <div className="w-px h-9 bg-emerald-700/60" />
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              हेक्टेयर
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {hectares.toFixed(3)} Ha
            </div>
            <div className="text-[10px] text-emerald-200">
              {Math.round(sqMeters).toLocaleString()} m²
            </div>
          </div>
          <div className="w-px h-9 bg-emerald-700/60" />
          <div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              मेड़ परिधि
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {Math.round(perimeter)} मीटर
            </div>
            <div className="text-[10px] text-emerald-200">{coords.length} कोने</div>
          </div>
        </div>

        {error && (
          <div className="mx-4 sm:mx-5 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Field Name & Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                खेत का नाम <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा. उत्तर वाला खेत, 01"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                गांव / कस्बा
              </label>
              <input
                type="text"
                placeholder="उदा. नगला बीच"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-800"
              />
            </div>
          </div>

          {/* Visual Crop Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                मुख्य फसल चुनें
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                चयनित: {activeCropObj.emoji} {activeCropObj.nameHi}
              </span>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/50">
              {CROPS_CATALOG.map((item) => {
                const isSelected = item.slug === selectedCropSlug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      setSelectedCropSlug(item.slug);
                      setVariety(item.popularVarieties[0] || "");
                    }}
                    className={`p-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-[#103C32] text-white shadow-md ring-2 ring-emerald-500 font-bold scale-[1.02]"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-lg block">{item.emoji}</span>
                    <span className="text-[11px] font-bold block mt-0.5 truncate">
                      {item.nameHi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variety Quick Pills */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              बीज किस्म / वेरायटी (Variety)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {activeCropObj.popularVarieties.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setVariety(v);
                    setCustomCropVariety("");
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                    variety === v && !customVariety
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="या अपनी किस्म का नाम लिखें (उदा. श्रीराम 303)..."
              value={customVariety}
              onChange={(e) => setCustomCropVariety(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {/* Sowing Date with Instant Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                बुवाई की तारीख (Sowing Date)
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {sowingDate}
              </span>
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => handleApplySowingPreset(0)}
                className="py-1 px-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[10px] text-center"
              >
                आज
              </button>
              <button
                type="button"
                onClick={() => handleApplySowingPreset(10)}
                className="py-1 px-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[10px] text-center"
              >
                10 दिन पहले
              </button>
              <button
                type="button"
                onClick={() => handleApplySowingPreset(21)}
                className="py-1 px-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[10px] text-center border border-amber-300"
              >
                21 दिन (CRI)
              </button>
              <button
                type="button"
                onClick={() => handleApplySowingPreset(35)}
                className="py-1 px-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[10px] text-center"
              >
                35 दिन पहले
              </button>
            </div>

            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-gray-800 bg-white"
            />
          </div>

          {/* Irrigation & Soil Quick Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                सिंचाई व्यवस्था
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
              >
                {IRRIGATION_OPTIONS.map((it) => (
                  <option key={it.value} value={it.value}>
                    {it.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-600" />
                मिट्टी का प्रकार
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
              >
                {SOIL_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#103C32] hover:bg-[#0c2e26] text-white text-xs font-black shadow-lg shadow-emerald-950/25 flex items-center gap-2 active:scale-95 transition"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>खेत व 360° सफर सक्रिय करें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
