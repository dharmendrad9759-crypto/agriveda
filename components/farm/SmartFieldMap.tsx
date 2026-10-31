"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Circle,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import {
  Search,
  Crosshair,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Trash2,
  Layers,
  Footprints,
  Pause,
  Play,
  Check,
  RotateCcw,
  AlertTriangle,
  ZoomIn,
  Loader2,
  PlusCircle,
  MapPin,
} from "lucide-react";
import {
  LatLng,
  validateFieldPolygon,
  haversineDistanceMeters,
} from "@/lib/geo/fieldGeometry";
import { requestUserLocation } from "@/lib/weatherApi";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons in Next.js bundler
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapLayerType = "satellite" | "hybrid" | "osm" | "google_hybrid";

// Shared surface for map overlays: readable over satellite imagery in both themes.
const MAP_SURFACE =
  "border border-[var(--av-border)] bg-[var(--av-surface)]/95 shadow-[var(--av-shadow-md)] backdrop-blur-md";

const MAP_ICON_BUTTON =
  "flex h-9 w-9 items-center justify-center rounded-xl text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)] active:scale-95";

export interface SmartFieldMapProps {
  initialCoords?: LatLng[];
  mode?: "draw" | "walk" | "view";
  onCoordsChange?: (coords: LatLng[]) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onSaveLocationPin?: (coords: LatLng) => void;
  height?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  readOnly?: boolean;
}

// Marker icons
function createVertexIcon(index: number, isFirst: boolean = false) {
  return L.divIcon({
    className: "field-vertex-icon",
    html: `
      <div style="
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: ${isFirst ? "#059669" : "#10b981"};
        color: white;
        border: 2px solid ${isFirst ? "#f59e0b" : "#ffffff"};
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        cursor: grab;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

const userLocationIcon = L.divIcon({
  className: "gps-user-pulse",
  html: `
    <div style="position:relative; width:18px; height:18px;">
      <div style="position:absolute; width:18px; height:18px; border-radius:50%; background:#2563eb; border:2.5px solid white; box-shadow:0 0 8px rgba(37,99,235,0.8); z-index:2;"></div>
      <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(37,99,235,0.25); top:-8px; left:-8px; animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Map Controller for Center & Zoom Actions
function MapController({
  coords,
  focusCenter,
  triggerFitBounds,
}: {
  coords: LatLng[];
  focusCenter: [number, number] | null;
  triggerFitBounds: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (focusCenter) {
      map.flyTo(focusCenter, 18, { animate: true, duration: 1.2 });
    }
  }, [focusCenter, map]);

  useEffect(() => {
    if (triggerFitBounds > 0 && coords.length >= 2) {
      const bounds = L.latLngBounds(coords.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 19 });
    }
  }, [triggerFitBounds, coords, map]);

  return null;
}

// Map Click Listener Component
function MapClickHandler({
  onMapClick,
  enabled,
}: {
  onMapClick: (lat: number, lng: number) => void;
  enabled: boolean;
}) {
  useMapEvents({
    click(e) {
      if (enabled) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function SmartFieldMap({
  initialCoords = [],
  mode: initialMode = "draw",
  onCoordsChange,
  onValidationChange,
  onSaveLocationPin,
  height = "520px",
  defaultCenter = [27.502, 78.053], // Default Aligarh / UP Agricultural Belt
  defaultZoom = 16,
  readOnly = false,
}: SmartFieldMapProps) {
  const [coords, setCoords] = useState<LatLng[]>(initialCoords);
  const [mode, setMode] = useState<"draw" | "walk" | "view">(initialMode);
  const [layerType, setLayerType] = useState<MapLayerType>("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  // Undo / Redo stacks
  const [history, setHistory] = useState<LatLng[][]>([]);
  const [future, setFuture] = useState<LatLng[][]>([]);

  // Focus and bounds helpers
  const [focusCenter, setFocusCenter] = useState<[number, number] | null>(null);
  const [triggerFitBounds, setTriggerFitBounds] = useState(0);

  // GPS Walking State
  const [walkingState, setWalkingState] = useState<"idle" | "walking" | "paused" | "finished">("idle");
  const [walkPath, setWalkPath] = useState<LatLng[]>([]);
  const [userGpsPos, setUserGpsPos] = useState<LatLng | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastRecordedTimeRef = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Validation
  const validation = useMemo(() => validateFieldPolygon(coords), [coords]);

  useEffect(() => {
    onValidationChange?.(validation.valid, validation.error);
  }, [validation, onValidationChange]);

  const updateCoordinates = useCallback(
    (newCoords: LatLng[], recordHistory: boolean = true) => {
      if (recordHistory) {
        setHistory((prev) => [...prev.slice(-25), coords]);
        setFuture([]);
      }
      setCoords(newCoords);
      onCoordsChange?.(newCoords);
    },
    [coords, onCoordsChange]
  );

  // Undo / Redo Actions
  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [coords, ...f]);
    setCoords(prev);
    onCoordsChange?.(prev);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, coords]);
    setCoords(next);
    onCoordsChange?.(next);
  };

  const handleClear = () => {
    if (coords.length === 0) return;
    if (window.confirm("क्या आप खेत की सभी सीमाएं साफ करना चाहते हैं? (Clear boundary?)")) {
      updateCoordinates([]);
      setWalkPath([]);
      setWalkingState("idle");
    }
  };

  const handleDeleteVertex = (index: number) => {
    const updated = coords.filter((_, i) => i !== index);
    updateCoordinates(updated);
  };

  const handleDragVertex = (index: number, lat: number, lng: number) => {
    const updated = coords.map((c, i) => (i === index ? { lat, lng } : c));
    updateCoordinates(updated, true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (readOnly || mode !== "draw") return;
    const updated = [...coords, { lat, lng }];
    updateCoordinates(updated);
  };

  // Search by village / PIN / coordinates
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearching(true);
    setSearchMessage(null);

    try {
      // 1. Direct coordinate check: "27.50, 78.05"
      const coordMatch = query.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[3]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          setFocusCenter([lat, lng]);
          setSearching(false);
          return;
        }
      }

      // 2. Search Nominatim (India prioritized)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodeURIComponent(
          query
        )}`,
        { headers: { "Accept-Language": "hi,en" } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setFocusCenter([lat, lon]);
        setSearchMessage(`स्थान मिला: ${data[0].display_name.split(",").slice(0, 3).join(",")}`);
      } else {
        setSearchMessage("स्थान नहीं मिला, कृपया पिन कोड या जिला नाम जोड़ें।");
      }
    } catch {
      setSearchMessage("स्थान खोजने में त्रुटि हुई।");
    } finally {
      setSearching(false);
    }
  };

  // GPS Locate Me (Resilient Multi-Tier Location Resolver)
  const handleLocateMe = useCallback(async (isAuto = false) => {
    setLocating(true);
    setSearchMessage(null);

    const applyLocation = (lat: number, lng: number, accuracy?: number) => {
      setFocusCenter([lat, lng]);
      setUserGpsPos({ lat, lng });
      if (typeof accuracy === "number") setGpsAccuracy(accuracy);
      try {
        localStorage.setItem(
          "agriveda-last-location",
          JSON.stringify({ lat, lon: lng, at: new Date().toISOString() })
        );
      } catch {}
      setLocating(false);
    };

    // Tier 1: Try Native Capacitor / Browser High-Accuracy Location
    try {
      const pos = await requestUserLocation();
      applyLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      return;
    } catch {
      // Tier 2: Fall back to standard browser geolocation without high accuracy (fast network/WiFi fix)
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
          const fallbackPos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 12000,
              maximumAge: 120000,
            });
          });
          applyLocation(fallbackPos.coords.latitude, fallbackPos.coords.longitude, fallbackPos.coords.accuracy);
          return;
        } catch {
          /* continue to cache fallback */
        }
      }

      // Tier 3: Fall back to stored last location if present
      try {
        const stored = localStorage.getItem("agriveda-last-location");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
            applyLocation(parsed.lat, parsed.lon);
            return;
          }
        }
      } catch {}

      // Gentle guidance if manual tap failed — NEVER throw an alert modal
      if (!isAuto) {
        setSearchMessage("स्थान नहीं मिल सका। कृपया फोन का GPS/लोकेशन चालू करें या ऊपर गांव खोजें।");
      }
    } finally {
      setLocating(false);
    }
  }, []);

  // Auto-request location on screen mount so farmer's field is focused immediately
  useEffect(() => {
    handleLocateMe(true);
  }, [handleLocateMe]);

  // GPS Walking Mode Handler
  const startGpsWalking = () => {
    if (!("geolocation" in navigator)) {
      setGpsError("आपके उपकरण में GPS उपलब्ध नहीं है।");
      return;
    }

    setMode("walk");
    setWalkingState("walking");
    setGpsError(null);
    setWalkPath([]);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const now = Date.now();
        setGpsAccuracy(accuracy);
        setUserGpsPos({ lat: latitude, lng: longitude });

        // Reject poor accuracy fixes (> 25m)
        if (accuracy > 25) {
          setGpsError(`कमजोर GPS सिग्नल (सटीकता: ±${Math.round(accuracy)}m)। खुले खेत में आएं।`);
          return;
        }
        setGpsError(null);

        // Check distance from last point
        setWalkPath((prev) => {
          if (prev.length === 0) {
            lastRecordedTimeRef.current = now;
            return [{ lat: latitude, lng: longitude }];
          }

          const lastPt = prev[prev.length - 1];
          const dist = haversineDistanceMeters(lastPt, { lat: latitude, lng: longitude });
          const timeDiffSec = (now - lastRecordedTimeRef.current) / 1000;

          // Reject unreasonable teleports/jumps (>100m within 3 seconds)
          if (dist > 100 && timeDiffSec < 3) {
            return prev;
          }

          // Record if moved at least 2.5 meters
          if (dist >= 2.5) {
            lastRecordedTimeRef.current = now;
            return [...prev, { lat: latitude, lng: longitude }];
          }

          return prev;
        });
      },
      (err) => {
        setGpsError("GPS त्रुटि: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  };

  const pauseGpsWalking = () => {
    setWalkingState("paused");
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const resumeGpsWalking = () => {
    startGpsWalking();
  };

  const finishGpsWalking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setWalkingState("finished");
    setMode("draw");

    if (walkPath.length >= 3) {
      updateCoordinates(walkPath);
      setTriggerFitBounds((v) => v + 1);
    } else {
      alert("कम से कम 3 कोने होने चाहिए। कृपया खेत के चारों ओर चलकर दोबारा प्रयास करें।");
    }
  };

  // Clean up GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md flex flex-col bg-slate-900 ${
        isFullscreen ? "h-screen w-screen rounded-none fixed inset-0 z-[9999]" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Top Floating Control Bar: Search & Modes */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 px-3 py-1.5 w-full sm:w-72 max-w-full text-xs"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="गांव, कस्बा, पिन कोड या निर्देशांक..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-xs font-medium"
          />
          {searching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 shrink-0" />
          ) : (
            <button
              type="submit"
              className="ml-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 shrink-0"
            >
              खोजें
            </button>
          )}
        </form>

        {/* Mode Switcher Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              if (walkingState === "walking") pauseGpsWalking();
              setMode("draw");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "draw"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            सीमा बनाएं
          </button>
          <button
            type="button"
            onClick={() => {
              if (walkingState === "idle") startGpsWalking();
              else setMode("walk");
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "walk"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            चलकर नापें
          </button>
          {onSaveLocationPin && (
            <button
              type="button"
              onClick={() => {
                const targetPos =
                  userGpsPos ||
                  (coords.length > 0
                    ? coords[0]
                    : focusCenter
                    ? { lat: focusCenter[0], lng: focusCenter[1] }
                    : { lat: defaultCenter[0], lng: defaultCenter[1] });
                onSaveLocationPin(targetPos);
              }}
              title="खेत की लोकेशन सहेजें (Save Field Location)"
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लोकेशन सहेजें</span>
            </button>
          )}
        </div>
      </div>

      {/* Search notification pill */}
      {searchMessage && (
        <div className="absolute top-16 left-3 right-3 sm:left-4 sm:w-auto z-[1000] pointer-events-none">
          <div className="bg-emerald-900/90 text-white px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-medium backdrop-blur-sm border border-emerald-500/30">
            {searchMessage}
          </div>
        </div>
      )}

      {/* Right Floating Map Toolbar */}
      <div className="absolute top-20 right-3 z-[1000] flex flex-col gap-2">
        {/* Layer Selector */}
        <div className="relative group">
          <button
            type="button"
            title="नक्शा प्रकार बदलें"
            className="w-9 h-9 bg-white/95 hover:bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition active:scale-95"
            onClick={() => {
              const types: MapLayerType[] = ["satellite", "hybrid", "osm", "google_hybrid"];
              const nextIndex = (types.indexOf(layerType) + 1) % types.length;
              setLayerType(types[nextIndex]);
            }}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
          </button>
          <span className="absolute right-11 top-2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {layerType === "satellite"
              ? "सैटेलाइट"
              : layerType === "hybrid"
              ? "हाइब्रिड"
              : layerType === "google_hybrid"
              ? "गूगल हाइब्रिड"
              : "सामान्य नक्शा"}
          </span>
        </div>

        {/* Locate Me */}
        <button
          type="button"
          onClick={() => handleLocateMe(false)}
          title="मेरी लोकेशन पर जाएं (Locate My Farm)"
          className="w-9 h-9 bg-white/95 hover:bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition active:scale-95"
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <Crosshair className="w-4 h-4 text-blue-600" />
          )}
        </button>

        {/* Zoom to Field */}
        {coords.length >= 2 && (
          <button
            type="button"
            onClick={() => setTriggerFitBounds((v) => v + 1)}
            title="पूरा खेत देखें (Zoom to Field)"
            className="w-9 h-9 bg-white/95 hover:bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition active:scale-95"
          >
            <ZoomIn className="w-4 h-4 text-emerald-700" />
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title="फुल स्क्रीन"
          className="w-9 h-9 bg-white/95 hover:bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition active:scale-95"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Drawing Toolbar (Draw Mode) */}
      {mode === "draw" && !readOnly && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-[1000] flex items-center justify-between sm:justify-end gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-gray-200 text-xs">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="पूर्ववत करें (Undo)"
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 font-semibold"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={future.length === 0}
            title="दोबारा करें (Redo)"
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 font-semibold"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redo</span>
          </button>

          {coords.length > 0 && (
            <button
              type="button"
              onClick={() => handleDeleteVertex(coords.length - 1)}
              title="अंतिम बिंदु हटाएं"
              className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>हटाएं</span>
            </button>
          )}

          {coords.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              title="पूरी सीमा साफ करें"
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>साफ करें</span>
            </button>
          )}
        </div>
      )}

      {/* GPS Walking Mode HUD Overlay */}
      {mode === "walk" && (
        <div className="absolute bottom-4 left-3 right-3 sm:max-w-md sm:mx-auto z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-blue-200">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <span className="text-xs font-bold text-blue-900">
                {walkingState === "walking"
                  ? "जीपीएस वॉकिंग सक्रिय (Recording Path)"
                  : walkingState === "paused"
                  ? "वॉकिंग रुकी हुई है (Paused)"
                  : "वॉकिंग समाप्त"}
              </span>
            </div>
            {gpsAccuracy !== null && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  gpsAccuracy <= 10
                    ? "bg-emerald-100 text-emerald-800"
                    : gpsAccuracy <= 20
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                सटीकता: ±{Math.round(gpsAccuracy)}m
              </span>
            )}
          </div>

          {gpsError && (
            <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-600 mb-3 px-1">
            <span>दर्ज कोने: <b className="text-gray-900">{walkPath.length}</b></span>
            <span>विधि: <b className="text-blue-700">मेड़ पर चलकर</b></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {walkingState === "walking" ? (
              <button
                type="button"
                onClick={pauseGpsWalking}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Pause className="w-3.5 h-3.5" />
                रोकें (Pause)
              </button>
            ) : (
              <button
                type="button"
                onClick={resumeGpsWalking}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5" />
                जारी रखें (Resume)
              </button>
            )}

            <button
              type="button"
              onClick={finishGpsWalking}
              disabled={walkPath.length < 3}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Check className="w-3.5 h-3.5" />
              सीमा पूरी करें ({walkPath.length}/3)
            </button>
          </div>
        </div>
      )}

      {/* Main React-Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <style>{`
          .leaflet-control-attribution { display: none !important; }
          .leaflet-bottom.leaflet-right { display: none !important; }
        `}</style>

        <MapController
          coords={coords}
          focusCenter={focusCenter}
          triggerFitBounds={triggerFitBounds}
        />

        <MapClickHandler
          onMapClick={handleMapClick}
          enabled={mode === "draw" && !readOnly}
        />

        {/* Tile Layers */}
        {layerType === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {layerType === "hybrid" && (
          <>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </>
        )}

        {layerType === "google_hybrid" && (
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        )}

        {layerType === "osm" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Drawn Polygon Layer */}
        {coords.length >= 3 && (
          <Polygon
            positions={coords.map((c) => [c.lat, c.lng])}
            pathOptions={{
              color: validation.valid ? "#059669" : "#dc2626",
              fillColor: validation.valid ? "#10b981" : "#ef4444",
              fillOpacity: validation.valid ? 0.35 : 0.45,
              weight: 3,
              dashArray: validation.valid ? undefined : "6, 6",
            }}
          />
        )}

        {/* Polygon Polyline for 2 points */}
        {coords.length === 2 && (
          <Polyline
            positions={coords.map((c) => [c.lat, c.lng])}
            pathOptions={{ color: "#059669", weight: 3, dashArray: "4, 4" }}
          />
        )}

        {/* Draggable Vertex Markers */}
        {coords.map((c, index) => (
          <Marker
            key={`vertex-${index}`}
            position={[c.lat, c.lng]}
            icon={createVertexIcon(index, index === 0)}
            draggable={!readOnly && mode === "draw"}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleDragVertex(index, position.lat, position.lng);
              },
            }}
          >
            {!readOnly && (
              <Popup>
                <div className="text-center p-1">
                  <div className="text-xs font-bold text-gray-800 mb-1">
                    #{index + 1}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2">
                    {c.lat.toFixed(6)}, {c.lng.toFixed(6)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteVertex(index)}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow"
                  >
                    हटाएं
                  </button>
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        {/* GPS Walking Path */}
        {walkPath.length >= 2 && (
          <Polyline
            positions={walkPath.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "#2563eb", weight: 4 }}
          />
        )}

        {/* GPS User Position Marker & Accuracy Circle */}
        {userGpsPos && (
          <>
            <Marker position={[userGpsPos.lat, userGpsPos.lng]} icon={userLocationIcon} />
            {gpsAccuracy && gpsAccuracy < 60 && (
              <Circle
                center={[userGpsPos.lat, userGpsPos.lng]}
                radius={gpsAccuracy}
                pathOptions={{
                  fillColor: "#3b82f6",
                  fillOpacity: 0.15,
                  color: "#2563eb",
                  weight: 1,
                }}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}
