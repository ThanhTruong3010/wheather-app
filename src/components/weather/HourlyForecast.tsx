import { HourlyForecast } from "@/types/weather";
import { formatTime } from "@/lib/utils";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hourlyData: HourlyForecast[];
  className?: string;
}

export function HourlyForecastView({
  hourlyData,
  className,
}: HourlyForecastProps) {
  return (
    <div className={`w-full ${className || ""}`}>
      <h3 className="text-sm font-medium mb-2">Today's Forecast</h3>
      <div className="w-full whitespace-nowrap overflow-x-auto">
        <div className="flex justify-between space-x-4 pb-2">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className="grid grid-rows-4 place-items-center p-2"
            >
              <span className="text-xs text-muted-foreground mb-1">
                {formatTime(hour.timestamp)}
              </span>
              <WeatherIcon condition={hour.weather_condition} size={20} />
              <span className="font-medium text-sm mt-1">{hour.temp}°</span>
              <span className="text-xs text-blue-500 mt-1">
                {hour.pop > 0 ? `${hour.pop}%` : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
