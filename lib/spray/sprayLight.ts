export type SprayLight = "green" | "yellow" | "red";

export type SprayLightResult = {
  light: SprayLight;
  lineHi: string;
};

/** One reading for home and the mix screen. No "perfect" or "100%". */
export function sprayLight(opts: {
  rainChance?: number | null;
  windKmh?: number | null;
  hour?: number;
  weatherKnown?: boolean;
}): SprayLightResult {
  if (opts.weatherKnown === false) {
    return { light: "yellow", lineHi: "मौसम का पक्का आँकड़ा नहीं है।" };
  }
  const hour = opts.hour ?? new Date().getHours();
  const rain = opts.rainChance;
  const wind = opts.windKmh;
  if (rain != null && rain >= 50) return { light: "red", lineHi: "बारिश का अंदेशा — स्प्रे रोकें।" };
  if (wind != null && wind >= 15) return { light: "red", lineHi: "हवा तेज़ है — स्प्रे रोकें।" };
  const hot = hour >= 11 && hour < 16;
  if (hot && (rain == null || rain < 30)) {
    return { light: "yellow", lineHi: "धूप तेज़ है — सुबह या शाम स्प्रे करें।" };
  }
  if (rain != null && rain >= 30) return { light: "yellow", lineHi: "हल्की बारिश हो सकती है।" };
  if (rain == null && wind == null) return { light: "yellow", lineHi: "मौसम का पक्का आँकड़ा नहीं है।" };
  return { light: "green", lineHi: "हवा और बारिश शांत लग रही है। लेबल फिर भी देखें।" };
}

export function sprayLightFromWeather(weather: {
  windSpeed?: string;
  isDemo?: boolean;
  dailyForecast?: { rainChance: number }[];
} | null | undefined): SprayLightResult {
  if (!weather || weather.isDemo) return sprayLight({ weatherKnown: false });
  const wind = parseFloat(String(weather.windSpeed ?? "").replace(/[^\d.]/g, ""));
  const rain = weather.dailyForecast?.[0]?.rainChance;
  return sprayLight({
    weatherKnown: true,
    rainChance: Number.isFinite(rain) ? rain : null,
    windKmh: Number.isFinite(wind) ? wind : null,
  });
}
