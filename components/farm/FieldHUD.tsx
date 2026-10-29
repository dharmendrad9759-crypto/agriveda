"use client";

import { useMemo, useState } from "react";
import {
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Save,
  Layers,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  LatLng,
  getFieldMeasurement,
  validateFieldPolygon,
} from "@/lib/geo/fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS } from "@/lib/bighaConversion";

interface FieldHUDProps {
  coords: LatLng[];
  onSave?: () => void;
  canSave?: boolean;
  selectedBighaId?: string;
  onBighaIdChange?: (id: string) => void;
  className?: string;
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
      REGIONAL_BIGHA_OPTIONS.find((b) => b.id === (onBighaIdChange ? selectedBighaId : bighaId)) ||
      REGIONAL_BIGHA_OPTIONS[0]
    );
  }, [bighaId, selectedBighaId, onBighaIdChange]);

  const validation = useMemo(() => {
    return validateFieldPolygon(coords);
  }, [coords]);

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

  return (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 p-4 transition-all ${className}`}
    >
      {/* Top Bar: Validation / Status */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {coords.length < 3 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Info className="w-3.5 h-3.5" />
              {coords.length === 0
                ? "नक्शे पर खेत के कोने दबाएं (Tap corners)"
                : `कम से कम 3 कोने चाहिए (${coords.length}/3)`}
            </span>
          ) : validation.valid ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              सटीक माप तैयार ({coords.length} कोने)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              {validation.error || "सीमा रेखा अमान्य है"}
            </span>
          )}
        </div>

        {/* Bigha Standard Selector Dropdown */}
        <div className="relative inline-block text-left">
          <label className="sr-only">क्षेत्रीय बीघा मानक चुनें</label>
          <div className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 cursor-pointer">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={onBighaIdChange ? selectedBighaId : bighaId}
              onChange={(e) => handleBighaChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer pr-1"
            >
              {REGIONAL_BIGHA_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.state} ({opt.acresPerBigha} एकड़/बीघा)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Measurements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {/* Acres */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50/60 p-2.5 rounded-xl border border-emerald-100 text-center">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
            कुल एकड़ (Acres)
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">
            {measurement ? measurement.acres.toFixed(2) : "0.00"}
          </div>
          <div className="text-[10px] text-emerald-600">एकड़ भूमि</div>
        </div>

        {/* Regional Bigha */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50/60 p-2.5 rounded-xl border border-amber-100 text-center">
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide truncate">
            {selectedBigha.state} बीघा
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5">
            {measurement?.bigha ? measurement.bigha.value.toFixed(2) : "0.00"}
          </div>
          <div className="text-[10px] text-amber-600 truncate" title={selectedBigha.note}>
            बीघा (मानक)
          </div>
        </div>

        {/* Hectares */}
        <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-center">
          <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            हेक्टेयर (Ha)
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-800 mt-0.5">
            {measurement ? measurement.hectares.toFixed(3) : "0.000"}
          </div>
          <div className="text-[10px] text-gray-500">10,000 m²</div>
        </div>

        {/* Perimeter */}
        <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-center">
          <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            परिधि / मेड़ (Perimeter)
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-800 mt-0.5">
            {measurement ? Math.round(measurement.perimeterMeters) : 0} m
          </div>
          <div className="text-[10px] text-gray-500">
            {measurement ? (measurement.sqMeters).toLocaleString("en-IN", { maximumFractionDigits: 0 }) + " m²" : "0 m²"}
          </div>
        </div>
      </div>

      {/* Action Row & Legal Disclaimer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-gray-500 leading-tight text-center sm:text-left">
          <span className="font-semibold text-gray-600">नोट:</span> यह WGS84 भू-गणितीय (Geodesic) उपग्रह आधारित अनुमानित माप है। राजस्व या कानूनी सर्वेक्षण के लिए नहीं।
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || !validation.valid || coords.length < 3}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
              canSave && validation.valid && coords.length >= 3
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-lg active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            खेत सहेजें (Save Field)
          </button>
        )}
      </div>
    </div>
  );
}
