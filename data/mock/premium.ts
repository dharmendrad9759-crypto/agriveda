export const PREMIUM_FEATURES = [
  { title: "Advanced Analytics", desc: "Detailed insights & smart recommendations", icon: "📊", color: "text-emerald-400" },
  { title: "Custom Alerts", desc: "Personalized alerts for crops, pests & price", icon: "🔔", color: "text-amber-400" },
  { title: "Expert Consultation", desc: "Chat with agriculture experts", icon: "💬", color: "text-sky-400" },
  { title: "Detailed Reports", desc: "Download & share advanced reports", icon: "📥", color: "text-violet-400" },
  { title: "Priority Support", desc: "Get priority support whenever you need", icon: "🛡", color: "text-emerald-400" },
];

export const PREMIUM_PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "₹199",
    period: "/month",
    billing: "Billed monthly",
    save: null,
    popular: false,
    features: ["All Premium Features", "Custom Alerts", "Expert Consultation", "Advanced Weather", "Market Insights", "Ad-free"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹1,499",
    period: "/year",
    billing: "Billed yearly",
    save: "Save ₹889 (33%)",
    popular: true,
    features: ["All Premium Features", "Custom Alerts", "Expert Consultation", "Advanced Weather", "Market Insights", "Ad-free"],
  },
  {
    id: "3year",
    name: "3 Years",
    price: "₹3,499",
    period: "/3 years",
    billing: "One-time payment",
    save: "Save ₹2,489 (42%)",
    popular: false,
    features: ["All Premium Features", "Custom Alerts", "Expert Consultation", "Advanced Weather", "Market Insights", "Ad-free"],
  },
];

export const PLAN_COMPARISON = [
  { feature: "Crop & Disease Information", free: "Limited", premium: "Unlimited" },
  { feature: "Pest & Weed Management", free: "Limited", premium: "Unlimited" },
  { feature: "Nutrient Deficiency Guide", free: "Basic", premium: "Advanced" },
  { feature: "Fertilizer Schedule", free: "Basic", premium: "Advanced" },
  { feature: "Weather Forecast", free: "3 Days", premium: "15 Days" },
  { feature: "Mandi Prices", free: "Today", premium: "History + Trends" },
  { feature: "Custom Alerts", free: false, premium: true },
  { feature: "Expert Consultation", free: false, premium: true },
  { feature: "Detailed Reports", free: false, premium: true },
  { feature: "Remove Ads", free: false, premium: true },
  { feature: "Priority Support", free: false, premium: true },
];

export const PREMIUM_FAQ = [
  { q: "What is AgriVeda Premium?", a: "Premium unlocks advanced analytics, expert consultation, custom alerts, detailed reports and priority support." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel anytime. Your premium features remain active until the billing period ends." },
  { q: "Is my payment information secure?", a: "Yes, all payments are processed through secure, encrypted payment gateways." },
];
