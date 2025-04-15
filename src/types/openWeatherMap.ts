export interface OpenWeatherMapResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pressure: number;
    visibility: number;
    uvi: number;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      main: string;
      icon: string;
    }>;
    pop: number;
  }>;
  daily: Array<{
    dt: number;
    temp: {
      max: number;
      min: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
    pop: number;
  }>;
}
