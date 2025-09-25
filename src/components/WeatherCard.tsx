import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Wind, Eye, Thermometer } from "lucide-react";

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

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "clear":
        return "bg-weather-clear-bg text-weather-clear border-weather-clear";
      case "significant":
        return "bg-weather-significant-bg text-weather-significant border-weather-significant";
      case "severe":
        return "bg-weather-severe-bg text-weather-severe border-weather-severe";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "clear":
        return "VFR - Clear";
      case "significant":
        return "MVFR - Marginal";
      case "severe":
        return "IFR - Severe";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="w-full max-w-md shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-aviation)] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            {weather.airport}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(weather.category)} border font-semibold`}
          >
            {getCategoryLabel(weather.category)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(weather.observation_time).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{weather.wind_degrees}°</p>
              <p className="text-xs text-muted-foreground">{weather.wind_speed} kts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{weather.visibility} SM</p>
              <p className="text-xs text-muted-foreground">Visibility</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{weather.temperature}°C</p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Cloud className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Conditions</p>
              <p className="text-xs text-muted-foreground">{weather.conditions}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;