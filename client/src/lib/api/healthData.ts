import { CountryData } from "../types";

// This module handles fetching and processing health data from the WHO Global Health Observatory API
// Documentation: WHO GHO OData API

export async function fetchHealthData(): Promise<Record<string, CountryData>> {
  try {
    // Using our backend proxy to the WHO Global Health Observatory API
    // to avoid CORS issues
    const endpoint = "/api/health";
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch health data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the data into our format
    const countryData: Record<string, CountryData> = {};
    
    // Process the data from WHO API format
    if (data && data.value && Array.isArray(data.value)) {
      // Filter for the most recent data for each country
      const countryLatestData = new Map<string, any>();
      
      data.value.forEach((item: any) => {
        // Skip if essential fields are missing
        if (!item.SpatialDimValueCode || !item.TimeDim || !item.NumericValue) {
          return;
        }
        
        const countryCode = item.SpatialDimValueCode;
        const year = parseInt(item.TimeDim);
        const value = parseFloat(item.NumericValue);
        
        // Only keep the most recent data for each country
        if (!countryLatestData.has(countryCode) || 
            countryLatestData.get(countryCode).year < year) {
          countryLatestData.set(countryCode, { year, value });
        }
      });
      
      // Convert to our output format
      countryLatestData.forEach((data, countryCode) => {
        // Normalize the score to a 0-100 range (assuming life expectancy 0-100)
        const normalizedValue = data.value;
        
        // Get ISO3 country code or use the original code
        countryData[countryCode] = {
          health: normalizedValue
        };
      });
    }
    
    // If we got no data, use a fallback for demo purposes
    if (Object.keys(countryData).length === 0) {
      console.warn("No health data retrieved from WHO API, using fallback data");
      return getFallbackHealthData();
    }
    
    return countryData;
  } catch (error) {
    console.error("Error fetching health data:", error);
    // Return fallback data in case of failure
    return getFallbackHealthData();
  }
}

// Fallback data for countries in case the API fails
function getFallbackHealthData(): Record<string, CountryData> {
  return {
    "USA": { health: 78.5 },
    "GBR": { health: 81.2 },
    "DEU": { health: 80.9 },
    "FRA": { health: 82.3 },
    "JPN": { health: 84.2 },
    "CHN": { health: 76.7 },
    "IND": { health: 69.4 },
    "BRA": { health: 75.1 },
    "RUS": { health: 71.9 },
    "AUS": { health: 82.8 },
    "CAN": { health: 82.0 },
    "ZAF": { health: 63.9 },
    "NGA": { health: 54.3 },
    "EGY": { health: 71.8 },
    "SAU": { health: 75.0 },
    "THA": { health: 76.9 },
    "MEX": { health: 74.9 },
    "IDN": { health: 71.5 },
  };
}
