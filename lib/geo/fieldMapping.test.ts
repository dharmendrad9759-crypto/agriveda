import { describe, it, expect } from "vitest";
import {
  LatLng,
  calculateGeodesicArea,
  calculateGeodesicPerimeter,
  isPolygonSelfIntersecting,
  validateFieldPolygon,
  coordsToGeoJsonPolygon,
  geoJsonPolygonToCoords,
  getFieldMeasurement,
  haversineDistanceMeters,
  ACRE_TO_SQ_METERS,
  HECTARE_TO_SQ_METERS,
} from "./fieldGeometry";
import { REGIONAL_BIGHA_OPTIONS, getBighaInfo } from "@/lib/bighaConversion";

describe("Smart Field Mapping & Land Area Measurement System", () => {
  // Test 1: Real GPS Field in Western UP (Aligarh / Hathras)
  const realFarmCoords: LatLng[] = [
    { lat: 27.89215, lng: 78.07123 },
    { lat: 27.89218, lng: 78.07325 },
    { lat: 27.89035, lng: 78.07328 },
    { lat: 27.89032, lng: 78.07125 },
  ];

  it("calculates real-world field area, perimeter and dimensions", () => {
    const areaSqM = calculateGeodesicArea(realFarmCoords);
    const perimeterM = calculateGeodesicPerimeter(realFarmCoords);

    expect(areaSqM).toBeGreaterThan(35000);
    expect(areaSqM).toBeLessThan(45000);
    expect(perimeterM).toBeGreaterThan(700);
    expect(perimeterM).toBeLessThan(900);

    const acres = areaSqM / ACRE_TO_SQ_METERS;
    expect(acres).toBeGreaterThan(8.5);
    expect(acres).toBeLessThan(10.5);
  });

  it("accurately detects self-intersecting (figure-8 / butterfly) invalid polygons", () => {
    // Bowtie polygon with crossing diagonals
    const crossingCoords: LatLng[] = [
      { lat: 27.0, lng: 78.0 },
      { lat: 27.01, lng: 78.01 },
      { lat: 27.0, lng: 78.01 },
      { lat: 27.01, lng: 78.0 },
    ];

    expect(isPolygonSelfIntersecting(crossingCoords)).toBe(true);

    const validation = validateFieldPolygon(crossingCoords);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain("आपस में कट");
  });

  it("properly converts coordinates to GeoJSON Polygon format and back", () => {
    const geoJson = coordsToGeoJsonPolygon(realFarmCoords);

    expect(geoJson.type).toBe("Polygon");
    expect(geoJson.coordinates).toHaveLength(1);
    // Closed ring has coords.length + 1 points
    expect(geoJson.coordinates[0]).toHaveLength(realFarmCoords.length + 1);

    // GeoJSON is [lng, lat]
    expect(geoJson.coordinates[0][0][0]).toBe(realFarmCoords[0].lng);
    expect(geoJson.coordinates[0][0][1]).toBe(realFarmCoords[0].lat);

    // Closing point matches starting point
    const ring = geoJson.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);

    // Round-trip back to LatLng[]
    const recovered = geoJsonPolygonToCoords(geoJson);
    expect(recovered).toHaveLength(realFarmCoords.length);
    expect(recovered[0].lat).toBeCloseTo(realFarmCoords[0].lat, 5);
    expect(recovered[0].lng).toBeCloseTo(realFarmCoords[0].lng, 5);
  });

  it("handles regional Bigha variations across states correctly", () => {
    // 1 Acre = 4046.86 m²
    // If field is 2 Acres:
    // UP (0.625 acre/bigha) -> 2 / 0.625 = 3.2 Bigha
    // Rajasthan standard (1.25 acre/bigha) -> 2 / 1.25 = 1.6 Bigha
    // Punjab (0.50 acre/bigha) -> 2 / 0.50 = 4.0 Bigha
    // Gujarat (0.40 acre/bigha) -> 2 / 0.40 = 5.0 Bigha
    const twoAcresSqM = 2 * ACRE_TO_SQ_METERS;

    // Geodesic accounting for latitude 27 deg:
    const approxSideMeters = 90;
    const latDelta = approxSideMeters / 111320;
    const lngDelta = approxSideMeters / (111320 * Math.cos((27.0 * Math.PI) / 180));
    const twoAcreCoords: LatLng[] = [
      { lat: 27.0, lng: 78.0 },
      { lat: 27.0 + latDelta, lng: 78.0 },
      { lat: 27.0 + latDelta, lng: 78.0 + lngDelta },
      { lat: 27.0, lng: 78.0 + lngDelta },
    ];

    const upOpt = REGIONAL_BIGHA_OPTIONS.find((o) => o.id === "up")!;
    const rajOpt = REGIONAL_BIGHA_OPTIONS.find((o) => o.id === "rajasthan_std")!;
    const punjabOpt = REGIONAL_BIGHA_OPTIONS.find((o) => o.id === "punjab_haryana")!;

    const mUp = getFieldMeasurement(twoAcreCoords, upOpt.acresPerBigha, upOpt.label, upOpt.note);
    const mRaj = getFieldMeasurement(twoAcreCoords, rajOpt.acresPerBigha, rajOpt.label, rajOpt.note);
    const mPunjab = getFieldMeasurement(twoAcreCoords, punjabOpt.acresPerBigha, punjabOpt.label, punjabOpt.note);

    expect(mUp.acres).toBeGreaterThan(1.8);
    expect(mUp.acres).toBeLessThan(2.2);

    expect(mUp.bigha?.value).toBeCloseTo(mUp.acres / 0.625, 1);
    expect(mRaj.bigha?.value).toBeCloseTo(mRaj.acres / 1.25, 1);
    expect(mPunjab.bigha?.value).toBeCloseTo(mPunjab.acres / 0.5, 1);
  });

  it("calculates great-circle distance accurately for GPS walking threshold", () => {
    // 1 second of latitude is ≈ 30.8 meters
    const p1: LatLng = { lat: 27.0, lng: 78.0 };
    const p2: LatLng = { lat: 27.000277, lng: 78.0 }; // ~30.8m north

    const dist = haversineDistanceMeters(p1, p2);
    expect(dist).toBeGreaterThan(29);
    expect(dist).toBeLessThan(32);
  });
});
