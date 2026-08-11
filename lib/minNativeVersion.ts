import { NextRequest, NextResponse } from "next/server";

export const NATIVE_HEADER_PLATFORM = "x-app-platform";
export const NATIVE_HEADER_BUILD = "x-app-build";
export const NATIVE_HEADER_VERSION = "x-app-version";

/** Server min Android versionCode. 0 / unset = no force-update. */
export function minNativeVersionCode(): number {
  const raw = process.env.MIN_NATIVE_VERSION_CODE?.trim();
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function parseNativeBuildHeader(req: NextRequest): number | null {
  const platform = req.headers.get(NATIVE_HEADER_PLATFORM)?.trim().toLowerCase();
  if (platform !== "android") return null;
  const buildRaw = req.headers.get(NATIVE_HEADER_BUILD)?.trim();
  if (!buildRaw) return null;
  const build = Number.parseInt(buildRaw, 10);
  return Number.isFinite(build) && build > 0 ? build : null;
}

/** Web clients (no android platform header) are allowed. */
export function rejectIfNativeAppTooOld(req: NextRequest): NextResponse | null {
  const min = minNativeVersionCode();
  if (min <= 0) return null;

  const platform = req.headers.get(NATIVE_HEADER_PLATFORM)?.trim().toLowerCase();
  if (platform !== "android") return null;

  const build = parseNativeBuildHeader(req);
  if (build == null || build < min) {
    return NextResponse.json(
      {
        error: "नया ऐप संस्करण ज़रूरी है — कृपया अपडेट करें",
        code: "FORCE_UPDATE",
        minVersionCode: min,
      },
      { status: 426 }
    );
  }
  return null;
}
