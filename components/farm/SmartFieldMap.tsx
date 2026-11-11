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

export type MapViewCenter = {
  lat: number;
  lng: number;
  villageHint?: string;
};

export type SavedMapField = {
  id: string;
  name: string;
  boundary?: LatLng[];
};

export interface SmartFieldMapProps {
  initialCoords?: LatLng[];
  mode?: "draw" | "walk" | "view";
  onCoordsChange?: (coords: LatLng[]) => void;
  onViewCenter?: (center: MapViewCenter) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onSaveLocationPin?: (coords: LatLng) => void;
  onSavedFieldClick?: (fieldId: string) => void;
  savedFields?: SavedMapField[];
  height?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  readOnly?: boolean;
}

type PlaceHit = {
  lat: number;
  lon: number;
  label: string;
  village?: string;
};

// Marker icons
function createVertexIcon(index: number, isFirst: boolean = false) {
  return L.divIcon({
    className: "field-vertex-icon",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${isFirst ? "#059669" : "#10b981"};
        color: white;
        border: 2px solid ${isFirst ? "#f59e0b" : "#ffffff"};
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        pointer-events: auto;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const userLocationIcon = L.divIcon({
  className: "gps-user-pulse",
  html: `
    <div style="position:relative; width:18px; height:18px; pointer-events:none;">
      <div style="position:absolute; width:18px; height:18px; border-radius:50%; background:#2563eb; border:2.5px solid white; box-shadow:0 0 8px rgba(37,99,235,0.8); z-index:2; pointer-events:none;"></div>
      <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(37,99,235,0.25); top:-8px; left:-8px; animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite; pointer-events:none;"></div>
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

/** One-finger pan must move the map, not the page/sheet behind it. Pinch zoom stays on. */
function EnableMapPan() {
  const map = useMap();

  useEffect(() => {
    const el = map.getContainer();
    el.style.touchAction = "none";
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    L.DomEvent.disableScrollPropagation(el);

    const blockParentScroll = (event: TouchEvent) => {
      event.stopPropagation();
    };
    el.addEventListener("touchmove", blockParentScroll, { passive: true });

    const resize = () => map.invalidateSize({ animate: false });
    const t1 = window.setTimeout(resize, 80);
    const t2 = window.setTimeout(resize, 400);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    return () => {
      el.removeEventListener("touchmove", blockParentScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [map]);

  return null;
}

// Map Click Listener Component
function MapClickHandler({
  onMapClick,
  onNearVertexClick,
  enabled,
  coords,
  consumeIgnoredClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
  onNearVertexClick?: (index: number) => void;
  enabled: boolean;
  coords: LatLng[];
  consumeIgnoredClick?: () => boolean;
}) {
  const map = useMapEvents({
    click(e) {
      if (!enabled) return;
      if (consumeIgnoredClick?.()) return;
      const target = e.originalEvent?.target as HTMLElement | null;
      if (target?.closest?.(".field-vertex-icon, .gps-user-pulse, .leaflet-marker-icon")) {
        return;
      }
      const clickPt = map.latLngToContainerPoint(e.latlng);
      let nearest = -1;
      let nearestDist = Infinity;
      coords.forEach((c, i) => {
        const p = map.latLngToContainerPoint(L.latLng(c.lat, c.lng));
        const d = clickPt.distanceTo(p);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });
      // Fat-finger: tapping a numbered point should remove it, not add another.
      if (nearest >= 0 && nearestDist <= 28) {
        onNearVertexClick?.(nearest);
        return;
      }
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function SmartFieldMap({
  initialCoords = [],
  mode: initialMode = "draw",
  onCoordsChange,
  onViewCenter,
  onValidationChange,
  onSaveLocationPin,
  onSavedFieldClick,
  savedFields = [],
  height = "520px",
  defaultCenter = [27.502, 78.053], // Default Aligarh / UP Agricultural Belt
  defaultZoom = 16,
  readOnly = false,
}: SmartFieldMapProps) {
  const [coords, setCoords] = useState<LatLng[]>(initialCoords);
  const [mode, setMode] = useState<"draw" | "walk" | "view">(initialMode);
  const [layerType, setLayerType] = useState<MapLayerType>("google_hybrid");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [searchHits, setSearchHits] = useState<PlaceHit[]>([]);
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
  const onViewCenterRef = useRef(onViewCenter);
  onViewCenterRef.current = onViewCenter;
  const onCoordsChangeRef = useRef(onCoordsChange);
  onCoordsChangeRef.current = onCoordsChange;
  const coordsRef = useRef(coords);
  coordsRef.current = coords;
  const skipMapClickRef = useRef(false);
  const vertexDragRef = useRef(false);
  const locateGen = useRef(0);

  // Validation
  const validation = useMemo(() => validateFieldPolygon(coords), [coords]);

  useEffect(() => {
    onValidationChange?.(validation.valid, validation.error);
  }, [validation, onValidationChange]);

  const updateCoordinates = useCallback((newCoords: LatLng[], recordHistory: boolean = true) => {
    if (recordHistory) {
      setHistory((prev) => [...prev.slice(-25), coordsRef.current]);
      setFuture([]);
    }
    coordsRef.current = newCoords;
    setCoords(newCoords);
    if (newCoords.length) locateGen.current += 1;
    onCoordsChangeRef.current?.(newCoords);
  }, []);

  // Undo / Redo Actions
  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [coordsRef.current, ...f]);
    coordsRef.current = prev;
    setCoords(prev);
    onCoordsChangeRef.current?.(prev);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, coordsRef.current]);
    coordsRef.current = next;
    setCoords(next);
    onCoordsChangeRef.current?.(next);
  };

  const handleClear = () => {
    if (coordsRef.current.length === 0) return;
    if (window.confirm("क्या आप खेत की सभी सीमाएं साफ करना चाहते हैं? (Clear boundary?)")) {
      updateCoordinates([]);
      setWalkPath([]);
      setWalkingState("idle");
    }
  };

  const handleDeleteVertex = useCallback(
    (index: number) => {
      skipMapClickRef.current = true;
      const updated = coordsRef.current.filter((_, i) => i !== index);
      updateCoordinates(updated);
    },
    [updateCoordinates]
  );

  const handleDragVertex = (index: number, lat: number, lng: number) => {
    const updated = coordsRef.current.map((c, i) => (i === index ? { lat, lng } : c));
    updateCoordinates(updated, true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (skipMapClickRef.current) {
      skipMapClickRef.current = false;
      return;
    }
    if (readOnly || mode !== "draw") return;
    updateCoordinates([...coordsRef.current, { lat, lng }]);
  };

  const applyPlaceHit = (hit: PlaceHit) => {
    locateGen.current += 1;
    setFocusCenter([hit.lat, hit.lon]);
    onViewCenterRef.current?.({
      lat: hit.lat,
      lng: hit.lon,
      villageHint: hit.village,
    });
    setSearchQuery(hit.village || hit.label.split(",")[0] || "");
    setSearchHits([]);
    setSearchMessage(`गांव मिला: ${hit.label.split(",").slice(0, 3).join(",")}`);
  };

  const lookupPlaces = useCallback(async (raw: string): Promise<PlaceHit[]> => {
    const query = raw.trim();
    if (query.length < 2) return [];

    const coordMatch = query.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return [{ lat, lon: lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }];
      }
    }

    const q = /india|भारत/i.test(query) ? query : `${query}, India`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&limit=6&q=${encodeURIComponent(q)}`,
      { headers: { "Accept-Language": "hi,en" } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((row: {
      lat?: string;
      lon?: string;
      display_name?: string;
      address?: {
        village?: string;
        hamlet?: string;
        town?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
      };
    }) => {
      const addr = row.address || {};
      const village =
        addr.village || addr.hamlet || addr.town || addr.suburb || addr.city || "";
      const parts = [village || row.display_name?.split(",")[0], addr.county, addr.state].filter(Boolean);
      return {
        lat: parseFloat(row.lat || "0"),
        lon: parseFloat(row.lon || "0"),
        label: parts.join(", ") || String(row.display_name || ""),
        village: village || undefined,
      };
    });
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchHits([]);
      return;
    }
    const timer = window.setTimeout(() => {
      void (async () => {
        setSearching(true);
        try {
          setSearchHits(await lookupPlaces(query));
        } catch {
          setSearchHits([]);
        } finally {
          setSearching(false);
        }
      })();
    }, 320);
    return () => window.clearTimeout(timer);
  }, [searchQuery, lookupPlaces]);

  // Search by village / PIN / coordinates
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearching(true);
    setSearchMessage(null);
    try {
      const hits = searchHits.length ? searchHits : await lookupPlaces(query);
      if (hits.length) {
        applyPlaceHit(hits[0]);
      } else {
        setSearchMessage("गांव नहीं मिला। पिन कोड या ज़िला नाम भी लिखें।");
      }
    } catch {
      setSearchMessage("स्थान खोजने में त्रुटि हुई।");
    } finally {
      setSearching(false);
    }
  };

  // GPS Locate Me (Resilient Multi-Tier Location Resolver)
  const handleLocateMe = useCallback(async (isAuto = false) => {
    const gen = ++locateGen.current;
    setLocating(true);
    setSearchMessage(null);

    const applyLocation = (lat: number, lng: number, accuracy?: number) => {
      if (locateGen.current !== gen) return;
      setFocusCenter([lat, lng]);
      setUserGpsPos({ lat, lng });
      onViewCenterRef.current?.({ lat, lng });
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

  // Center quietly only if GPS permission is already granted — never pop a
  // system dialog over the status bar / search field on open.
  useEffect(() => {
    let cancelled = false;
    const maybeCenter = async () => {
      try {
        const nav = navigator as Navigator & {
          permissions?: { query: (d: { name: string }) => Promise<{ state: string }> };
        };
        const status = await nav.permissions?.query({ name: "geolocation" });
        if (!cancelled && status?.state === "granted") {
          void handleLocateMe(true);
        }
      } catch {
        /* farmer can tap locate */
      }
    };
    void maybeCenter();
    return () => {
      cancelled = true;
    };
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
      {/* Top Floating Control Bar: Search & Modes — below Android status / network icons */}
      <div
        className="absolute left-3 right-3 z-[1000] flex flex-wrap items-start justify-between gap-2 pointer-events-none"
        style={{
          top: isFullscreen
            ? "max(12px, calc(env(safe-area-inset-top, 0px) + 10px))"
            : "12px",
        }}
      >
        {/* Search Bar */}
        <div className="pointer-events-auto relative w-full sm:w-80 max-w-full">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2 text-xs"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="गाँव का नाम लिखें…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-[13px] font-medium"
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
        {searchHits.length > 0 ? (
          <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-[1001] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            {searchHits.map((hit) => (
              <li key={`${hit.lat}-${hit.lon}-${hit.label}`}>
                <button
                  type="button"
                  onClick={() => applyPlaceHit(hit)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-emerald-50"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-bold text-gray-900">
                      {hit.village || hit.label.split(",")[0]}
                    </span>
                    <span className="block truncate text-[10px] text-gray-500">{hit.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        </div>

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
                const targetPos = focusCenter
                  ? { lat: focusCenter[0], lng: focusCenter[1] }
                  : coords.length > 0
                    ? coords[coords.length - 1]
                    : userGpsPos || {
                        lat: defaultCenter[0],
                        lng: defaultCenter[1],
                      };
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
        <div
          className="absolute left-3 right-3 sm:left-4 sm:w-auto z-[1000] pointer-events-none"
          style={{
            top: isFullscreen
              ? "max(4.75rem, calc(env(safe-area-inset-top, 0px) + 4.25rem))"
              : "4.75rem",
          }}
        >
          <div className="bg-emerald-900/90 text-white px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-medium backdrop-blur-sm border border-emerald-500/30">
            {searchMessage}
          </div>
        </div>
      )}

      {/* Right Floating Map Toolbar */}
      <div
        className="absolute right-3 z-[1000] flex flex-col gap-2"
        style={{
          top: isFullscreen
            ? "max(5.5rem, calc(env(safe-area-inset-top, 0px) + 5rem))"
            : "5.5rem",
        }}
      >
        {/* Layer Selector */}
        <div className="relative group">
          <button
            type="button"
            title="नक्शा प्रकार बदलें"
            className="w-9 h-9 bg-white/95 hover:bg-white text-gray-700 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition active:scale-95"
            onClick={() => {
              const types: MapLayerType[] = ["google_hybrid", "hybrid", "osm", "satellite"];
              const nextIndex = (types.indexOf(layerType) + 1) % types.length;
              setLayerType(types[nextIndex]);
            }}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
          </button>
          <span className="absolute right-11 top-2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {layerType === "google_hybrid"
              ? "गाँव के नाम"
              : layerType === "hybrid"
              ? "नाम + सैटेलाइट"
              : layerType === "satellite"
              ? "सैटेलाइट"
              : "सड़क नक्शा"}
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

      {savedFields.some((field) => (field.boundary?.length ?? 0) >= 3) ? (
        <div className="absolute bottom-[4.25rem] left-3 right-3 z-[900] pointer-events-none sm:left-auto sm:right-16 sm:w-auto">
          <p className="rounded-xl bg-amber-950/85 px-3 py-1.5 text-[10.5px] font-semibold text-amber-50 shadow">
            पीला खेत पहले से सेव है — टैप करके खोलें, खाली ज़मीन पर नया बनाएं
          </p>
        </div>
      ) : null}

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
              title="आखिरी बिंदु हटाएं — नंबर पर टैप करके भी हटा सकते हैं"
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
        dragging
        touchZoom
        scrollWheelZoom
        doubleClickZoom
        className="h-full w-full z-0"
      >
        <style>{`
          .leaflet-control-attribution { display: none !important; }
          .leaflet-bottom.leaflet-right { display: none !important; }
          .gps-user-pulse { pointer-events: none !important; }
          .field-vertex-icon { z-index: 650 !important; }
          .leaflet-container {
            touch-action: none !important;
            -ms-touch-action: none !important;
            overscroll-behavior: none;
            cursor: grab;
          }
          .leaflet-container:active { cursor: grabbing; }
          .leaflet-container .leaflet-tile {
            pointer-events: none;
            -webkit-user-drag: none !important;
            user-drag: none;
          }
        `}</style>

        <EnableMapPan />

        <MapController
          coords={coords}
          focusCenter={focusCenter}
          triggerFitBounds={triggerFitBounds}
        />

        <MapClickHandler
          onMapClick={handleMapClick}
          onNearVertexClick={handleDeleteVertex}
          enabled={mode === "draw" && !readOnly}
          coords={coords}
          consumeIgnoredClick={() => {
            if (!skipMapClickRef.current) return false;
            skipMapClickRef.current = false;
            return true;
          }}
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

        {savedFields.map((field) => {
          const boundary = field.boundary;
          if (!boundary || boundary.length < 3) return null;
          return (
            <Polygon
              key={field.id}
              positions={boundary.map((c) => [c.lat, c.lng])}
              pathOptions={{
                color: "#f59e0b",
                fillColor: "#fbbf24",
                fillOpacity: 0.22,
                weight: 2,
                dashArray: "5, 4",
              }}
              eventHandlers={{
                click: (event) => {
                  L.DomEvent.stopPropagation(event);
                  onSavedFieldClick?.(field.id);
                },
              }}
            >
              <Popup>
                <div className="px-1 py-0.5 text-center">
                  <p className="text-[12px] font-bold text-gray-900">{field.name}</p>
                  <p className="text-[10px] text-gray-500">सहेजा हुआ खेत · टैप करके खोलें</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

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

        {/* GPS Walking Path */}
        {walkPath.length >= 2 && (
          <Polyline
            positions={walkPath.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "#2563eb", weight: 4 }}
          />
        )}

        {/* GPS pulse must not steal taps from numbered field points */}
        {userGpsPos && (
          <>
            {gpsAccuracy && gpsAccuracy < 60 && (
              <Circle
                center={[userGpsPos.lat, userGpsPos.lng]}
                radius={gpsAccuracy}
                interactive={false}
                pathOptions={{
                  fillColor: "#3b82f6",
                  fillOpacity: 0.15,
                  color: "#2563eb",
                  weight: 1,
                }}
              />
            )}
            <Marker
              position={[userGpsPos.lat, userGpsPos.lng]}
              icon={userLocationIcon}
              interactive={false}
              keyboard={false}
            />
          </>
        )}

        {/* Draggable Vertex Markers — last so they sit above the GPS pulse */}
        {coords.map((c, index) => (
          <Marker
            key={`vertex-${index}`}
            position={[c.lat, c.lng]}
            icon={createVertexIcon(index, index === 0)}
            draggable={!readOnly && mode === "draw"}
            autoPanOnFocus={false}
            eventHandlers={{
              click: (e) => {
                if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
                skipMapClickRef.current = true;
                if (readOnly || mode !== "draw" || vertexDragRef.current) return;
                handleDeleteVertex(index);
              },
              dragstart: () => {
                vertexDragRef.current = true;
                skipMapClickRef.current = true;
              },
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleDragVertex(index, position.lat, position.lng);
                window.setTimeout(() => {
                  vertexDragRef.current = false;
                  skipMapClickRef.current = false;
                }, 280);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
