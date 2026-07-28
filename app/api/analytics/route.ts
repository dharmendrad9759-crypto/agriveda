import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Accepts lightweight analytics / bug events.
 * Persists nothing sensitive — logs for ops; client also keeps a local buffer.
 */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`analytics:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      props?: Record<string, unknown>;
      t?: string;
    };
    if (!body?.name || typeof body.name !== "string") {
      return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
    }
    // Trim noise — never log PII fields if accidentally sent
    const safeProps = { ...(body.props ?? {}) };
    delete safeProps.phone;
    delete safeProps.token;
    delete safeProps.password;

    console.info("[analytics]", body.name, safeProps, body.t ?? "");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
