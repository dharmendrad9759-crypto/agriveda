"use client";

import { useState } from "react";
import { X, Check, MapPin, Sprout, Calendar, Droplets, Mountain, FileText, User } from "lucide-react";
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

interface SaveFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  coords: LatLng[];
  bighaDisplay?: string;
  initialData?: Partial<FarmField>;
  onSave: (fieldData: Omit<FarmField, "id">) => void;
}

const POPULAR_CROPS = [
  "गेहूं (Wheat)",
  "धान (Paddy)",
  "सरसों (Mustard)",
  "आलू (Potato)",
  "गन्ना (Sugarcane)",
  "मक्का (Maize)",
  "कपास (Cotton)",
  "चना (Gram)",
  "सोयाबीन (Soybean)",
  "टमाटर (Tomato)",
  "प्याज (Onion)",
  "मिर्च (Chilli)",
  "अन्य (Other)",
];

const IRRIGATION_TYPES = [
  { value: "Tubewell / बोरवेल", label: "बोरवेल / ट्यूबवेल (Tubewell)" },
  { value: "Canal / नहर", label: "नहर (Canal)" },
  { value: "Drip / टपक सिंचाई", label: "ड्रिप / टपक सिंचाई (Drip)" },
  { value: "Sprinkler / फव्वारा", label: "फव्वारा सिंचाई (Sprinkler)" },
  { value: "Rainfed / वर्षा-आधारित", label: "वर्षा-आधारित / बारानी (Rainfed)" },
  { value: "Other / अन्य", label: "अन्य (Other)" },
];

const SOIL_TYPES = [
  { value: "दोमट मिट्टी (Loamy Soil)", label: "दोमट मिट्टी (Loamy Soil)" },
  { value: "काली मिट्टी (Black Soil)", label: "काली मिट्टी (Black Soil)" },
  { value: "जलोढ़ मिट्टी (Alluvial Soil)", label: "जलोढ़ मिट्टी (Alluvial Soil)" },
  { value: "रेतीली / बलुई (Sandy Loam)", label: "रेतीली / बलुई (Sandy Loam)" },
  { value: "लाल मिट्टी (Red Soil)", label: "लाल मिट्टी (Red Soil)" },
  { value: "चिकनी मिट्टी (Clay Soil)", label: "चिकनी मिट्टी (Clay Soil)" },
];

export default function SaveFieldModal({
  isOpen,
  onClose,
  coords,
  bighaDisplay,
  initialData,
  onSave,
}: SaveFieldModalProps) {
  const sqMeters = calculateGeodesicArea(coords);
  const acres = sqMeters / ACRE_TO_SQ_METERS;
  const hectares = sqMeters / HECTARE_TO_SQ_METERS;
  const perimeter = calculateGeodesicPerimeter(coords);

  const [name, setName] = useState(initialData?.name || "");
  const [village, setVillage] = useState(initialData?.village || "");
  const [farmerName, setFarmerName] = useState(initialData?.farmerName || "");
  const [crop, setCrop] = useState(initialData?.crop || "");
  const [customCrop, setCustomCrop] = useState("");
  const [sowingDate, setSowingDate] = useState(initialData?.sowingDate || "");
  const [irrigationType, setIrrigationType] = useState(initialData?.irrigationType || "");
  const [soilType, setSoilType] = useState(initialData?.soilType || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("कृपया खेत का नाम दर्ज करें (Field name is required)");
      return;
    }
    if (!village.trim()) {
      setError("कृपया गांव या स्थान का नाम दर्ज करें (Village is required)");
      return;
    }

    const finalCrop = crop === "अन्य (Other)" ? customCrop.trim() : crop.trim();
    const isPolygon = coords.length >= 3;
    const geoJson = isPolygon ? coordsToGeoJsonPolygon(coords) : undefined;
    const centerPoint = coords.length > 0 ? getPolygonCenter(coords) : undefined;

    onSave({
      name: name.trim(),
      village: village.trim(),
      farmerName: farmerName.trim() || undefined,
      crop: finalCrop || "अनिर्धारित",
      area: isPolygon ? `${acres.toFixed(2)} एकड़` : (initialData?.area || "लोकेशन सहेजी गई"),
      areaAcres: isPolygon ? Math.round(acres * 100) / 100 : initialData?.areaAcres,
      areaHectares: isPolygon ? Math.round(hectares * 1000) / 1000 : initialData?.areaHectares,
      areaSqMeters: isPolygon ? Math.round(sqMeters) : initialData?.areaSqMeters,
      perimeterMeters: isPolygon ? Math.round(perimeter) : initialData?.perimeterMeters,
      bighaDisplay: isPolygon ? bighaDisplay : undefined,
      ownership: initialData?.ownership || "Owned",
      emoji: initialData?.emoji || "🌾",
      stage: initialData?.stage || "सक्रिय",
      status: "Active",
      boundary: isPolygon ? coords : undefined,
      geoJson,
      location: centerPoint,
      isLocationOnly: !isPolygon,
      measurementMethod: isPolygon ? "manual_map" : "manual_entry",
      sowingDate: sowingDate || initialData?.sowingDate || "",
      irrigationType: irrigationType || undefined,
      soilType: soilType || undefined,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-emerald-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              अपना खेत सहेजें (Save Field)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              खेत की लोकेशन, सीमा और रकबा अपनी प्रोफाइल में सुरक्षित करें
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measurement Summary Pill */}
        <div className="mx-5 mt-4 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-around text-center">
          <div>
            <div className="text-[11px] font-semibold text-emerald-800">रकबा (Area)</div>
            <div className="text-xl font-extrabold text-emerald-900">
              {acres.toFixed(2)} एकड़
            </div>
            {bighaDisplay && (
              <div className="text-[10px] text-emerald-700 font-medium">
                {bighaDisplay}
              </div>
            )}
          </div>
          <div className="w-px h-8 bg-emerald-200" />
          <div>
            <div className="text-[11px] font-semibold text-emerald-800">हेक्टेयर</div>
            <div className="text-base font-bold text-emerald-900">
              {hectares.toFixed(3)} Ha
            </div>
            <div className="text-[10px] text-emerald-700">
              {Math.round(sqMeters).toLocaleString()} m²
            </div>
          </div>
          <div className="w-px h-8 bg-emerald-200" />
          <div>
            <div className="text-[11px] font-semibold text-emerald-800">मेड़ परिधि</div>
            <div className="text-base font-bold text-emerald-900">
              {Math.round(perimeter)} m
            </div>
            <div className="text-[10px] text-emerald-700">{coords.length} कोने</div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {/* Field Name (Required) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              खेत का नाम (Field Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="उदा. उत्तर वाला खेत, नहर का खेत, 01"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Village & Farmer Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                गांव / कस्बा (Village) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा. नगला बीच, सासनी"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                किसान का नाम (Farmer Name)
              </label>
              <input
                type="text"
                placeholder="वैकल्पिक (Optional)"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Crop & Sowing Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                मुख्य फसल (Crop)
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              >
                <option value="">-- फसल चुनें (Select Crop) --</option>
                {POPULAR_CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {crop === "अन्य (Other)" && (
                <input
                  type="text"
                  placeholder="फसल का नाम लिखें"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                बुवाई की तारीख (Sowing Date)
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              />
            </div>
          </div>

          {/* Irrigation & Soil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                सिंचाई व्यवस्था (Irrigation)
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs bg-white"
              >
                <option value="">-- सिंचाई का प्रकार चुनें --</option>
                {IRRIGATION_TYPES.map((it) => (
                  <option key={it.value} value={it.value}>
                    {it.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-600" />
                मिट्टी का प्रकार (Soil Type)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs bg-white"
              >
                <option value="">-- मिट्टी का प्रकार चुनें --</option>
                {SOIL_TYPES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              विशेष टिप्पणी (Notes)
            </label>
            <textarea
              rows={2}
              placeholder="खेत से संबंधित कोई विशेष बात, रास्ता या पहचान..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-xs transition"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              खेत सुरक्षित करें (Save Field)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
