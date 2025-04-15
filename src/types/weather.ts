
// Type definitions for the weather app

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_condition: WeatherCondition;
  weather_description: string;
  weather_icon: string;
  pressure: number;
  visibility: number;
  uv_index: number;
}

export interface HourlyForecast {
  timestamp: string;
  temp: number;
  weather_condition: WeatherCondition;
  weather_icon: string;
  pop: number; // Probability of precipitation (%)
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  weather_condition: WeatherCondition;
  weather_icon: string;
  pop: number; // Probability of precipitation (%)
}

export interface WeatherData {
  id: string;
  city: string;
  country: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: string;
}

export interface CurrentWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: WeatherCondition;
      description: string;
      icon: string;
    }
  ],
  base: string,
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  },
  visibility: number,
  wind: {
    speed: number;
    deg: number;
    gust: number;
  },
  clouds: {
    all: number;
  },
  dt: number,
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  },
  timezone: number,
  id: number,
  name: string,
  cod: number;
}

export interface ForcastWeatherResponse {
    cod: string;
    message: number;
    cnt: number;
    list: [
        {
            dt: number,
            main: {
                temp: number,
                feels_like: number,
                temp_min: number,
                temp_max: number,
                pressure: number,
                sea_level: number,
                grnd_level: number,
                humidity: number,
                temp_kf: number
            },
            weather: [
                {
                    id: number,
                    main: WeatherCondition,
                    description: string,
                    icon: string
                }
            ],
            clouds: {
                all: number
            },
            wind: {
                speed: number,
                deg: number,
                gust: number
            },
            visibility: number,
            pop: number,
            sys: {
                pod: string
            },
            dt_txt: string
        },
    ],
    city: {
        id: number,
        name: string,
        coord: {
            lat: number,
            lon: number
        },
        country: string,
        population: number,
        timezone: number,
        sunrise: number,
        sunset: number
    }
}

export interface WidgetConfig {
  id: string;
  city: string;
  position: {
    x: number;
    y: number;
  };
  forecastDays: number;
  isHourlyVisible: boolean;
  latitude?: number; // Added for storing location coordinates
  longitude?: number; // Added for storing location coordinates
}

export type WeatherCondition = 
  | 'Clear' 
  | 'Clouds' 
  | 'Rain' 
  | 'Drizzle' 
  | 'Thunderstorm' 
  | 'Snow' 
  | 'Mist' 
  | 'Smoke' 
  | 'Haze' 
  | 'Dust' 
  | 'Fog' 
  | 'Sand' 
  | 'Ash' 
  | 'Squall' 
  | 'Tornado';
