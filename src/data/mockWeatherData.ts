// Mock weather data for demonstration
export const mockWeatherDatabase: Record<string, any> = {
  KJFK: {
    airport: "KJFK",
    observation_time: new Date().toISOString(),
    wind_degrees: 270,
    wind_speed: 12,
    visibility: 10,
    temperature: 22,
    conditions: "Clear skies",
    category: "clear"
  },
  KSFO: {
    airport: "KSFO",
    observation_time: new Date().toISOString(),
    wind_degrees: 280,
    wind_speed: 8,
    visibility: 6,
    temperature: 18,
    conditions: "Partly cloudy",
    category: "clear"
  },
  KORD: {
    airport: "KORD",
    observation_time: new Date().toISOString(),
    wind_degrees: 180,
    wind_speed: 18,
    visibility: 3,
    temperature: 15,
    conditions: "Light rain",
    category: "significant"
  },
  KDEN: {
    airport: "KDEN",
    observation_time: new Date().toISOString(),
    wind_degrees: 220,
    wind_speed: 28,
    visibility: 1,
    temperature: 8,
    conditions: "Thunderstorms",
    category: "severe"
  },
  EGLL: {
    airport: "EGLL",
    observation_time: new Date().toISOString(),
    wind_degrees: 250,
    wind_speed: 15,
    visibility: 8,
    temperature: 12,
    conditions: "Overcast",
    category: "clear"
  },
  LFPG: {
    airport: "LFPG",
    observation_time: new Date().toISOString(),
    wind_degrees: 90,
    wind_speed: 22,
    visibility: 2,
    temperature: 16,
    conditions: "Heavy rain, low clouds",
    category: "significant"
  }
};

export const getWeatherData = (icao: string) => {
  const weather = mockWeatherDatabase[icao.toUpperCase()];
  if (!weather) {
    return {
      airport: icao.toUpperCase(),
      observation_time: new Date().toISOString(),
      wind_degrees: 0,
      wind_speed: 0,
      visibility: 0,
      temperature: 0,
      conditions: "No data available",
      category: "severe"
    };
  }
  return weather;
};

export const getRouteWeather = (airports: string[]) => {
  return airports.map(airport => getWeatherData(airport));
};