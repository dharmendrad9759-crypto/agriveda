"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import { LatLng } from "@/lib/geo/fieldGeometry";
import "leaflet/dist/leaflet.css";

interface MiniFieldMapProps {
  boundary: LatLng[];
  height?: string;
  className?: string;
}

function AutoBounds({ boundary }: { boundary: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (boundary && boundary.length >= 2) {
      const bounds = L.latLngBounds(boundary.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [15, 15], maxZoom: 18 });
    }
  }, [boundary, map]);

  return null;
}

export default function MiniFieldMap({
  boundary,
  height = "160px",
  className = "",
}: MiniFieldMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (!boundary || boundary.length === 0) return [27.502, 78.053];
    const avgLat = boundary.reduce((acc, p) => acc + p.lat, 0) / boundary.length;
    const avgLng = boundary.reduce((acc, p) => acc + p.lng, 0) / boundary.length;
    return [avgLat, avgLng];
  }, [boundary]);

  if (!boundary || boundary.length < 3) {
    return (
      <div
        className={`w-full bg-emerald-950/20 rounded-xl flex items-center justify-center text-xs text-emerald-800 ${className}`}
        style={{ height }}
      >
        नक्शा उपलब्ध नहीं है
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-emerald-100/80 shadow-inner ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={16}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        className="w-full h-full z-0 pointer-events-none"
      >
        <AutoBounds boundary={boundary} />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <Polygon
          positions={boundary.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: "#059669",
            fillColor: "#10b981",
            fillOpacity: 0.45,
            weight: 2.5,
          }}
        />
      </MapContainer>
    </div>
  );
}
