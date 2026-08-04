import { NextRequest, NextResponse } from "next/server";
import { scrubAnalyticsProps } from "@/lib/privacySanitize";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Optional product events — no DB write, no ads network.
 * Privacy-first: scrub PII; production logs only event name.
 */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = await rateLimit(`analytics:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      props?: Record<string, unknown>;
      t?: string;
    };
    if (!body?.name || typeof body.name !== "string" || body.name.length > 64) {
      return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
    }

    const safeProps = scrubAnalyticsProps(body.props);
    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", body.name.slice(0, 64), safeProps ?? {}, body.t ?? "");
    } else {
      // Production: event name only — no props dump
      console.info("[analytics]", body.name.slice(0, 64));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
