import { NextRequest, NextResponse } from "next/server";

/** Server-side spray log receiver — persists to in-memory store for demo; replace with DB */
const serverLogs: unknown[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.id || !body?.productId || !body?.sprayDate) {
      return NextResponse.json({ error: "Invalid spray log" }, { status: 400 });
    }
    serverLogs.push({ ...body, receivedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, id: body.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ count: serverLogs.length, logs: serverLogs.slice(-20) });
}
