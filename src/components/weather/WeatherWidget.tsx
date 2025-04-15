import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  X,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MoreVertical,
} from "lucide-react";
import { WeatherData, WidgetConfig } from "@/types/weather";
import { Draggable } from "react-beautiful-dnd";
import { WeatherIcon } from "./WeatherIcon";
import { DailyForecastView } from "./DailyForecast";
import { HourlyForecastView } from "./HourlyForecast";
import { useWeather } from "@/contexts/WeatherContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherWidgetProps {
  widget: WidgetConfig;
  data?: WeatherData;
  index: number;
}

const DEFAULT_FORECAST_DAYS = [3, 5, 7];

export function WeatherWidget({ widget, data, index }: WeatherWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    removeWidget,
    updateWidgetConfig,
    refreshWeatherData,
    isLoading,
    loadingWidgets,
  } = useWeather();

  // Handle missing data
  if (!data) {
    return (
      <Draggable draggableId={widget.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="mb-4"
          >
            <Card className="w-full md:w-80 bg-card/90 backdrop-blur-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div {...provided.dragHandleProps} className="cursor-grab">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-medium">{widget.city}</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pb-2 pt-4">
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => refreshWeatherData(widget.id)}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }

  const { current, hourly, daily } = data;
  const Icon = WeatherIcon;

  const handleForecastDaysChange = (days: number) => {
    updateWidgetConfig(widget.id, { forecastDays: days });
  };

  const toggleHourlyVisibility = () => {
    updateWidgetConfig(widget.id, { isHourlyVisible: !widget.isHourlyVisible });
  };

  return (
    <Draggable draggableId={widget.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-4"
        >
          <Card
            className={cn(
              "w-full md:w-80 bg-card/90 backdrop-blur-sm transition-all duration-200",
              (isLoading || loadingWidgets[widget.id]) && "opacity-70"
            )}
          >
            <CardHeader className="pb-2 pt-3 flex flex-row items-center justify-between">
              <div {...provided.dragHandleProps} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center">
                <h2 className="text-lg font-medium">{data.city}</h2>
                <span className="text-xs text-muted-foreground ml-1">
                  {data.country}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-popover text-popover-foreground"
                  >
                    <DropdownMenuLabel>Widget Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleHourlyVisibility}>
                      {widget.isHourlyVisible ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Hide Hourly</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Show Hourly</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuLabel>Forecast Days</DropdownMenuLabel>
                    {DEFAULT_FORECAST_DAYS.map((days) => (
                      <DropdownMenuItem
                        key={days}
                        className={cn(
                          widget.forecastDays === days &&
                            "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleForecastDaysChange(days)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{days} Days</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-2 pt-0">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Icon
                      condition={current.weather_condition}
                      size={36}
                      className="mr-2"
                    />
                    <div>
                      <div className="text-2xl font-bold">{current.temp}°C</div>
                      <div className="text-xs text-muted-foreground">
                        Feels like {current.feels_like}°C
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm capitalize font-medium">
                      {current.weather_description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(data.lastUpdated, "short")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground">Wind</div>
                    <div className="font-medium">{current.wind_speed} m/s</div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground">Humidity</div>
                    <div className="font-medium">{current.humidity}%</div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground">UV Index</div>
                    <div className="font-medium">
                      {current.uv_index || "N/A"}
                    </div>
                  </div>
                </div>

                {widget.isHourlyVisible && (
                  <HourlyForecastView
                    hourlyData={hourly}
                    className="mt-2 mb-4"
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full my-1 flex items-center justify-center text-xs"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide forecast
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show forecast
                    </>
                  )}
                </Button>

                {isExpanded && (
                  <DailyForecastView
                    dailyData={daily}
                    days={widget.forecastDays}
                    className="mt-2"
                  />
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => refreshWeatherData(widget.id)}
                disabled={isLoading || loadingWidgets[widget.id]}
              >
                <RefreshCcw
                  className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
                />
                {isLoading || loadingWidgets[widget.id]
                  ? "Refreshing..."
                  : "Refresh Data"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
