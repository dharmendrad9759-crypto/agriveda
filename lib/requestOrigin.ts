import { NextRequest, NextResponse } from "next/server";
import { isProductionRuntime } from "@/lib/runtimeEnv";

function extraAllowedOrigins(): Set<string> {
  const set = new Set<string>();
  for (const raw of [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.CAPACITOR_SERVER_URL,
  ]) {
    const v = raw?.trim();
    if (!v) continue;
    try {
      set.add(new URL(v).origin);
    } catch {
      /* ignore */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) set.add(`https://${vercel.replace(/^https?:\/\//, "")}`);
  return set;
}

/** Block cross-site mutating requests even if a cookie leaked. */
export function rejectForeignOrigin(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return null;

  const origin = req.headers.get("origin")?.trim();
  if (!origin) return null;

  try {
    const o = new URL(origin);
    if (o.host === req.nextUrl.host) return null;
    if (extraAllowedOrigins().has(o.origin)) return null;
  } catch {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  if (!isProductionRuntime()) {
    try {
      const o = new URL(origin);
      if (o.hostname === "localhost" || o.hostname === "127.0.0.1") return null;
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}
