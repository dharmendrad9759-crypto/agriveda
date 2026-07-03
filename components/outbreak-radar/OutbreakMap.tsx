"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { PublicOutbreakReport } from "@/types/outbreak";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const CATEGORY_PIN: Record<string, string> = {
  insect: "#ef4444",
  fungal: "#f59e0b",
  bacterial: "#f97316",
  viral: "#a855f7",
  weed: "#10b981",
  other: "#6b7280",
};

function pinIcon(color: string) {
  return L.divIcon({
    className: "outbreak-pin",
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  const prev = useRef({ lat, lon });

  useEffect(() => {
    if (prev.current.lat !== lat || prev.current.lon !== lon) {
      map.setView([lat, lon], map.getZoom());
      prev.current = { lat, lon };
    }
  }, [lat, lon, map]);

  return null;
}

interface OutbreakMapProps {
  lat: number;
  lon: number;
  reports: PublicOutbreakReport[];
  onAdjustPin?: (lat: number, lon: number) => void;
  draggablePin?: boolean;
  pinLat?: number;
  pinLon?: number;
  height?: string;
}

export default function OutbreakMap({
  lat,
  lon,
  reports,
  onAdjustPin,
  draggablePin,
  pinLat,
  pinLon,
  height = "280px",
}: OutbreakMapProps) {
  const userPin = pinLat != null && pinLon != null ? [pinLat, pinLon] as [number, number] : null;

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
      <MapContainer
        center={[lat, lon]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={lat} lon={lon} />

        <Marker
          position={[lat, lon]}
          icon={pinIcon("#006432")}
        >
          <Popup>You are here</Popup>
        </Marker>

        {userPin && draggablePin && (
          <Marker
            position={userPin}
            draggable
            icon={pinIcon("#3b82f6")}
            eventHandlers={{
              dragend: (e) => {
                const { lat: newLat, lng: newLon } = e.target.getLatLng();
                onAdjustPin?.(newLat, newLon);
              },
            }}
          />
        )}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {reports.map((r) => (
            <Marker
              key={r.id}
              position={[r.latitude, r.longitude]}
              icon={pinIcon(CATEGORY_PIN[r.threatCategory] ?? CATEGORY_PIN.other)}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-bold">{r.threatName}</p>
                  <p>{r.cropName} • {r.severity}</p>
                  {r.distanceKm != null && <p>{r.distanceKm} km away</p>}
                  <a href={r.advisoryUrl} className="text-emerald-600 underline">
                    View advisory
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
