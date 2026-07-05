import { readStorage, writeStorage } from "@/lib/storage";
import { randomId } from "@/lib/randomId";

const DEVICE_ID_KEY = "agriveda-device-id";

/** Stable anonymous device id — stored on first app load */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = readStorage<string | null>(DEVICE_ID_KEY, null);
  if (!id) {
    id = randomId();
    writeStorage(DEVICE_ID_KEY, id);
  }
  return id;
}

export function hasDeviceId(): boolean {
  if (typeof window === "undefined") return false;
  return readStorage<string | null>(DEVICE_ID_KEY, null) !== null;
}
