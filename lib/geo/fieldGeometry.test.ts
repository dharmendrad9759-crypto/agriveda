import { describe, it, expect } from "vitest";
import {
  calculateGeodesicArea,
  calculateGeodesicPerimeter,
  isPolygonSelfIntersecting,
  validateFieldPolygon,
  getFieldMeasurement,
  coordsToGeoJsonPolygon,
  geoJsonPolygonToCoords,
  ACRE_TO_SQ_METERS,
} from "./fieldGeometry";

describe("Field Geometry & Area Calculation", () => {
  it("calculates accurate area for a known rectangular field", () => {
    // 100m x 100m square (10,000 m² = 1 Hectare ≈ 2.471 Acres) near equator
    // 100 meters at latitude 0 is roughly 0.0008983 degrees
    const dDeg = 0.000898315;
    const square = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: dDeg },
      { lat: dDeg, lng: dDeg },
      { lat: dDeg, lng: 0 },
    ];

    const area = calculateGeodesicArea(square);
    expect(area).toBeGreaterThan(9950);
    expect(area).toBeLessThan(10050);

    const m = getFieldMeasurement(square);
    expect(m.hectares).toBeCloseTo(1.0, 1);
    expect(m.acres).toBeCloseTo(10000 / ACRE_TO_SQ_METERS, 1);
    expect(m.perimeterMeters).toBeGreaterThan(395);
    expect(m.perimeterMeters).toBeLessThan(405);
  });

  it("handles irregular and concave fields", () => {
    // L-shaped concave polygon
    const lShape = [
      { lat: 26.5000, lng: 80.5000 },
      { lat: 26.5020, lng: 80.5000 },
      { lat: 26.5020, lng: 80.5010 },
      { lat: 26.5010, lng: 80.5010 },
      { lat: 26.5010, lng: 80.5020 },
      { lat: 26.5000, lng: 80.5020 },
    ];

    const validation = validateFieldPolygon(lShape);
    expect(validation.valid).toBe(true);

    const area = calculateGeodesicArea(lShape);
    expect(area).toBeGreaterThan(1000);

    const perimeter = calculateGeodesicPerimeter(lShape);
    expect(perimeter).toBeGreaterThan(100);
  });

  it("detects and rejects self-intersecting 'figure-8' polygons", () => {
    // Figure-8 polygon where edges cross
    const figure8 = [
      { lat: 26.5000, lng: 80.5000 },
      { lat: 26.5020, lng: 80.5020 },
      { lat: 26.5020, lng: 80.5000 },
      { lat: 26.5000, lng: 80.5020 },
    ];

    expect(isPolygonSelfIntersecting(figure8)).toBe(true);
    const validation = validateFieldPolygon(figure8);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain("आपस में कट");
  });

  it("converts to and from GeoJSON Polygon format correctly", () => {
    const coords = [
      { lat: 26.5000, lng: 80.5000 },
      { lat: 26.5020, lng: 80.5000 },
      { lat: 26.5020, lng: 80.5020 },
    ];

    const geoJson = coordsToGeoJsonPolygon(coords);
    expect(geoJson.type).toBe("Polygon");
    // GeoJSON must have 4 points (closing ring)
    expect(geoJson.coordinates[0].length).toBe(4);
    // order is [lng, lat]
    expect(geoJson.coordinates[0][0]).toEqual([80.5000, 26.5000]);
    expect(geoJson.coordinates[0][3]).toEqual([80.5000, 26.5000]);

    const parsed = geoJsonPolygonToCoords(geoJson);
    expect(parsed.length).toBe(3);
    expect(parsed[0]).toEqual({ lat: 26.5000, lng: 80.5000 });
  });

  it("supports regional Bigha calculation with explicit parameters", () => {
    // 2 Acre field with UP Bigha (0.625 Acre per Bigha -> 3.2 Bigha)
    const twoAcresSqM = 2 * ACRE_TO_SQ_METERS;
    // Mock square
    const side = Math.sqrt(twoAcresSqM);
    // At lat 25 deg, 1 deg lat ≈ 110,800m, 1 deg lng ≈ 100,800m
    const dLat = side / 110800;
    const dLng = side / 100800;

    const coords = [
      { lat: 25.0, lng: 82.0 },
      { lat: 25.0 + dLat, lng: 82.0 },
      { lat: 25.0 + dLat, lng: 82.0 + dLng },
      { lat: 25.0, lng: 82.0 + dLng },
    ];

    const m = getFieldMeasurement(coords, 0.625, "यूपी पक्का बीघा", "1 बीघा = 0.625 एकड़");
    expect(m.acres).toBeCloseTo(2.0, 1);
    expect(m.bigha).toBeDefined();
    expect(m.bigha!.value).toBeCloseTo(3.2, 1);
    expect(m.bigha!.label).toBe("यूपी पक्का बीघा");
  });
});
