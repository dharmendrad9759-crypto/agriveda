"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { LatLng } from "@/lib/geo/fieldGeometry";
import { FieldObservation, PotentialInspectionZone } from "@/lib/farm/types";
import "leaflet/dist/leaflet.css";

interface LiveFieldMapProps {
  boundary: LatLng[];
  observations?: FieldObservation[];
  inspectionZones?: PotentialInspectionZone[];
  onMapClick?: (coords: LatLng) => void;
  height?: string;
  className?: string;
  allowPinDrop?: boolean;
}

function AutoBounds({ boundary }: { boundary: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (boundary && boundary.length >= 2) {
      const bounds = L.latLngBounds(boundary.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 19 });
    }
  }, [boundary, map]);

  return null;
}

function MapClickHandler({ onClick }: { onClick?: (coords: LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

const CATEGORY_META: Record<string, { color: string; label: string; icon: string }> = {
  insect_pest: {
    color: "#ef4444",
    label: "कीट हमला",
    icon: '<path d="M9 7.13v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6 13H2"/><path d="M22 13h-4"/><path d="m8 2 1.9 1.9"/><path d="M14.1 3.9 16 2"/>',
  },
  disease: {
    color: "#f97316",
    label: "रोग लक्षण",
    icon: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
  },
  weed_patch: {
    color: "#eab308",
    label: "खरपतवार",
    icon: '<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5Z"/>',
  },
  waterlogging: {
    color: "#0ea5e9",
    label: "जल भराव",
    icon: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 4 12 2c-.5 2-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z"/>',
  },
  irrigation_issue: {
    color: "#0284c7",
    label: "सिंचाई समस्या",
    icon: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"/>',
  },
  soil_deficiency: {
    color: "#8b5cf6",
    label: "पोषक तत्व",
    icon: '<path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  },
  general_scout: {
    color: "#10b981",
    label: "सामान्य निरीक्षण",
    icon: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  },
};

function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.general_scout;
}

function getCategoryIcon(category: string) {
  const meta = getCategoryMeta(category);

  return L.divIcon({
    className: "custom-field-pin",
    html: `
      <div style="
        background: ${meta.color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2px solid #ffffff;
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${meta.icon}</svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function LiveFieldMap({
  boundary,
  observations = [],
  inspectionZones = [],
  onMapClick,
  height = "320px",
  className = "",
  allowPinDrop = false,
}: LiveFieldMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (!boundary || boundary.length === 0) return [27.502, 78.053];
    const avgLat = boundary.reduce((acc, p) => acc + p.lat, 0) / boundary.length;
    const avgLng = boundary.reduce((acc, p) => acc + p.lng, 0) / boundary.length;
    return [avgLat, avgLng];
  }, [boundary]);

  if (!boundary || boundary.length < 3) {
    return (
      <div
        className={`w-full bg-emerald-950/20 rounded-2xl flex flex-col items-center justify-center text-xs text-emerald-800 p-6 ${className}`}
        style={{ height }}
      >
        <p className="font-semibold text-sm mb-1">खेत की सीमा उपलब्ध नहीं है</p>
        <p className="text-gray-500 text-center">
          कृपया पहले &quot;अपना खेत नापें&quot; में जाकर खेत की सीमा रेखा बनाएं।
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-emerald-900/15 shadow-md ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={17}
        zoomControl={true}
        attributionControl={false}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <AutoBounds boundary={boundary} />
        {allowPinDrop && <MapClickHandler onClick={onMapClick} />}

        {/* ArcGIS World Imagery Satellite Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        {/* Boundary Polygon */}
        <Polygon
          positions={boundary.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: "#10b981",
            fillColor: "#059669",
            fillOpacity: 0.28,
            weight: 3,
            dashArray: "6, 6",
          }}
        />

        {/* Inspection Zones (Satellite Radar Anomaly Circles) */}
        {inspectionZones.map((zone) => {
          const lat = zone.centroid?.lat;
          const lng = zone.centroid?.lng;
          if (lat == null || lng == null) return null;
          const radiusMeters = zone.areaHectares ? Math.sqrt((zone.areaHectares * 10000) / Math.PI) : 15;
          const isHigh = zone.urgency === "high";

          return (
            <Circle
              key={zone.zoneId}
              center={[lat, lng]}
              radius={Math.max(8, radiusMeters)}
              pathOptions={{
                color: isHigh ? "#ef4444" : "#f59e0b",
                fillColor: isHigh ? "#f87171" : "#fbbf24",
                fillOpacity: 0.45,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <p className="font-bold text-gray-900">
                    {isHigh ? "उच्च प्राथमिकता जांच क्षेत्र" : "मध्यम प्राथमिकता क्षेत्र"}
                  </p>
                  <p className="text-gray-600 mt-1">{zone.explanationHi}</p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    NDVI: {zone.meanNdvi.toFixed(2)} • ~{Math.round(zone.areaHectares * 10000)} मी²
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Observation Pins */}
        {observations.map((obs) => {
          if (!obs.location) return null;
          const meta = getCategoryMeta(obs.category);
          return (
            <Marker
              key={obs.id}
              position={[obs.location.lat, obs.location.lng]}
              icon={getCategoryIcon(obs.category)}
            >
              <Popup>
                <div className="p-1 text-xs max-w-[200px]">
                  <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                    <span>{meta.label}</span>
                  </div>
                  <p className="text-gray-700">{obs.notes || "कोई विवरण नहीं"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(obs.date || obs.createdAt).toLocaleDateString("hi-IN")}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Mode Helper Badge */}
      <div className="absolute top-2.5 left-2.5 z-[500] pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {allowPinDrop ? "खेत पर टैप करके समस्या पिन लगाएं" : "उपग्रह डिजिटल दृश्य (10m Resolution)"}
        </span>
      </div>
    </div>
  );
}
