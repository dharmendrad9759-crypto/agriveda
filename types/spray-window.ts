export type SprayWindowStatusLevel = "GOOD" | "CAUTION" | "AVOID";

export interface SprayWeatherSnapshot {
  windSpeedKmh: number;
  temperatureC: number;
  humidityPercent: number;
  /** Max rain probability (0–1) within the next 3 hours from this moment */
  rainProbabilityNext3h: number;
  timeOfDay: Date;
  weatherMain: string;
}

export interface SprayForecastHour {
  time: Date;
  windSpeedKmh: number;
  temperatureC: number;
  humidityPercent: number;
  rainProbability: number;
  weatherMain: string;
}

export interface SprayWeatherBundle {
  location: string;
  current: SprayWeatherSnapshot;
  /** Hourly slots for the next 24 hours (expanded from 3-hour forecast) */
  hourly: SprayForecastHour[];
}

export interface SprayWindowResult {
  status: SprayWindowStatusLevel;
  reasonEn: string;
  reasonHi: string;
  factors: string[];
}

export interface SprayWindowTimelineSlot {
  time: Date;
  label: string;
  status: SprayWindowStatusLevel;
  result: SprayWindowResult;
}

export interface SprayWindowAnalysis {
  current: SprayWindowResult;
  timeline: SprayWindowTimelineSlot[];
  nextGoodWindow: SprayForecastHour | null;
  nextGoodWindowLabel: string | null;
}
