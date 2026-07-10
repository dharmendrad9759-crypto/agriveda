"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { CloudRain, Loader2 } from "lucide-react";
import { getLatestRadarTilePath, rainviewerTileUrl } from "@/lib/rainviewer";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [23.2599, 77.4126];

const locationIcon = L.divIcon({
  className: "rainfall-pin",
  html: `<div style="background:#10b981;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.45)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  const prev = useRef({ lat, lon });

  useEffect(() => {
    if (prev.current.lat !== lat || prev.current.lon !== lon) {
      map.setView([lat, lon], 8);
      prev.current = { lat, lon };
    }
  }, [lat, lon, map]);

  return null;
}

function RadarLayer({ path }: { path: string }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    const layer = L.tileLayer(rainviewerTileUrl(path), {
      opacity: 0.65,
      maxZoom: 12,
      attribution: '&copy; <a href="https://www.rainviewer.com">RainViewer</a>',
    });
    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, path]);

  return null;
}

interface RainfallMapProps {
  lat?: number;
  lon?: number;
  rainChance?: number;
  rainMm?: number;
  height?: string;
}

export default function RainfallMap({
  lat,
  lon,
  rainChance = 0,
  rainMm = 0,
  height = "220px",
}: RainfallMapProps) {
  const [radarPath, setRadarPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const centerLat = lat ?? DEFAULT_CENTER[0];
  const centerLon = lon ?? DEFAULT_CENTER[1];
  const hasCoords = lat != null && lon != null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getLatestRadarTilePath()
      .then((path) => {
        if (cancelled) return;
        if (!path) setError(true);
        else setRadarPath(path);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]"
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-[var(--av-accent)]" />
      </div>
    );
  }

  if (error || !radarPath) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-[var(--av-border)] bg-gradient-to-br from-sky-950/40 to-[var(--av-surface-inset)] px-4 text-center"
        style={{ height }}
      >
        <CloudRain className="h-8 w-8 text-sky-400" />
        <p className="mt-2 text-xs font-semibold text-[var(--av-text-primary)]">
          {rainChance > 0 ? `${rainChance}% बारिश की संभावना` : "अभी बारिश की संभावना कम"}
        </p>
        <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
          रडार मैप लोड नहीं हो सका — नेटवर्क चेक करें
        </p>
        {rainMm > 0 && (
          <p className="mt-1 text-[10px] text-sky-400">अनुमानित: {rainMm.toFixed(1)} mm</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--av-border)]" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={hasCoords ? 8 : 5}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RadarLayer path={radarPath} />
        {hasCoords && (
          <>
            <Marker position={[centerLat, centerLon]} icon={locationIcon} />
            <Circle
              center={[centerLat, centerLon]}
              radius={25000}
              pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.08, weight: 1 }}
            />
          </>
        )}
        <RecenterMap lat={centerLat} lon={centerLon} />
      </MapContainer>

      <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
        <div className="rounded-lg bg-black/60 px-2 py-1 text-[9px] text-white backdrop-blur-sm">
          {hasCoords ? "आपका स्थान" : "भारत — रडार"}
        </div>
        <div className="rounded-lg bg-black/60 px-2 py-1 text-[9px] text-sky-200 backdrop-blur-sm">
          {rainChance}% rain
        </div>
      </div>
    </div>
  );
}
