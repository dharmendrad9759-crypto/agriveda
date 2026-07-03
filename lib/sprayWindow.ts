import type {
  SprayForecastHour,
  SprayWeatherSnapshot,
  SprayWindowAnalysis,
  SprayWindowResult,
  SprayWindowStatusLevel,
  SprayWindowTimelineSlot,
} from "@/types/spray-window";

/** Tune agronomic thresholds here */
export const SPRAY_WINDOW_CONFIG = {
  windKmh: {
    goodMin: 3,
    goodMax: 15,
    cautionMax: 20,
    inversionMax: 3,
  },
  tempC: {
    goodMin: 15,
    goodMax: 35,
    cautionMax: 40,
  },
  humidityPercent: {
    goodMin: 50,
    goodMax: 85,
    cautionBelow: 40,
  },
  rain: {
    goodMaxProbability: 0.2,
    avoidMinProbability: 0.4,
    lookaheadHours: 3,
  },
  peakHeat: {
    startHour: 12,
    endHour: 15,
  },
  inversion: {
    earlyMorningStart: 4,
    earlyMorningEnd: 8,
    nightStartHour: 20,
    nightEndHour: 6,
    clearSkyMains: ["Clear", "Clouds"] as const,
  },
  timelineHours: 12,
  forecastScanHours: 24,
} as const;

function isPeakHeat(hour: number): boolean {
  const { startHour, endHour } = SPRAY_WINDOW_CONFIG.peakHeat;
  return hour >= startHour && hour < endHour;
}

function isInversionRisk(snapshot: SprayWeatherSnapshot): boolean {
  const { inversion, windKmh } = SPRAY_WINDOW_CONFIG;
  const hour = snapshot.timeOfDay.getHours();

  const earlyMorning =
    hour >= inversion.earlyMorningStart && hour < inversion.earlyMorningEnd;
  const night =
    hour >= inversion.nightStartHour || hour < inversion.nightEndHour;
  const clearEnough = inversion.clearSkyMains.includes(
    snapshot.weatherMain as (typeof inversion.clearSkyMains)[number]
  );

  return (
    snapshot.windSpeedKmh < windKmh.inversionMax &&
    (earlyMorning || night) &&
    clearEnough
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTimeHi(date: Date): string {
  return date.toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getSprayWindowStatus(
  weatherData: SprayWeatherSnapshot
): SprayWindowResult {
  const { windKmh, tempC, humidityPercent, rain } = SPRAY_WINDOW_CONFIG;
  const factors: string[] = [];
  const wind = Math.round(weatherData.windSpeedKmh);
  const temp = Math.round(weatherData.temperatureC);
  const humidity = Math.round(weatherData.humidityPercent);
  const rainPct = Math.round(weatherData.rainProbabilityNext3h * 100);
  const hour = weatherData.timeOfDay.getHours();

  if (weatherData.windSpeedKmh > windKmh.cautionMax) {
    factors.push(`wind_${wind}`);
    return {
      status: "AVOID",
      reasonEn: `Wind is ${wind} km/h — high drift risk. Check again in about 2 hours.`,
      reasonHi: `हवा ${wind} km/h है — spray करने से drift का risk है, 2 घंटे बाद दोबारा check करो।`,
      factors,
    };
  }

  if (weatherData.rainProbabilityNext3h > rain.avoidMinProbability) {
    factors.push(`rain_${rainPct}`);
    return {
      status: "AVOID",
      reasonEn: `${rainPct}% rain chance in the next 3 hours — spray may wash off.`,
      reasonHi: `अगले 3 घंटे में ${rainPct}% बारिश की संभावना — spray धो सकती है, टालें।`,
      factors,
    };
  }

  if (isInversionRisk(weatherData)) {
    factors.push("inversion");
    return {
      status: "AVOID",
      reasonEn:
        "Calm, clear morning/night air can trap spray — wait for wind to pick up (3–15 km/h).",
      reasonHi:
        "शांत सुबह/रात की हवा में spray फंस सकता है — 3–15 km/h हवा आने तक रुकें।",
      factors,
    };
  }

  const cautionReasonsEn: string[] = [];
  const cautionReasonsHi: string[] = [];

  if (
    weatherData.windSpeedKmh > windKmh.goodMax &&
    weatherData.windSpeedKmh <= windKmh.cautionMax
  ) {
    factors.push(`wind_${wind}`);
    cautionReasonsEn.push(`wind ${wind} km/h is borderline`);
    cautionReasonsHi.push(`हवा ${wind} km/h सीमा पर है`);
  }

  if (
    weatherData.temperatureC > tempC.goodMax &&
    weatherData.temperatureC <= tempC.cautionMax
  ) {
    factors.push(`temp_${temp}`);
    cautionReasonsEn.push(`temperature ${temp}°C is warm`);
    cautionReasonsHi.push(`तापमान ${temp}°C ज़्यादा गर्म है`);
  }

  if (weatherData.humidityPercent < humidityPercent.cautionBelow) {
    factors.push(`humidity_${humidity}`);
    cautionReasonsEn.push(`humidity ${humidity}% — fast evaporation risk`);
    cautionReasonsHi.push(`नमी ${humidity}% — दवा जल्दी सूख सकती है`);
  }

  if (
    weatherData.windSpeedKmh < windKmh.goodMin &&
    !isInversionRisk(weatherData)
  ) {
    factors.push(`wind_low_${wind}`);
    cautionReasonsEn.push(`wind ${wind} km/h is very calm`);
    cautionReasonsHi.push(`हवा ${wind} km/h बहुत धीमी है`);
  }

  if (cautionReasonsEn.length > 0) {
    return {
      status: "CAUTION",
      reasonEn: `${cautionReasonsEn.join("; ")}. Spray only if urgent and use larger droplets.`,
      reasonHi: `${cautionReasonsHi.join("؛ ")}. ज़रूरी हो तभी spray करें, बड़ी droplets इस्तेमाल करें।`,
      factors,
    };
  }

  const goodChecks = [
    weatherData.windSpeedKmh >= windKmh.goodMin &&
      weatherData.windSpeedKmh <= windKmh.goodMax,
    weatherData.temperatureC >= tempC.goodMin &&
      weatherData.temperatureC <= tempC.goodMax,
    weatherData.humidityPercent >= humidityPercent.goodMin &&
      weatherData.humidityPercent <= humidityPercent.goodMax,
    weatherData.rainProbabilityNext3h <= rain.goodMaxProbability,
    !isPeakHeat(hour),
  ];

  if (goodChecks.every(Boolean)) {
    return {
      status: "GOOD",
      reasonEn: "Wind, temperature, humidity, and rain look suitable for spraying now.",
      reasonHi: "हवा, तापमान, नमी और बारिश — अभी spray के लिए अच्छी स्थिति है।",
      factors: ["all_good"],
    };
  }

  const blockersEn: string[] = [];
  const blockersHi: string[] = [];

  if (weatherData.windSpeedKmh < windKmh.goodMin) {
    blockersEn.push(`wind ${wind} km/h is below ideal`);
    blockersHi.push(`हवा ${wind} km/h कम है`);
  }
  if (weatherData.windSpeedKmh > windKmh.goodMax) {
    blockersEn.push(`wind ${wind} km/h is high`);
    blockersHi.push(`हवा ${wind} km/h तेज़ है`);
  }
  if (weatherData.temperatureC < tempC.goodMin) {
    blockersEn.push(`temperature ${temp}°C is cool`);
    blockersHi.push(`तापमान ${temp}°C कम है`);
  }
  if (weatherData.temperatureC > tempC.goodMax) {
    blockersEn.push(`temperature ${temp}°C is hot`);
    blockersHi.push(`तापमान ${temp}°C ज़्यादा है`);
  }
  if (weatherData.humidityPercent < humidityPercent.goodMin) {
    blockersEn.push(`humidity ${humidity}% is low`);
    blockersHi.push(`नमी ${humidity}% कम है`);
  }
  if (weatherData.humidityPercent > humidityPercent.goodMax) {
    blockersEn.push(`humidity ${humidity}% is high`);
    blockersHi.push(`नमी ${humidity}% ज़्यादा है`);
  }
  if (weatherData.rainProbabilityNext3h > rain.goodMaxProbability) {
    blockersEn.push(`${rainPct}% rain chance soon`);
    blockersHi.push(`${rainPct}% बारिश की संभावना`);
  }
  if (isPeakHeat(hour)) {
    blockersEn.push("peak heat (12–3 pm) increases volatilization");
    blockersHi.push("दोपहर 12–3 बजे गर्मी में spray वाष्पित हो सकता है");
  }

  return {
    status: "CAUTION",
    reasonEn:
      blockersEn.length > 0
        ? `${blockersEn.join("; ")}. Consider waiting for better conditions.`
        : "Conditions are not ideal. Consider waiting.",
    reasonHi:
      blockersHi.length > 0
        ? `${blockersHi.join("؛ ")}. बेहतर मौसम का इंतज़ार करें।`
        : "स्थिति आदर्श नहीं है। थोड़ा रुकें।",
    factors,
  };
}

function snapshotFromHour(hour: SprayForecastHour, hourly: SprayForecastHour[]): SprayWeatherSnapshot {
  const now = hour.time.getTime();
  const threeHoursLater = now + SPRAY_WINDOW_CONFIG.rain.lookaheadHours * 60 * 60 * 1000;
  const rainProbabilityNext3h = hourly
    .filter((h) => h.time.getTime() >= now && h.time.getTime() < threeHoursLater)
    .reduce((max, h) => Math.max(max, h.rainProbability), hour.rainProbability);

  return {
    windSpeedKmh: hour.windSpeedKmh,
    temperatureC: hour.temperatureC,
    humidityPercent: hour.humidityPercent,
    rainProbabilityNext3h,
    timeOfDay: hour.time,
    weatherMain: hour.weatherMain,
  };
}

export function findNextGoodWindow(
  hourly: SprayForecastHour[],
  after: Date = new Date()
): { slot: SprayForecastHour; labelEn: string; labelHi: string } | null {
  const afterMs = after.getTime();

  for (const hour of hourly) {
    if (hour.time.getTime() <= afterMs) continue;
    const snapshot = snapshotFromHour(hour, hourly);
    const result = getSprayWindowStatus(snapshot);
    if (result.status === "GOOD") {
      const label = formatTime(hour.time);
      const labelHi = formatTimeHi(hour.time);
      return {
        slot: hour,
        labelEn: `Next good window: ${label}`,
        labelHi: `अगली अच्छी window: ${labelHi}`,
      };
    }
  }

  return null;
}

export function buildSprayWindowAnalysis(
  current: SprayWeatherSnapshot,
  hourly: SprayForecastHour[]
): SprayWindowAnalysis {
  const currentResult = getSprayWindowStatus(current);
  const now = current.timeOfDay;

  const timeline: SprayWindowTimelineSlot[] = hourly
    .filter((h) => {
      const diffH =
        (h.time.getTime() - now.getTime()) / (60 * 60 * 1000);
      return diffH >= 0 && diffH < SPRAY_WINDOW_CONFIG.timelineHours;
    })
    .map((hour) => {
      const snapshot = snapshotFromHour(hour, hourly);
      const result = getSprayWindowStatus(snapshot);
      return {
        time: hour.time,
        label: formatTime(hour.time),
        status: result.status,
        result,
      };
    });

  const next = findNextGoodWindow(hourly, now);

  return {
    current: currentResult,
    timeline,
    nextGoodWindow: next?.slot ?? null,
    nextGoodWindowLabel: next?.labelEn ?? null,
  };
}

export function statusColor(status: SprayWindowStatusLevel): string {
  if (status === "GOOD") return "bg-emerald-500";
  if (status === "CAUTION") return "bg-amber-400";
  return "bg-red-500";
}

export function statusBorder(status: SprayWindowStatusLevel): string {
  if (status === "GOOD")
    return "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10";
  if (status === "CAUTION")
    return "border-amber-500/40 bg-amber-50 dark:bg-amber-500/10";
  return "border-red-500/40 bg-red-50 dark:bg-red-500/10";
}

export function statusTextColor(status: SprayWindowStatusLevel): string {
  if (status === "GOOD") return "text-emerald-800 dark:text-emerald-300";
  if (status === "CAUTION") return "text-amber-800 dark:text-amber-300";
  return "text-red-800 dark:text-red-300";
}
