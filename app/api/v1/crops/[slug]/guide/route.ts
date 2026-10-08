import { NextResponse } from "next/server";
import { getCropGuideBySlug } from "@/lib/crops/cropGuideData";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/crops/[slug]/guide
 * Returns nested Crop Guide (Fasal Pustika) JSON data:
 * - 4 Stages: Shuruat, Lagana, Dekhbhal, Suraksha
 * - Pests & Diseases with FRAC / IRAC technical mapping, dosage, volume, organic controls
 */
export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const cleanSlug = (slug || "tomato").toLowerCase().trim();
    const guideData = getCropGuideBySlug(cleanSlug);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: guideData,
    });
  } catch (error) {
    console.error("[CROP_GUIDE_API_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Failed to fetch Crop Guide data",
      },
      { status: 500 }
    );
  }
}
