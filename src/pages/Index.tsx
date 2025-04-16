
import React from "react";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";
import { WeatherProvider } from "@/contexts/WeatherContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <WeatherProvider>
        <WeatherDashboard />
      </WeatherProvider>
    </div>
  );
};

export default Index;
