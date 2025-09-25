interface ParsedMETAR {
  raw: string;
  airport: string;
  dateTime: string;
  wind: {
    direction: number | null;
    speed: number;
    gusts?: number;
    unit: string;
    description: string;
  };
  visibility: {
    value: number;
    unit: string;
    description: string;
  };
  skyCondition: {
    condition: string;
    description: string;
  };
  temperature: {
    temp: number;
    dewPoint: number;
    description: string;
  };
  pressure: {
    value: number;
    unit: string;
    description: string;
  };
  remarks: string;
  category: "clear" | "significant" | "severe";
  summary: string;
}

const AIRPORT_NAMES: Record<string, string> = {
  KRIC: "Richmond International Airport",
  KJFK: "John F. Kennedy International Airport",
  KSFO: "San Francisco International Airport",
  KORD: "O'Hare International Airport",
  KDEN: "Denver International Airport",
  KBOS: "Logan International Airport",
  KLAX: "Los Angeles International Airport",
  KMIA: "Miami International Airport",
};

const SKY_CONDITIONS: Record<string, string> = {
  CLR: "Clear",
  SKC: "Sky Clear",
  FEW: "Few Clouds",
  SCT: "Scattered Clouds",
  BKN: "Broken Clouds",
  OVC: "Overcast",
  VV: "Vertical Visibility"
};

const WEATHER_PHENOMENA: Record<string, string> = {
  RA: "Rain",
  SN: "Snow",
  TS: "Thunderstorm",
  FG: "Fog",
  BR: "Mist",
  HZ: "Haze",
  DZ: "Drizzle",
  PL: "Ice Pellets",
  GR: "Hail",
  SH: "Showers"
};

export function parseMETAR(metarCode: string): ParsedMETAR | null {
  try {
    const parts = metarCode.trim().split(/\s+/);
    if (parts.length < 6) return null;

    const airport = parts[0];
    const dateTime = parts[1];
    
    let windMatch = parts[2].match(/(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?(KT|MPS)/);
    let wind = {
      direction: null as number | null,
      speed: 0,
      gusts: undefined as number | undefined,
      unit: "KT",
      description: "Calm"
    };
    
    if (windMatch) {
      const dir = windMatch[1] === "VRB" ? null : parseInt(windMatch[1]);
      const speed = parseInt(windMatch[2]);
      const gusts = windMatch[4] ? parseInt(windMatch[4]) : undefined;
      const unit = windMatch[5];
      
      wind = {
        direction: dir,
        speed,
        gusts,
        unit,
        description: dir ? `${getWindDirection(dir)} at ${speed} ${unit.toLowerCase()}${gusts ? ` gusting to ${gusts}` : ""}` : `Variable at ${speed} ${unit.toLowerCase()}`
      };
    }

    // Find visibility
    let visibilityIdx = 3;
    let visibility = { value: 10, unit: "SM", description: "10+ statute miles" };
    
    if (parts[visibilityIdx]?.includes("SM")) {
      const visMatch = parts[visibilityIdx].match(/(\d+(?:\/\d+)?|\d+\.\d+)SM/);
      if (visMatch) {
        const visValue = parseFloat(visMatch[1].includes("/") ? 
          eval(visMatch[1]) : visMatch[1]);
        visibility = {
          value: visValue,
          unit: "SM",
          description: `${visValue} statute miles`
        };
      }
      visibilityIdx++;
    }

    // Find sky conditions
    let skyCondition = { condition: "CLR", description: "Clear" };
    for (let i = visibilityIdx; i < parts.length; i++) {
      const part = parts[i];
      if (Object.keys(SKY_CONDITIONS).some(key => part.startsWith(key))) {
        const condition = Object.keys(SKY_CONDITIONS).find(key => part.startsWith(key)) || "CLR";
        skyCondition = {
          condition,
          description: SKY_CONDITIONS[condition]
        };
        break;
      }
    }

    // Find temperature and dew point
    let temperature = { temp: 0, dewPoint: 0, description: "0°C / 0°C" };
    const tempIdx = parts.findIndex(part => part.includes("/") && part.match(/^M?\d+\/M?\d+$/));
    if (tempIdx !== -1) {
      const tempPart = parts[tempIdx];
      const [tempStr, dewStr] = tempPart.split("/");
      const temp = parseInt(tempStr.replace("M", "-"));
      const dewPoint = parseInt(dewStr.replace("M", "-"));
      temperature = {
        temp,
        dewPoint,
        description: `${temp}°C / ${dewPoint}°C`
      };
    }

    // Find pressure
    let pressure = { value: 29.92, unit: "inHg", description: "29.92 inHg" };
    const pressureIdx = parts.findIndex(part => part.startsWith("A") && part.length === 5);
    if (pressureIdx !== -1) {
      const pressurePart = parts[pressureIdx];
      const pressureValue = parseFloat(pressurePart.substring(1, 3) + "." + pressurePart.substring(3));
      pressure = {
        value: pressureValue,
        unit: "inHg",
        description: `${pressureValue} inHg`
      };
    }

    // Find remarks
    const rmkIdx = parts.findIndex(part => part === "RMK");
    const remarks = rmkIdx !== -1 ? parts.slice(rmkIdx + 1).join(" ") : "";

    // Determine category
    const category = categorizeWeather(visibility.value, wind.speed, skyCondition.condition, metarCode);

    // Create summary
    const summary = createSummary(skyCondition, visibility, temperature, wind, pressure);

    return {
      raw: metarCode,
      airport,
      dateTime,
      wind,
      visibility,
      skyCondition,
      temperature,
      pressure,
      remarks,
      category,
      summary
    };
  } catch (error) {
    console.error("Error parsing METAR:", error);
    return null;
  }
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function categorizeWeather(visibility: number, windSpeed: number, skyCondition: string, rawMETAR: string): "clear" | "significant" | "severe" {
  // Severe conditions
  if (rawMETAR.includes("TS") || rawMETAR.includes("SH") || windSpeed > 25 || visibility <= 3) {
    return "severe";
  }
  
  // Significant conditions
  if (visibility < 6 || windSpeed > 15 || skyCondition === "BKN" || skyCondition === "OVC" || 
      rawMETAR.includes("BR") || rawMETAR.includes("HZ") || rawMETAR.includes("FG")) {
    return "significant";
  }
  
  // Clear conditions
  return "clear";
}

function createSummary(skyCondition: any, visibility: any, temperature: any, wind: any, pressure: any): string {
  return `${skyCondition.description}, visibility ${visibility.description}, Temp ${temperature.description}, ${wind.description}, Pressure ${pressure.description}`;
}

export function parseMultipleMETARs(metarText: string): ParsedMETAR[] {
  const lines = metarText.split('\n').filter(line => line.trim().length > 0);
  const parsed: ParsedMETAR[] = [];
  
  for (const line of lines) {
    const result = parseMETAR(line.trim());
    if (result) {
      parsed.push(result);
    }
  }
  
  return parsed;
}

export function getAirportName(icao: string): string {
  return AIRPORT_NAMES[icao] || icao;
}