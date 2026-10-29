"use client";

import { useEffect, useMemo, useState } from "react";
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

function getCategoryIcon(category: string) {
  let emoji = "📍";
  let bg = "#10b981";

  switch (category) {
    case "pest":
      emoji = "🐛";
      bg = "#ef4444";
      break;
    case "disease":
      emoji = "🍂";
      bg = "#f97316";
      break;
    case "weed":
      emoji = "🌿";
      bg = "#eab308";
      break;
    case "waterlogging":
      emoji = "💧";
      bg = "#0ea5e9";
      break;
    case "nutrient":
      emoji = "🧪";
      bg = "#8b5cf6";
      break;
    case "frost":
      emoji = "❄️";
      bg = "#06b6d4";
      break;
  }

  return L.divIcon({
    className: "custom-field-pin",
    html: `
      <div style="
        background: ${bg};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        border: 2px solid #ffffff;
        cursor: pointer;
        transform: translate(-16px, -16px);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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
          if (!lat || !lng) return null;
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
                    {isHigh ? "⚠️ उच्च प्राथमिकता जांच क्षेत्र" : "🔍 मध्यम प्राथमिकता क्षेत्र"}
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
          return (
            <Marker
              key={obs.id}
              position={[obs.location.lat, obs.location.lng]}
              icon={getCategoryIcon(obs.category)}
            >
              <Popup>
                <div className="p-1 text-xs max-w-[200px]">
                  <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                    <span>
                      {obs.category === "insect_pest"
                        ? "🐛 कीट हमला"
                        : obs.category === "disease"
                        ? "🍂 रोग लक्षण"
                        : obs.category === "weed_patch"
                        ? "🌿 खरपतवार"
                        : obs.category === "waterlogging"
                        ? "💧 जल भराव"
                        : "📍 समस्या नोट"}
                    </span>
                  </div>
                  <p className="text-gray-700">{obs.notes || "कोई विवरण नहीं"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(obs.date || obs.createdAt || Date.now()).toLocaleDateString("hi-IN")}
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
