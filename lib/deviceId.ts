import { readStorage, writeStorage } from "@/lib/storage";
import { randomId } from "@/lib/randomId";
import { isValidDeviceId } from "@/lib/deviceIdValidate";

const DEVICE_ID_KEY = "agriveda-device-id";

/** Stable anonymous device id — stored on first app load */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = readStorage<string | null>(DEVICE_ID_KEY, null);
  if (!id || !isValidDeviceId(id)) {
    id = randomId();
    // Prefer UUID; reject unsafe legacy ids that could break auth filters
    if (!isValidDeviceId(id)) {
      id = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    }
    writeStorage(DEVICE_ID_KEY, id);
  }
  return id;
}

export function hasDeviceId(): boolean {
  if (typeof window === "undefined") return false;
  const id = readStorage<string | null>(DEVICE_ID_KEY, null);
  return Boolean(id && isValidDeviceId(id));
}
