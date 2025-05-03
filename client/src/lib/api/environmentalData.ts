import { CountryData } from "../types";

// This module handles fetching and processing environmental data
// Documentation: Environmental Performance Index (EPI)

export async function fetchEnvironmentalData(): Promise<Record<string, CountryData>> {
  try {
    // For the Environmental Performance Index, we'll use data from the latest report
    // EPI ranks countries on 24 performance indicators across 10 issue categories
    
    // In a production app, you would fetch this data from an API:
    // const response = await fetch('https://epi.yale.edu/api/data');
    
    // For demonstration, we'll use a selection of EPI data
    const epiData = getEnvironmentalPerformanceData();
    
    // Process the data into our format
    const countryData: Record<string, CountryData> = {};
    
    epiData.forEach(country => {
      // EPI scores are already on a 0-100 scale
      countryData[country.code] = {
        environmental: country.score
      };
    });
    
    return countryData;
  } catch (error) {
    console.error("Error fetching environmental data:", error);
    // Return empty data in case of failure
    return {};
  }
}

// Data derived from the Environmental Performance Index
// Scores are on a scale of 0-100, with higher values being better
function getEnvironmentalPerformanceData() {
  return [
    { code: "DNK", score: 82.5 },
    { code: "GBR", score: 81.3 },
    { code: "FIN", score: 80.1 },
    { code: "MLT", score: 80.0 },
    { code: "SWE", score: 78.7 },
    { code: "LUX", score: 77.9 },
    { code: "SVN", score: 76.5 },
    { code: "AUT", score: 75.5 },
    { code: "CHE", score: 75.3 },
    { code: "ISL", score: 74.3 },
    { code: "FRA", score: 74.0 },
    { code: "DEU", score: 73.2 },
    { code: "NLD", score: 73.0 },
    { code: "EST", score: 72.7 },
    { code: "NOR", score: 72.2 },
    { code: "IRL", score: 72.0 },
    { code: "JPN", score: 70.1 },
    { code: "USA", score: 69.3 },
    { code: "CAN", score: 67.9 },
    { code: "ESP", score: 67.7 },
    { code: "PRT", score: 67.0 },
    { code: "ITA", score: 65.5 },
    { code: "NZL", score: 65.0 },
    { code: "GRC", score: 64.5 },
    { code: "KOR", score: 64.1 },
    { code: "AUS", score: 63.1 },
    { code: "ISR", score: 62.8 },
    { code: "SVK", score: 62.3 },
    { code: "LTU", score: 62.0 },
    { code: "CZE", score: 61.6 },
    { code: "HUN", score: 61.0 },
    { code: "POL", score: 60.9 },
    { code: "BLR", score: 59.3 },
    { code: "LVA", score: 58.8 },
    { code: "ROU", score: 58.7 },
    { code: "RUS", score: 56.8 },
    { code: "BRA", score: 55.7 },
    { code: "CHL", score: 55.3 },
    { code: "UKR", score: 54.2 },
    { code: "CHN", score: 53.8 },
    { code: "ZAF", score: 53.8 },
    { code: "MYS", score: 52.8 },
    { code: "MEX", score: 52.6 },
    { code: "TUR", score: 52.3 },
    { code: "ARG", score: 52.2 },
    { code: "THA", score: 51.0 },
    { code: "VNM", score: 49.8 },
    { code: "IDN", score: 48.4 },
    { code: "PHL", score: 46.7 },
    { code: "IND", score: 45.5 },
    { code: "NGA", score: 44.6 },
    { code: "EGY", score: 43.3 },
    { code: "KEN", score: 42.7 },
    { code: "ETH", score: 40.8 },
    { code: "TZA", score: 39.5 },
    { code: "LBN", score: 38.2 },
    { code: "IRQ", score: 37.6 },
    { code: "AFG", score: 32.8 },
  ];
}
