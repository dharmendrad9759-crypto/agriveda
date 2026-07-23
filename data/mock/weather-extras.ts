export type WeatherAlert = {
  type: string;
  title: string;
  desc: string;
  priority: "high" | "medium" | "low";
};

const WEATHER_ALERTS_EN: WeatherAlert[] = [
  {
    type: "heat",
    title: "Heat Wave Alert",
    desc: "Temperatures likely above 40°C — 12–14 May",
    priority: "high",
  },
  {
    type: "rain",
    title: "Light Rain Expected",
    desc: "Light rain possible — postpone spraying",
    priority: "medium",
  },
  {
    type: "wind",
    title: "High Wind Warning",
    desc: "Strong winds up to 25 km/h — protect crops",
    priority: "medium",
  },
];

const WEATHER_ALERTS_HI: WeatherAlert[] = [
  {
    type: "heat",
    title: "लू की चेतावनी",
    desc: "तापमान 40°C से अधिक रहने की संभावना — 12-14 May",
    priority: "high",
  },
  {
    type: "rain",
    title: "हल्की बारिश संभव",
    desc: "हल्की बारिश की संभावना — स्प्रे स्थगित करें",
    priority: "medium",
  },
  {
    type: "wind",
    title: "तेज़ हवा की चेतावनी",
    desc: "तेज़ हवाएं 25 km/h तक — फसल सुरक्षा करें",
    priority: "medium",
  },
];

const AGRI_ADVISORY_EN = [
  "No irrigation needed for the next 2 days — soil moisture is adequate",
  "Right time for the second urea dose at tillering stage",
  "Higher humidity — increase fungal disease scouting",
];

const AGRI_ADVISORY_HI = [
  "अगले 2 दिन सिंचाई की आवश्यकता नहीं — मिट्टी में नमी पर्याप्त है",
  "टिलरिंग स्टेज में यूरिया की दूसरी खुराक लगाने का सही समय",
  "उच्च आर्द्रता के कारण फंगल रोग की निगरानी बढ़ाएं",
];

const WEATHER_DETAILS_EN = [
  { label: "UV Index", value: "7 High" },
  { label: "Dew Point", value: "24°C" },
  { label: "Cloud Cover", value: "40%" },
  { label: "Humidity Max", value: "84%" },
  { label: "Humidity Min", value: "52%" },
  { label: "Wind Gust", value: "22 km/h" },
];

const WEATHER_DETAILS_HI = [
  { label: "यूवी इंडेक्स", value: "7 उच्च" },
  { label: "ओसांक", value: "24°C" },
  { label: "बादल आवरण", value: "40%" },
  { label: "अधिकतम नमी", value: "84%" },
  { label: "न्यूनतम नमी", value: "52%" },
  { label: "हवा का झोंका", value: "22 km/h" },
];

export function getWeatherAlerts(locale: string): WeatherAlert[] {
  return locale === "en" ? WEATHER_ALERTS_EN : WEATHER_ALERTS_HI;
}

export function getAgriAdvisory(locale: string): string[] {
  return locale === "en" ? AGRI_ADVISORY_EN : AGRI_ADVISORY_HI;
}

export function getWeatherDetails(locale: string) {
  return locale === "en" ? WEATHER_DETAILS_EN : WEATHER_DETAILS_HI;
}

/** @deprecated Prefer getWeatherAlerts(locale) */
export const WEATHER_ALERTS = WEATHER_ALERTS_EN;
/** @deprecated Prefer getAgriAdvisory(locale) */
export const AGRI_ADVISORY = AGRI_ADVISORY_EN;
/** @deprecated Prefer getWeatherDetails(locale) */
export const WEATHER_DETAILS = WEATHER_DETAILS_EN;
