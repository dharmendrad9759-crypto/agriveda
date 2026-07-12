/** 3×6 sprite sheet — public/images/agriveda-service-icons.png (1024×682) */

export const SERVICE_SPRITE_URL = "/images/agriveda-service-icons.png";
export const SERVICE_SPRITE_COLS = 6;
export const SERVICE_SPRITE_ROWS = 3;
export const SERVICE_ICON_ASPECT = 1024 / 6 / (682 / 3);

export interface AgrivedaServiceIconItem {
  id: string;
  labelHi: string;
  labelEn: string;
  href: string;
  col: number;
  row: number;
}

/** Order matches the provided icon sheet (left → right, top → bottom). */
export const AGRIVEDA_SERVICE_ICONS: AgrivedaServiceIconItem[] = [
  { id: "crop-details", labelHi: "फसल विवरण", labelEn: "Crop Details", href: "/crops", col: 0, row: 0 },
  { id: "crop-calendar", labelHi: "फसल कैलेंडर", labelEn: "Crop Calendar", href: "/crop-calendar", col: 1, row: 0 },
  {
    id: "fertilizer-schedule",
    labelHi: "खाद शेड्यूल",
    labelEn: "Fertilizer Schedule",
    href: "/services/fertilizer-calculator",
    col: 2,
    row: 0,
  },
  { id: "pest-mgmt", labelHi: "कीट प्रबंधन", labelEn: "Pest Management", href: "/pest-diseases?type=pest", col: 3, row: 0 },
  {
    id: "disease-mgmt",
    labelHi: "रोग प्रबंधन",
    labelEn: "Disease Management",
    href: "/pest-diseases?type=disease",
    col: 4,
    row: 0,
  },
  { id: "mandi", labelHi: "मंडी भाव", labelEn: "Mandi Prices", href: "/mandi", col: 5, row: 0 },
  { id: "weather", labelHi: "मौसम जानकारी", labelEn: "Weather", href: "/weather", col: 0, row: 1 },
  { id: "search", labelHi: "खोजें", labelEn: "Search", href: "/search", col: 1, row: 1 },
  { id: "pest-id", labelHi: "कीट पहचान", labelEn: "Pest ID", href: "/pest-solver", col: 2, row: 1 },
  { id: "disease-id", labelHi: "रोग पहचान", labelEn: "Disease ID", href: "/ai-doctor", col: 3, row: 1 },
  { id: "weed-mgmt", labelHi: "खरपतवार प्रबंधन", labelEn: "Weed Management", href: "/pest-diseases?type=weed", col: 4, row: 1 },
  { id: "deficiency", labelHi: "पोषक तत्व कमी", labelEn: "Nutrient Deficiency", href: "/deficiencies", col: 5, row: 1 },
  {
    id: "fertilizer-info",
    labelHi: "उर्वरक जानकारी",
    labelEn: "Fertilizer Info",
    href: "/crops",
    col: 0,
    row: 2,
  },
  { id: "irrigation", labelHi: "सिंचाई शेड्यूल", labelEn: "Irrigation Schedule", href: "/services/irrigation", col: 1, row: 2 },
  {
    id: "seed-calc",
    labelHi: "बीज दर कैलकुलेटर",
    labelEn: "Seed Calculator",
    href: "/services/seed-calculator",
    col: 2,
    row: 2,
  },
  { id: "ai-doctor", labelHi: "AI डॉक्टर", labelEn: "AI Doctor", href: "/ai-doctor", col: 3, row: 2 },
  { id: "community", labelHi: "समुदाय", labelEn: "Community", href: "/community", col: 4, row: 2 },
  { id: "settings", labelHi: "सेटिंग्स", labelEn: "Settings", href: "/settings", col: 5, row: 2 },
];

export function serviceSpriteStyle(col: number, row: number) {
  const x = (col / (SERVICE_SPRITE_COLS - 1)) * 100;
  const y = (row / (SERVICE_SPRITE_ROWS - 1)) * 100;
  return {
    backgroundImage: `url('${SERVICE_SPRITE_URL}')`,
    backgroundSize: `${SERVICE_SPRITE_COLS * 100}% ${SERVICE_SPRITE_ROWS * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
    backgroundRepeat: "no-repeat" as const,
  };
}
