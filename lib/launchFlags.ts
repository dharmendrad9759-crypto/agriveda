import { readStorage, writeStorage } from "@/lib/storage";

const INTRO_KEY = "agriveda-intro-carousel-v2";

/** Swipe intro finished once — never show again on this device. */
export function introDone(): boolean {
  return readStorage<boolean>(INTRO_KEY, false) === true;
}

export function markIntroDone(): void {
  writeStorage(INTRO_KEY, true);
}
