export const DASHBOARD_METRICS = [
  { label: "Active Crops", value: "5 Crops in Field", action: { label: "View Details", href: "/my-farm" } },
  { label: "Upcoming Activities", value: "4 Next 7 Days", action: { label: "View Calendar", href: "/crop-calendar" } },
  { label: "Field Health", value: "82% Overall", action: { label: "View Report", href: "/my-farm" } },
  { label: "Alerts", value: "3 New Alerts", action: { label: "View All", href: "/alerts" } },
];

export const DASHBOARD_ALERTS = [
  {
    id: "1",
    title: "Stem Borer Alert in Paddy",
    desc: "High risk in your area — monitor tillering stage closely",
    time: "2h ago",
    type: "warning" as const,
  },
  {
    id: "2",
    title: "Irrigation Recommended",
    desc: "Light irrigation suggested for all fields tomorrow morning",
    time: "5h ago",
    type: "water" as const,
  },
  {
    id: "3",
    title: "Fertilizer Reminder",
    desc: "Top dressing of Urea is due in Main Farm",
    time: "1d ago",
    type: "fertilizer" as const,
  },
];

export const DASHBOARD_ACTIVITIES = [
  { id: "1", task: "Top Dressing (Urea)", field: "Paddy Field - Main Farm", date: "14 May (Tomorrow)" },
  { id: "2", task: "Irrigation", field: "All Fields", date: "15 May (In 2 Days)" },
  { id: "3", task: "Pesticide Spray", field: "Soybean - North Field", date: "16 May (In 3 Days)" },
  { id: "4", task: "Weed Control", field: "Maize - West Field", date: "17 May (In 4 Days)" },
];

export const DASHBOARD_FIELDS = [
  { name: "Main Farm", area: "12.50 Acre", crop: "Paddy", stage: "Tillering", health: 82, status: "Good" },
  { name: "North Field", area: "3.20 Acre", crop: "Soybean", stage: "Flowering", health: 78, status: "Good" },
  { name: "West Field", area: "2.80 Acre", crop: "Maize", stage: "Grain Filling", health: 65, status: "Average" },
  { name: "South Plot", area: "1.50 Acre", crop: "Wheat", stage: "Maturity", health: 80, status: "Good" },
];

export const DASHBOARD_MANDI = [
  { crop: "Paddy (धान)", market: "Sehore", min: 2100, max: 2250, modal: 2180, change: 2.38 },
  { crop: "Soybean", market: "Indore", min: 4100, max: 4450, modal: 4280, change: 1.2 },
  { crop: "Maize (मक्का)", market: "Bhopal", min: 1950, max: 2200, modal: 2080, change: -0.8 },
  { crop: "Wheat (गेहूँ)", market: "Ujjain", min: 2275, max: 2400, modal: 2340, change: 0.5 },
  { crop: "Gram (चना)", market: "Vidisha", min: 5400, max: 5800, modal: 5620, change: 1.8 },
];

export const EXPERT_TIP = {
  name: "Dr. Rakesh Sharma",
  role: "Agronomist (PhD)",
  tip: "टिलरिंग स्टेज में धान में उर्वरक की समय पर ड्रेसिंग से टिलर संख्या बढ़ती है और उपज में 15-20% की वृद्धि हो सकती है।",
};

export const CROP_HEALTH_SEGMENTS = [
  { label: "Excellent", value: 32, color: "#10b981" },
  { label: "Good", value: 50, color: "#34d399" },
  { label: "Average", value: 15, color: "#fbbf24" },
  { label: "Poor", value: 3, color: "#f87171" },
];

export const COMMUNITY_POST = {
  author: "Ramesh Yadav",
  location: "Sehore, MP",
  text: "टमाटर की पत्तियों पर पीले धब्बे दिख रहे हैं, क्या यह लीफ माइनर है?",
  likes: 24,
  comments: 12,
};
