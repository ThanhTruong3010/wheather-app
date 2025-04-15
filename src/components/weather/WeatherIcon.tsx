
import { getWeatherColor, getWeatherIcon } from "@/lib/utils";
import React from "react";

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ condition, size = 24, className }: WeatherIconProps) {
  const Icon = getWeatherIcon(condition);
  const colorClass = getWeatherColor(condition);

  return (
    <Icon 
      size={size}
      className={`${colorClass} ${className || ""}`}
    />
  );
}
