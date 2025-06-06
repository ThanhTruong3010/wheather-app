import { WeatherData, WidgetConfig } from "@/types/weather";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchCurrentWeatherData,
  fetchForecastWeatherData,
} from "@/services/weatherService";
import { useToast } from "@/components/ui/use-toast";
import { transformWeatherData } from "@/lib/utils";
import { DEFAULT_TIME_INTERVAL } from "@/constants/wheather";

interface WeatherContextType {
  widgets: WidgetConfig[];
  weatherData: Record<string, WeatherData>;
  addWidget: (
    city: string,
    lat: number,
    lon: number,
    country: string
  ) => Promise<void>;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (
    id: string,
    x: number,
    y: number,
    srcIndex: number,
    destIndex: number
  ) => void;
  updateWidgetConfig: (
    id: string,
    config: Partial<Omit<WidgetConfig, "id" | "city">>
  ) => void;
  refreshWeatherData: (widgetId?: string) => Promise<void>;
  isLoading: boolean;
  loadingWidgets: Record<string, boolean>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [loadingWidgets, setLoadingWidgets] = useState<Record<string, boolean>>(
    {}
  );

  // Load widgets from localStorage on initial render
  useEffect(() => {
    const savedWidgets = localStorage.getItem("weatherWidgets");
    if (!savedWidgets?.length) return;
    try {
      const parsedWidgets = JSON.parse(savedWidgets);
      setWidgets(parsedWidgets);
      // Fetch weather data for each saved widget
      parsedWidgets.forEach((widget: WidgetConfig) => {
        refreshWeatherDataForWidget(widget);
      });
    } catch (error) {
      console.error("Failed to parse saved widgets", error);
    }
  }, []);

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weatherWidgets", JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshWeatherData();
    }, DEFAULT_TIME_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [widgets]);

  const refreshWeatherDataForWidget = async ({
    latitude,
    longitude,
    city,
    id,
  }: WidgetConfig) => {
    try {
      const [currentWeather, forecastWeather] = await Promise.all([
        fetchCurrentWeatherData(latitude, longitude),
        fetchForecastWeatherData(latitude, longitude),
      ]);

      setWeatherData((prev) => ({
        ...prev,
        [id]: transformWeatherData(currentWeather, forecastWeather, city),
      }));
    } catch (error) {
      console.error(`Failed to refresh weather data for ${city}:`, error);
      toast({
        title: "Failed to update weather",
        description: `Could not update weather for ${city}. Please try again later.`,
        variant: "destructive",
      });
    }
  };

  const refreshWeatherData = async (widgetId?: string) => {
    try {
      if (widgetId) {
        // Refresh only the specified widget
        setLoadingWidgets((prev) => ({
          ...prev,
          [widgetId || "all"]: true,
        }));
        const widget = widgets.find((w) => w.id === widgetId);
        if (widget) {
          await refreshWeatherDataForWidget(widget);
          toast({
            title: "Weather Updated",
            description: `Weather data for ${widget.city} has been refreshed.`,
          });
        }
      } else {
        // Refresh all widgets
        setIsLoading(true);
        await Promise.all(
          widgets.map((widget) => refreshWeatherDataForWidget(widget))
        );
        toast({
          title: "Weather Updated",
          description: "All weather data has been refreshed.",
        });
      }
    } catch (error) {
      console.error("Failed to refresh weather data:", error);
      toast({
        title: "Update Failed",
        description: "Failed to refresh weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingWidgets((prev) => ({
        ...prev,
        [widgetId || "all"]: false,
      }));
    }
  };

  const addWidget = async (city: string, lat: number, lon: number) => {
    setLoadingWidgets((prev) => ({
      ...prev,
      [city]: true,
    }));

    try {
      // Check if widget for this city already exists
      const existingWidgetIndex = widgets.findIndex(
        (w) => w.city.toLowerCase() === city.toLowerCase()
      );

      if (existingWidgetIndex !== -1) {
        toast({
          title: "City Already Added",
          description: `${city} is already on your dashboard.`,
          variant: "destructive",
        });
        setLoadingWidgets((prev) => ({
          ...prev,
          [city]: false,
        }));
        return;
      }

      const widgetId = `widget-${Date.now()}`;

      const position = {
        x: (widgets.length % 3) * 10,
        y: Math.floor(widgets.length / 3) * 10,
      };

      const newWidget: WidgetConfig = {
        id: widgetId,
        city,
        position,
        forecastDays: 7,
        isHourlyVisible: true,
        latitude: lat,
        longitude: lon,
      };

      const [currentWeather, forecastWeather] = await Promise.all([
        fetchCurrentWeatherData(lat, lon),
        fetchForecastWeatherData(lat, lon),
      ]);

      setWeatherData((prev) => ({
        ...prev,
        [widgetId]: transformWeatherData(currentWeather, forecastWeather, city),
      }));

      setWidgets((prev) => [...prev, newWidget]);

      toast({
        title: "Widget Added",
        description: `${city} has been added to your dashboard.`,
      });
    } catch (error) {
      console.error("Failed to add widget:", error);
      toast({
        title: "Failed to Add City",
        description: "There was an error adding this city. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingWidgets((prev) => ({
        ...prev,
        [city]: false,
      }));
    }
  };

  const removeWidget = (id: string) => {
    const widgetToRemove = widgets.find((w) => w.id === id);

    if (!widgetToRemove) return;
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
    setWeatherData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });

    toast({
      title: "Widget Removed",
      description: `${widgetToRemove.city} has been removed from your dashboard.`,
    });
  };

  const updateWidgetPosition = (
    id: string,
    x: number,
    y: number,
    srcIndex: number,
    destIndex: number
  ) => {
    const updated = Array.from(widgets);
    const [movedItem] = updated.splice(srcIndex, 1);
    updated.splice(destIndex, 0, movedItem);

    updated.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          position: { x, y },
        };
      }
      return widget;
    });

    setWidgets(updated);
  };

  const updateWidgetConfig = (
    id: string,
    config: Partial<Omit<WidgetConfig, "id" | "city">>
  ) => {
    setWidgets((prev) =>
      prev.map((widget) => {
        if (widget.id === id) {
          return {
            ...widget,
            ...config,
          };
        }
        return widget;
      })
    );
  };

  return (
    <WeatherContext.Provider
      value={{
        widgets,
        weatherData,
        addWidget,
        removeWidget,
        updateWidgetPosition,
        updateWidgetConfig,
        refreshWeatherData,
        isLoading,
        loadingWidgets,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }

  return context;
}
