import { useState } from "react";
import AirportSearch from "@/components/AirportSearch";
import WeatherCard from "@/components/WeatherCard";
import RouteSearch from "@/components/RouteSearch";
import RouteTable from "@/components/RouteTable";
import { getWeatherData, getRouteWeather } from "@/data/mockWeatherData";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  airport: string;
  observation_time: string;
  wind_degrees: number;
  wind_speed: number;
  visibility: number;
  temperature: number;
  conditions: string;
  category: "clear" | "significant" | "severe";
}

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [routeWeather, setRouteWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAirportSearch = async (icao: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const weather = getWeatherData(icao);
      setCurrentWeather(weather);
      
      toast({
        title: "Weather Retrieved",
        description: `Got weather data for ${icao}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSearch = async (airports: string[]) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const weatherData = getRouteWeather(airports);
      setRouteWeather(weatherData);
      
      toast({
        title: "Route Weather Retrieved",
        description: `Got weather for ${airports.length} airports`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch route weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Airport Search Section */}
        <section className="text-center">
          <AirportSearch onSearch={handleAirportSearch} loading={loading} />
        </section>

        {/* Current Weather Display */}
        {currentWeather && (
          <section className="flex justify-center">
            <WeatherCard weather={currentWeather} />
          </section>
        )}

        <Separator className="my-8" />

        {/* Route Planning Section */}
        <section className="max-w-4xl mx-auto">
          <RouteSearch onRouteSearch={handleRouteSearch} loading={loading} />
        </section>

        {/* Route Weather Table */}
        {routeWeather.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <RouteTable weatherData={routeWeather} />
          </section>
        )}

        {/* Instructions */}
        {!currentWeather && routeWeather.length === 0 && (
          <section className="max-w-2xl mx-auto text-center mt-12">
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-card)] border border-border">
              <h3 className="text-lg font-semibold text-primary mb-3">How to Use</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Enter a 4-letter ICAO airport code to get current weather conditions</p>
                <p>• Use route planning to get weather for multiple airports along your flight path</p>
                <p>• Weather categories: <span className="text-weather-clear font-semibold">VFR (Clear)</span>, <span className="text-weather-significant font-semibold">MVFR (Marginal)</span>, <span className="text-weather-severe font-semibold">IFR (Severe)</span></p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
