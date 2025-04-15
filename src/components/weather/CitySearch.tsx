import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Plus } from "lucide-react";
import { searchLocation } from "@/services/weatherService";
import { useWeather } from "@/contexts/WeatherContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GeoLocation } from "@/types/weather";
import { WidgetConfig } from "@/types/weather";

interface CitySearchProps {
  widgets?: WidgetConfig[];
}

export function CitySearch({ widgets }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addWidget } = useWeather();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a city name to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const locations = await searchLocation(query);
      setResults(locations);

      if (locations.length === 0) {
        toast({
          title: "No Results",
          description: `No locations found for "${query}"`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Failed to search for locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCity = async (location: GeoLocation) => {
    try {
      await addWidget(
        location.name,
        location.lat,
        location.lon,
        location.country
      );
      setQuery("");
      setResults([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding city:", error);
      toast({
        title: "Error",
        description: "Failed to add city widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 text-white hover:bg-blue-400">
          <Search className="h-4 w-4 mr-2" />
          {widgets?.length === 0 ? "Search and add city" : "Add city"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Weather Widget</DialogTitle>
          <DialogDescription>
            Search for a city to add to your weather dashboard.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSearch}
          className="flex w-full items-center space-x-2 mt-2"
        >
          <div className="grid flex-1 gap-2">
            <Input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching}
            className="bg-blue-500 hover:bg-blue-400 text-white"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin " />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {results.length > 0 && (
          <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
            <h3 className="text-sm font-medium">Search Results</h3>
            {results.map((location, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border rounded-md"
              >
                <div>
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.country}{" "}
                    {location.state ? `· ${location.state}` : ""}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddCity(location)}
                  className="bg-blue-500 text-white hover:bg-blue-400"
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
