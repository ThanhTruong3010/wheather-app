
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  Cloud, CloudDrizzle, CloudFog, CloudLightning, 
  CloudRain, CloudSnow, Sun, SunDim, Wind, 
  LucideIcon 
} from "lucide-react"
import { CurrentWeatherResponse, ForcastWeatherResponse, WeatherCondition, WeatherData } from "@/types/weather"
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeatherIcon(condition: string): LucideIcon {
  const normalizedCondition = condition as WeatherCondition;
  
  switch(normalizedCondition) {
    case 'Clear':
      return Sun;
    case 'Clouds':
      return Cloud;
    case 'Rain':
      return CloudRain;
    case 'Drizzle':
      return CloudDrizzle;
    case 'Thunderstorm':
      return CloudLightning;
    case 'Snow':
      return CloudSnow;
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return CloudFog;
    case 'Dust':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
    case 'Smoke':
      return Wind;
    default:
      return SunDim;
  }
}

export function getWeatherColor(condition: string): string {
  const normalizedCondition = condition as WeatherCondition;
  
  switch(normalizedCondition) {
    case 'Clear':
      return 'text-weather-sunny';
    case 'Clouds':
      return 'text-weather-cloudy';
    case 'Rain':
    case 'Drizzle':
      return 'text-weather-rainy';
    case 'Thunderstorm':
      return 'text-weather-thunderstorm';
    case 'Snow':
      return 'text-weather-snowy';
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return 'text-weather-misty';
    default:
      return 'text-muted-foreground';
  }
}

export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatTime(dateString: string, includeAmPm = true): string {
  const date = new Date(dateString);
  
  if (includeAmPm) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function transformWeatherData(currentWeather: CurrentWeatherResponse, forecastWeather: ForcastWeatherResponse, city = "Singapore"): WeatherData {
  return {
    id: uuidv4(),
    city,
    current: {
      temp: Math.round(currentWeather.main.temp),
      feels_like: Math.round(currentWeather.main.feels_like),
      humidity: currentWeather.main.humidity,
      pressure: currentWeather.main.pressure,
      wind_speed: Math.round(currentWeather.wind.speed * 10) / 10,
      wind_direction: currentWeather.wind.deg,
      weather_condition: currentWeather.weather[0].main,
      weather_description: currentWeather.weather[0].description,
      weather_icon: currentWeather.weather[0].icon,
      visibility: currentWeather.visibility / 1000, // Convert to km
      // uv_index: currentWeather.current.uvi,
    },
    daily: forecastWeather.list.slice(0, 7).map((day) => ({
      date: new Date(day.dt * 1000).toISOString(),
      temp_max: Math.round(day.main.temp_max),
      temp_min: Math.round(day.main.temp_min),
      weather_condition: day.weather[0].main,
      weather_icon: day.weather[0].icon,
      pop: Math.round(day.pop * 100),
    })),
    hourly: forecastWeather.list.slice(0, 5).map((hour) => ({
      timestamp: new Date(hour.dt * 1000).toISOString(),
      temp: Math.round(hour.main.temp),
      weather_condition: hour.weather[0].main,
      weather_icon: hour.weather[0].icon,
      pop: Math.round(hour.pop * 100),
    })),
    lastUpdated: new Date().toISOString(),
  } as WeatherData;
}
