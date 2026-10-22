import MixAdvisorClient from "@/components/mix-advisor/MixAdvisorClient";

export const metadata = {
  title: "दवा मिश्रण जांच (घोल सुरक्षा) | AgriVeda",
  description: "दो दवा मिलाएँ या नहीं — फसल, समस्या और मौसम के अनुसार सुरक्षित मिक्स।",
};

export default function MixAdvisorPage() {
  return <MixAdvisorClient />;
}
