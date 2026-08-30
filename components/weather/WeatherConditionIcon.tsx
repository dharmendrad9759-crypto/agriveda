"use client";

import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";

export default function WeatherConditionIcon({
  condition,
  className,
}: {
  condition: string;
  className?: string;
}) {
  const c = condition.toLowerCase();
  if (/thunder|storm/.test(c)) return <CloudLightning className={className} />;
  if (/rain|drizzle|shower/.test(c)) return <CloudRain className={className} />;
  if (/cloud|overcast|fog|mist/.test(c)) return <Cloud className={className} />;
  if (/partly|few/.test(c)) return <CloudSun className={className} />;
  return <Sun className={className} />;
}
