import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { parseMultipleMETARs, getAirportName } from "@/utils/metarParser";
import { FileText, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const MetarInterpreter = () => {
  const [metarInput, setMetarInput] = useState("");
  const [parsedResults, setParsedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "clear" | "significant" | "severe">("all");
  const { toast } = useToast();

  const exampleMETAR = `KRIC 110454Z 35005KT 10SM CLR 06/M02 A2980 RMK AO2 SLP096 T00561017 401720000
KRIC 110354Z 03003KT 10SM CLR 06/M02 A2981 RMK AO2 SLP099 T00611017
KJFK 110451Z 32008KT 3SM BR BKN008 OVC015 04/03 A2979 RMK AO2 SLP097
KSFO 110456Z 28012G18KT 6SM HZ SCT012 BKN025 14/12 A2995 RMK AO2 SLP148`;

  const handleParseMETAR = async () => {
    if (!metarInput.trim()) {
      toast({
        title: "No Input",
        description: "Please enter METAR reports to parse",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = parseMultipleMETARs(metarInput);
      setParsedResults(results);
      
      toast({
        title: "METAR Parsed Successfully",
        description: `Processed ${results.length} weather reports`,
      });
    } catch (error) {
      toast({
        title: "Parsing Error",
        description: "Failed to parse METAR reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        return "🟢 Clear";
      case "significant":
        return "🟡 Significant";
      case "severe":
        return "🔴 Severe";
      default:
        return "Unknown";
    }
  };

  const filteredResults = parsedResults.filter(result => 
    filter === "all" || result.category === filter
  );

  const loadExample = () => {
    setMetarInput(exampleMETAR);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">METAR Interpreter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Decode aviation weather reports into human-readable format with automatic categorization
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="outline" size="sm">
                ← Back to Weather Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Input Section */}
        <Card className="max-w-4xl mx-auto shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Input METAR Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste multiple METAR reports here (one per line)..."
              value={metarInput}
              onChange={(e) => setMetarInput(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleParseMETAR} disabled={loading}>
                {loading ? "Processing..." : "Decode METAR Reports"}
              </Button>
              <Button variant="outline" onClick={loadExample}>
                Load Example
              </Button>
              <Button variant="outline" onClick={() => setMetarInput("")}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {parsedResults.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Filter Controls */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All ({parsedResults.length})
                  </Button>
                  <Button
                    variant={filter === "clear" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("clear")}
                  >
                    🟢 Clear ({parsedResults.filter(r => r.category === "clear").length})
                  </Button>
                  <Button
                    variant={filter === "significant" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("significant")}
                  >
                    🟡 Significant ({parsedResults.filter(r => r.category === "significant").length})
                  </Button>
                  <Button
                    variant={filter === "severe" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("severe")}
                  >
                    🔴 Severe ({parsedResults.filter(r => r.category === "severe").length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Decoded Weather Reports</span>
                  </CardTitle>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Airport</TableHead>
                        <TableHead className="font-semibold">Weather Summary</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-bold text-primary">{result.airport}</div>
                              <div className="text-xs text-muted-foreground">
                                {getAirportName(result.airport)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm max-w-md">
                            {result.summary}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getCategoryColor(result.category)} border font-semibold`}
                            >
                              {getCategoryLabel(result.category)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {parsedResults.length === 0 && (
          <Card className="max-w-2xl mx-auto shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-center">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Input Format:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Paste raw METAR reports (one per line)</li>
                  <li>Supports standard METAR format with ICAO codes</li>
                  <li>Click "Load Example" to see sample data</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Categories:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="text-weather-clear">🟢 Clear:</span> Good VFR conditions</li>
                  <li><span className="text-weather-significant">🟡 Significant:</span> Marginal VFR/IFR</li>
                  <li><span className="text-weather-severe">🔴 Severe:</span> Poor conditions, storms</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MetarInterpreter;