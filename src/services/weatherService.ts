import { CurrentWeatherResponse, ForcastWeatherResponse, GeoLocation } from "@/types/weather";

const API_KEY =  import.meta.env.VITE_OPENWEATHERMAP_API_KEY || "293d948ce4ea4b618a765c88831313bd";
const BASE_URL =  import.meta.env.VITE_OPENWEATHERMAP_BASE_URL || "https://api.openweathermap.org/data/2.5";
const GEO_URL =  import.meta.env.VITE_OPENWEATHERMAP_GEO_URL || "https://api.openweathermap.org/geo/1.0";

export async function searchLocation(query: string, limit = 5): Promise<GeoLocation[]> {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=${limit}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
}

export async function fetchCurrentWeatherData(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch current weather data");
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    throw error;
  }
}

export async function fetchForecastWeatherData(lat: number, lon: number): Promise<ForcastWeatherResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch forecast weather data");
    }
    
    const data = await response.json();
    
    return data
  } catch (error) {
    console.error("Error fetching forecast weather data:", error);
    throw error;
  }
}
