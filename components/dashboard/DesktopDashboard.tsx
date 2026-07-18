"use client";

import AgriVedaHome from "@/components/dashboard/AgriVedaHome";

/** Home dashboard — mobile-first AgriVeda experience (desktop inherits same layout). */
export default function DesktopDashboard({ embedded: _embedded = false }: { embedded?: boolean } = {}) {
  void _embedded;
  return <AgriVedaHome />;
}
