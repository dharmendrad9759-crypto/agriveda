import { notFound } from "next/navigation";
import ThreatDetailClient from "@/components/pest-diseases/ThreatDetailClient";
import { getThreatDetail } from "@/lib/pest-disease-catalog";
import type { ThreatType } from "@/types/pest-disease-ui";

interface PageProps {
  params: Promise<{ cropSlug: string; threatType: string; threatId: string }>;
}

const VALID_TYPES: ThreatType[] = ["pest", "disease", "weed"];

export default async function ThreatDetailPage({ params }: PageProps) {
  const { cropSlug, threatType, threatId } = await params;

  if (!VALID_TYPES.includes(threatType as ThreatType)) {
    notFound();
  }

  const threat = getThreatDetail(cropSlug, threatType as ThreatType, threatId);

  if (!threat) {
    notFound();
  }

  return <ThreatDetailClient threat={threat} />;
}
