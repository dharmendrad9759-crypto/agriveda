/**
 * High-Precision Geodesic Agricultural Field Math & Geometry Library
 *
 * Implements:
 * - WGS84 spherical excess polygon area (square meters, acres, hectares)
 * - Haversine geodesic perimeter
 * - Line-segment self-intersection detection
 * - GeoJSON Polygon standard formatting (WGS84 [lng, lat])
 * - Regional Bigha conversion integration
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface FieldMeasurement {
  sqMeters: number;
  acres: number;
  hectares: number;
  perimeterMeters: number;
  bigha?: {
    value: number;
    label: string;
    note: string;
  };
}

export interface GeoJsonPolygonGeometry {
  type: "Polygon";
  coordinates: [number, number][][]; // [ [lng, lat], [lng, lat], ... closed loop ]
}

const WGS84_RADIUS_METERS = 6378137.0;
export const ACRE_TO_SQ_METERS = 4046.8564224;
export const HECTARE_TO_SQ_METERS = 10000.0;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

/**
 * Calculates geodesic area of a polygon on WGS84 sphere using Chamberlain-Duquette algorithm.
 * Returns absolute area in square meters.
 */
export function calculateGeodesicArea(coords: LatLng[]): number {
  if (!coords || coords.length < 3) return 0;

  let total = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];

    const lambda1 = toRadians(p1.lng);
    const lambda2 = toRadians(p2.lng);
    const phi1 = toRadians(p1.lat);
    const phi2 = toRadians(p2.lat);

    total += (lambda2 - lambda1) * (2 + Math.sin(phi1) + Math.sin(phi2));
  }

  const areaSqMeters = Math.abs((total * WGS84_RADIUS_METERS * WGS84_RADIUS_METERS) / 2.0);
  return areaSqMeters;
}

/**
 * Great-circle distance between two points in meters using the Haversine formula.
 */
export function haversineDistanceMeters(p1: LatLng, p2: LatLng): number {
  const dLat = toRadians(p2.lat - p1.lat);
  const dLng = toRadians(p2.lng - p1.lng);
  const lat1 = toRadians(p1.lat);
  const lat2 = toRadians(p2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return WGS84_RADIUS_METERS * c;
}

/**
 * Calculates the total perimeter of a polygon in meters.
 */
export function calculateGeodesicPerimeter(coords: LatLng[]): number {
  if (!coords || coords.length < 2) return 0;

  let total = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    total += haversineDistanceMeters(p1, p2);
  }

  return total;
}

/**
 * Checks whether two 2D line segments (p1-p2 and p3-p4) intersect.
 */
function ccw(p1: LatLng, p2: LatLng, p3: LatLng): number {
  return (p2.lng - p1.lng) * (p3.lat - p1.lat) - (p2.lat - p1.lat) * (p3.lng - p1.lng);
}

function segmentsIntersect(p1: LatLng, p2: LatLng, p3: LatLng, p4: LatLng): boolean {
  const ccw1 = ccw(p1, p2, p3);
  const ccw2 = ccw(p1, p2, p4);
  const ccw3 = ccw(p3, p4, p1);
  const ccw4 = ccw(p3, p4, p2);

  return (
    ((ccw1 > 0 && ccw2 < 0) || (ccw1 < 0 && ccw2 > 0)) &&
    ((ccw3 > 0 && ccw4 < 0) || (ccw3 < 0 && ccw4 > 0))
  );
}

/**
 * Tests if any non-adjacent edges of the polygon intersect (self-intersection).
 */
export function isPolygonSelfIntersecting(coords: LatLng[]): boolean {
  const n = coords.length;
  if (n < 4) return false;

  for (let i = 0; i < n; i++) {
    const a1 = coords[i];
    const a2 = coords[(i + 1) % n];

    // Check against other non-adjacent edges
    for (let j = i + 1; j < n; j++) {
      // Skip adjacent edges
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) {
        continue;
      }

      const b1 = coords[j];
      const b2 = coords[(j + 1) % n];

      if (segmentsIntersect(a1, a2, b1, b2)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validates a field polygon before saving or calculating final area.
 */
export function validateFieldPolygon(coords: LatLng[]): { valid: boolean; error?: string } {
  if (!coords || coords.length < 3) {
    return {
      valid: false,
      error: "खेत की सीमा के लिए कम से कम 3 कोने (Points) होने आवश्यक हैं।",
    };
  }

  // Check for duplicate consecutive points
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    if (Math.abs(p1.lat - p2.lat) < 1e-7 && Math.abs(p1.lng - p2.lng) < 1e-7) {
      return {
        valid: false,
        error: "एक ही स्थान पर दो कोने दर्ज हैं, कृपया अलग-अलग कोने चुनें।",
      };
    }
  }

  if (isPolygonSelfIntersecting(coords)) {
    return {
      valid: false,
      error: "खेत की सीमा रेखाएं आपस में कट (Self-intersect) रही हैं। कृपया सीधी सीमा बनाएं।",
    };
  }

  const area = calculateGeodesicArea(coords);
  if (area < 10) {
    // Under 10 sq meters is too tiny to be a realistic field
    return {
      valid: false,
      error: "खेत का क्षेत्रफल बहुत छोटा है (कम से कम 10 वर्ग मीटर होना चाहिए)।",
    };
  }

  return { valid: true };
}

/**
 * Calculates complete measurements for display: Acres, Hectares, Sq Meters, Perimeter.
 */
export function getFieldMeasurement(
  coords: LatLng[],
  bighaAcresPerUnit?: number,
  bighaLabel?: string,
  bighaNote?: string
): FieldMeasurement {
  const sqMeters = calculateGeodesicArea(coords);
  const acres = sqMeters / ACRE_TO_SQ_METERS;
  const hectares = sqMeters / HECTARE_TO_SQ_METERS;
  const perimeterMeters = calculateGeodesicPerimeter(coords);

  let bigha: FieldMeasurement["bigha"];
  if (bighaAcresPerUnit && bighaAcresPerUnit > 0) {
    bigha = {
      value: acres / bighaAcresPerUnit,
      label: bighaLabel || "बीघा",
      note: bighaNote || `1 बीघा = ${bighaAcresPerUnit} एकड़`,
    };
  }

  return {
    sqMeters: Math.round(sqMeters * 10) / 10,
    acres: Math.round(acres * 1000) / 1000,
    hectares: Math.round(hectares * 1000) / 1000,
    perimeterMeters: Math.round(perimeterMeters * 10) / 10,
    bigha,
  };
}

/**
 * Converts internal LatLng list into a standard WGS84 GeoJSON Polygon.
 */
export function coordsToGeoJsonPolygon(coords: LatLng[]): GeoJsonPolygonGeometry {
  if (!coords || coords.length === 0) {
    return { type: "Polygon", coordinates: [[]] };
  }

  // GeoJSON coordinate order is [longitude, latitude]
  const ring: [number, number][] = coords.map((c) => [c.lng, c.lat]);

  // Ensure ring is closed (first point equals last point)
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return {
    type: "Polygon",
    coordinates: [ring],
  };
}

/**
 * Parses GeoJSON Polygon back into internal LatLng coordinate list.
 */
export function geoJsonPolygonToCoords(geoJson?: GeoJsonPolygonGeometry | null): LatLng[] {
  if (!geoJson || !geoJson.coordinates || !geoJson.coordinates[0]) return [];
  const ring = geoJson.coordinates[0];
  if (ring.length === 0) return [];

  // Exclude duplicate closing point if present
  const points = ring.map(([lng, lat]) => ({ lat, lng }));
  if (
    points.length > 3 &&
    points[0].lat === points[points.length - 1].lat &&
    points[0].lng === points[points.length - 1].lng
  ) {
    points.pop();
  }

  return points;
}

/**
 * Calculates geographical center (centroid) of polygon.
 */
export function getPolygonCenter(coords: LatLng[]): LatLng {
  if (!coords || coords.length === 0) return { lat: 23.2599, lng: 77.4126 }; // Central India default

  let sumLat = 0;
  let sumLng = 0;
  for (const c of coords) {
    sumLat += c.lat;
    sumLng += c.lng;
  }

  return {
    lat: sumLat / coords.length,
    lng: sumLng / coords.length,
  };
}

/**
 * Calculates bounding box [[minLat, minLng], [maxLat, maxLng]] for map zoom/fitting.
 */
export function getPolygonBoundingBox(coords: LatLng[]): [[number, number], [number, number]] {
  if (!coords || coords.length === 0) {
    return [
      [20, 75],
      [25, 80],
    ];
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const c of coords) {
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lng < minLng) minLng = c.lng;
    if (c.lng > maxLng) maxLng = c.lng;
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
