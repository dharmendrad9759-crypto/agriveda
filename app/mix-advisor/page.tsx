import MixAdvisorClient from "@/components/mix-advisor/MixAdvisorClient";

export const metadata = {
  title: "दवा मिलाएँ | AgriVeda",
  description: "दो दवा मिलाएँ या नहीं — फसल, समस्या और मौसम के अनुसार सुरक्षित मिक्स।",
};

export default function MixAdvisorPage() {
  return <MixAdvisorClient />;
}
