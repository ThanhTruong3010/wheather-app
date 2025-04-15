import { DailyForecast } from "@/types/weather";
import React from "react";
import { formatDate } from "@/lib/utils";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  dailyData: DailyForecast[];
  days?: number;
  className?: string;
}

export function DailyForecastView({
  dailyData,
  days = 5,
  className,
}: DailyForecastProps) {
  // Limit to the specified number of days
  const limitedData = dailyData.slice(0, days);

  return (
    <div className={`w-full ${className || ""}`}>
      <h3 className="text-sm font-medium mb-2">{days}-Day Forecast</h3>
      <div className="space-y-2">
        {limitedData.map((day, index) => (
          <div
            key={index}
            className="grid grid-cols-3 py-2 border-b last:border-0 border-border/30"
          >
            <span className="text-sm">
              {index === 0 ? "Today" : formatDate(day.date, "short")}
            </span>
            <div className="flex items-center space-x-2 justify-center">
              <WeatherIcon condition={day.weather_condition} size={18} />
              {day.pop > 0 && (
                <span className="text-xs text-blue-500">{day.pop}%</span>
              )}
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <span className="text-sm font-medium">{day.temp_max}°</span>
              <span className="text-xs text-muted-foreground">
                {day.temp_min}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
