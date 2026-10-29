import { describe, it, expect } from "vitest";
import {
  calculateNdviFromReflectance,
  generateFieldSatelliteObservation,
  generateHistoricalObservations,
} from "./satelliteRadar";
import {
  WHEAT_ZADOKS_STAGES,
  getWheatStageById,
  getWheatStageByDays,
} from "./wheatZadoksStages";
import {
  calculateDaysAfterSowing,
  estimateWheatStage,
  generateWheatSeasonTasks,
  updateTaskStatusesByAge,
} from "./cropJourneyEngine";
import { LatLng } from "@/lib/geo/fieldGeometry";
import { CropSeason } from "./types";

describe("Agriveda Farm Intelligence 360° - Scientific & Agronomic Engine", () => {
  describe("1. Copernicus Sentinel-2 Remote Sensing & NDVI", () => {
    it("should calculate NDVI correctly from NIR (Band 8) and Red (Band 4) reflectance", () => {
      // Healthy dense canopy: high NIR (0.45), low Red (0.05)
      const healthyNdvi = calculateNdviFromReflectance(0.45, 0.05);
      expect(healthyNdvi).toBeCloseTo(0.8, 2);

      // Bare soil / dry: NIR (0.20), Red (0.18)
      const bareSoilNdvi = calculateNdviFromReflectance(0.2, 0.18);
      expect(bareSoilNdvi).toBeCloseTo(0.0526, 2);

      // Water body: low NIR (0.02), higher Red (0.06)
      const waterNdvi = calculateNdviFromReflectance(0.02, 0.06);
      expect(waterNdvi).toBeLessThan(0);
    });

    it("should enforce small-farm resolution safeguards for fields < 0.5 acre", () => {
      // Small boundary: approx 0.25 acre (~1000 sq meters)
      const smallBoundary: LatLng[] = [
        { lat: 27.5, lng: 78.0 },
        { lat: 27.5003, lng: 78.0 },
        { lat: 27.5003, lng: 78.0003 },
        { lat: 27.5, lng: 78.0003 },
      ];

      const obs = generateFieldSatelliteObservation("f-small-1", smallBoundary, 30);
      expect(obs.isSmallFieldSafeguarded).toBe(true);
      expect(obs.validPixelCount).toBeLessThan(20);
      expect(obs.resolutionMeters).toBe(10);
      expect(obs.satelliteProvider).toContain("Sentinel-2");
    });

    it("should generate realistic multi-date NDVI historical series", () => {
      const boundary: LatLng[] = [
        { lat: 27.5, lng: 78.0 },
        { lat: 27.502, lng: 78.0 },
        { lat: 27.502, lng: 78.002 },
        { lat: 27.5, lng: 78.002 },
      ];
      const series = generateHistoricalObservations("f-1", boundary, 60);
      expect(series).toHaveLength(6);
      // Observations should span a chronological time series
      const dates = series.map((s) => s.acquisitionDate);
      expect([...dates].sort()).toEqual(dates);
      expect(new Set(dates).size).toBe(6);
      // All observations should have SCL cloud masking under 10%
      series.forEach((s) => {
        expect(s.cloudCoveragePercent).toBeLessThan(10);
      });
    });
  });

  describe("2. Wheat Zadoks Phenological Scale (Z00 - Z99)", () => {
    it("should have all 10 standard phenological stages", () => {
      expect(WHEAT_ZADOKS_STAGES).toHaveLength(10);
      expect(WHEAT_ZADOKS_STAGES[0].stageId).toBe("germination");
      expect(WHEAT_ZADOKS_STAGES[1].stageId).toBe("cri");
      expect(WHEAT_ZADOKS_STAGES[9].stageId).toBe("ripening");
    });

    it("should identify CRI (Crown Root Initiation) at 21 DAS as critical", () => {
      const criStage = getWheatStageById("cri");
      expect(criStage).toBeDefined();
      expect(criStage?.zadoksCode).toBe("Z10-Z19");
      expect(criStage?.stageNameHi).toContain("ताज जड़");
      expect(criStage?.irrigationConsiderationsHi).toContain("पानी");
      expect(criStage?.commonMistakesHi?.length).toBeGreaterThan(0);
    });

    it("should resolve correct stage by Days After Sowing (DAS)", () => {
      // 5 DAS -> germination
      expect(getWheatStageByDays(5).stageId).toBe("germination");
      // 22 DAS -> CRI
      expect(getWheatStageByDays(22).stageId).toBe("cri");
      // 35 DAS -> tillering
      expect(getWheatStageByDays(35).stageId).toBe("tillering");
      // 55 DAS -> stem_elongation
      expect(getWheatStageByDays(55).stageId).toBe("stem_elongation");
      // 72 DAS -> booting
      expect(getWheatStageByDays(72).stageId).toBe("booting");
      // 86 DAS -> heading
      expect(getWheatStageByDays(86).stageId).toBe("heading");
      // 100 DAS -> flowering
      expect(getWheatStageByDays(100).stageId).toBe("flowering");
      // 110 DAS -> milking
      expect(getWheatStageByDays(110).stageId).toBe("milking");
      // 122 DAS -> dough
      expect(getWheatStageByDays(122).stageId).toBe("dough");
      // 138 DAS -> ripening
      expect(getWheatStageByDays(138).stageId).toBe("ripening");
    });
  });

  describe("3. Crop Journey Engine & Stage Estimation Hierarchy", () => {
    const baseSeason: CropSeason = {
      id: "cs-101",
      fieldId: "f-101",
      cropId: "wheat",
      cropName: "गेहूँ",
      seasonName: "रबी 2026-27",
      sowingDate: new Date(Date.now() - 22 * 86400 * 1000).toISOString().split("T")[0],
      currentStageId: "cri",
      stageEstimationMethod: "agronomic_window",
      seasonStatus: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it("should prioritize farmer_confirmed stage over weather GDD and agronomic window", () => {
      const seasonWithFarmer: CropSeason = {
        ...baseSeason,
        farmerConfirmedStageId: "tillering",
      };
      const res = estimateWheatStage(seasonWithFarmer, 450);
      expect(res.stage.stageId).toBe("tillering");
      expect(res.method).toBe("farmer_confirmed");
    });

    it("should fallback to GDD or DAS when farmer has not confirmed", () => {
      const res = estimateWheatStage(baseSeason);
      expect(res.stage.stageId).toBe("cri");
      expect(res.method).toBe("agronomic_window");
    });

    it("should generate 11 scientific stage-specific tasks for wheat", () => {
      const tasks = generateWheatSeasonTasks("cs-101", "f-101");
      expect(tasks.length).toBeGreaterThanOrEqual(11);

      // Verify CRI irrigation task exists
      const criTask = tasks.find((t) => t.stageId === "cri" && t.category === "irrigation");
      expect(criTask).toBeDefined();
      expect(criTask?.titleHi).toContain("CRI");

      // Verify weed control task exists
      const weedTask = tasks.find((t) => t.category === "weeding");
      expect(weedTask).toBeDefined();
    });

    it("should update task statuses accurately based on crop age", () => {
      const rawTasks = generateWheatSeasonTasks("cs-101", "f-101");
      const farmTasks = rawTasks.map((t, idx) => ({
        ...t,
        id: `task-${idx}`,
      }));
      const evaluated = updateTaskStatusesByAge(farmTasks, 22);

      // CRI tasks (dueDaysAfterSowing 18-25) should be "due" at 22 DAS
      const criTasks = evaluated.filter((t) => t.stageId === "cri");
      expect(criTasks.some((t) => t.status === "due")).toBe(true);
    });
  });
});
