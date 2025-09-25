import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";

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

interface RouteTableProps {
  weatherData: WeatherData[];
}

const RouteTable = ({ weatherData }: RouteTableProps) => {
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
        return "VFR";
      case "significant":
        return "MVFR";
      case "severe":
        return "IFR";
      default:
        return "UNK";
    }
  };

  if (weatherData.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-[var(--shadow-card)]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Route className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-bold text-primary">Route Weather Briefing</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Airport</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Wind</TableHead>
                <TableHead className="font-semibold">Visibility</TableHead>
                <TableHead className="font-semibold">Temperature</TableHead>
                <TableHead className="font-semibold">Conditions</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weatherData.map((weather) => (
                <TableRow key={weather.airport} className="hover:bg-muted/50">
                  <TableCell className="font-bold text-primary">{weather.airport}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(weather.observation_time).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {weather.wind_degrees}° {weather.wind_speed} kts
                  </TableCell>
                  <TableCell>{weather.visibility} SM</TableCell>
                  <TableCell>{weather.temperature}°C</TableCell>
                  <TableCell className="text-sm">{weather.conditions}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`${getCategoryColor(weather.category)} border font-semibold`}
                    >
                      {getCategoryLabel(weather.category)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteTable;