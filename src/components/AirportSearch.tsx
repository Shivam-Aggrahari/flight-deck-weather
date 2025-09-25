import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plane } from "lucide-react";

interface AirportSearchProps {
  onSearch: (icao: string) => void;
  loading?: boolean;
}

const AirportSearch = ({ onSearch, loading = false }: AirportSearchProps) => {
  const [icao, setIcao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (icao.trim()) {
      onSearch(icao.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-primary to-primary-hover p-3 rounded-full">
            <Plane className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">Aviation Weather</h1>
        <p className="text-muted-foreground">Get current weather conditions for any airport</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter ICAO code (e.g., KJFK, KSFO, EGLL)"
            value={icao}
            onChange={(e) => setIcao(e.target.value)}
            className="text-lg py-3 px-4 bg-card shadow-[var(--shadow-card)]"
            maxLength={4}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={loading || !icao.trim()}
          className="px-6 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-[var(--shadow-aviation)]"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Get Weather
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Enter a 4-letter ICAO airport code (e.g., KJFK for JFK, KSFO for San Francisco)</p>
      </div>
    </div>
  );
};

export default AirportSearch;