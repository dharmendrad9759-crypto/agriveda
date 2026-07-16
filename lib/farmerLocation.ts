import { requestUserLocation, geolocationErrorMessage } from "@/lib/weatherApi";
import { saveWeatherLocation } from "@/lib/sprayWeatherApi";

const STATUS_KEY = "agriveda-loc-permission-v1";

export type LocationPermissionStatus = "granted" | "denied" | "unknown";

export function getLocationPermissionStatus(): LocationPermissionStatus {
  if (typeof window === "undefined") return "unknown";
  try {
    const v = localStorage.getItem(STATUS_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* ignore */
  }
  return "unknown";
}

export function setLocationPermissionStatus(status: LocationPermissionStatus) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATUS_KEY, status);
  } catch {
    /* ignore */
  }
}

export interface ResolvedFarmerLocation {
  lat: number;
  lon: number;
  state: string;
  district: string;
  displayName: string;
}

/** Request GPS, save for weather, reverse-geocode to state/district. */
export async function resolveFarmerLocationFromGps(): Promise<ResolvedFarmerLocation> {
  const pos = await requestUserLocation();
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  saveWeatherLocation({ type: "gps", lat, lon });
  setLocationPermissionStatus("granted");

  let state = "";
  let district = "";
  let displayName = "";

  try {
    const res = await fetch(`/api/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
    if (res.ok) {
      const data = (await res.json()) as {
        state?: string;
        district?: string;
        displayName?: string;
      };
      state = data.state ?? "";
      district = data.district ?? "";
      displayName = data.displayName ?? "";
    }
  } catch {
    /* coords still usable for weather */
  }

  return { lat, lon, state, district, displayName };
}

export function locationFlowErrorMessage(err: unknown): string {
  setLocationPermissionStatus("denied");
  return geolocationErrorMessage(err);
}
