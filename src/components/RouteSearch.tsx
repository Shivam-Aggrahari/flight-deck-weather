import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";

interface RouteSearchProps {
  onRouteSearch: (airports: string[]) => void;
  loading?: boolean;
}

const RouteSearch = ({ onRouteSearch, loading = false }: RouteSearchProps) => {
  const [airportsInput, setAirportsInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (airportsInput.trim()) {
      const airports = airportsInput
        .split(",")
        .map(code => code.trim().toUpperCase())
        .filter(code => code.length === 4);
      
      if (airports.length > 0) {
        onRouteSearch(airports);
      }
    }
  };

  const addSampleRoute = () => {
    setAirportsInput("KJFK,KORD,KDEN,KSFO");
  };

  return (
    <Card className="w-full shadow-[var(--shadow-card)]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-bold text-primary">Route Planning</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter ICAO codes separated by commas (e.g., KJFK,KORD,KDEN,KSFO)"
              value={airportsInput}
              onChange={(e) => setAirportsInput(e.target.value)}
              className="text-base py-3 px-4 bg-background shadow-[var(--shadow-card)]"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Separate multiple airport codes with commas
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || !airportsInput.trim()}
              className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-[var(--shadow-aviation)]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              ) : null}
              Get Route Weather
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={addSampleRoute}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Try Sample Route
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteSearch;