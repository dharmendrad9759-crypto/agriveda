import { NextRequest, NextResponse } from "next/server";
import { normalizePincodeDistrict, normalizePincodeState } from "@/lib/pincodeLookup";

export const dynamic = "force-dynamic";

interface PostalOffice {
  District?: string;
  State?: string;
  Block?: string;
  Name?: string;
}

export async function GET(request: NextRequest) {
  const pin = request.nextUrl.searchParams.get("pin")?.replace(/\D/g, "").slice(0, 6);
  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: "Valid 6-digit PIN required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("upstream-fail");
    const data = (await res.json()) as {
      Status?: string;
      PostOffice?: PostalOffice[];
    };
    if (data.Status !== "Success" || !data.PostOffice?.length) {
      return NextResponse.json({ error: "PIN not found" }, { status: 404 });
    }
    const office = data.PostOffice[0];
    const district = normalizePincodeDistrict(office.District ?? "");
    const state = normalizePincodeState(office.State ?? "");
    return NextResponse.json({
      pincode: pin,
      district,
      state,
      block: office.Block ?? office.Name,
    });
  } catch {
    return NextResponse.json({ error: "PIN lookup unavailable" }, { status: 503 });
  }
}
