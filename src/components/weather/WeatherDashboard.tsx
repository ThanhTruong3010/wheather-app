import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useWeather } from "@/contexts/WeatherContext";
import { WeatherWidget } from "./WeatherWidget";
import { CitySearch } from "./CitySearch";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export function WeatherDashboard() {
  const {
    widgets,
    weatherData,
    updateWidgetPosition,
    refreshWeatherData,
    isLoading,
  } = useWeather();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there is no destination or the item is dropped in the same place, do nothing
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the moved widget
    const movedWidget = widgets.find((widget) => widget.id === draggableId);
    if (!movedWidget) return;

    // Calculate new position based on drop location
    // In a real app, we might want to use grid coordinates
    const x = (destination.index % 3) * 10;
    const y = Math.floor(destination.index / 3) * 10;

    // Update the widget position
    updateWidgetPosition(draggableId, x, y, source.index, destination.index);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold cursor-pointer">Weather Dashboard</h1>
        <div className="grid grid-cols-2 items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refreshWeatherData()}
            disabled={isLoading || widgets?.length === 0}
            className="flex items-center"
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh All"}
          </Button>
          <CitySearch />
        </div>
      </div>

      {widgets.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Weather Widgets</h2>
          <p className="text-muted-foreground mb-6">
            Add a city to start tracking weather on your dashboard.
          </p>
          <div className="max-w-xs mx-auto">
            <CitySearch widgets={widgets} />
          </div>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="weather-widgets" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-20"
              >
                {widgets.map((widget, index) => (
                  <WeatherWidget
                    key={widget.id}
                    widget={widget}
                    data={weatherData[widget.id]}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
