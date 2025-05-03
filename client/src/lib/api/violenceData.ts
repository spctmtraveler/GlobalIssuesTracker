import { CountryData } from "../types";

// This module handles fetching and processing violence/peace data
// Source: Global Peace Index

export async function fetchViolenceData(): Promise<Record<string, CountryData>> {
  try {
    // For violence data, we'll use the Global Peace Index
    // which ranks countries on their level of peacefulness
    
    // In a production app, you would fetch this from the GPI API:
    // const response = await fetch('https://visionofhumanity.org/api/gpi');
    
    // For demonstration, we'll use curated data based on GPI
    const peaceData = getGlobalPeaceData();
    
    // Process data into our standard format
    const countryData: Record<string, CountryData> = {};
    
    peaceData.forEach(country => {
      // Peace index scores - higher is more peaceful
      countryData[country.code] = {
        violence: country.score
      };
    });
    
    return countryData;
  } catch (error) {
    console.error("Error fetching violence data:", error);
    // Return empty data in case of failure
    return {};
  }
}

// Data representing Global Peace Index
// Scores are normalized to a 0-100 scale (higher means more peaceful)
function getGlobalPeaceData() {
  return [
    { code: "ISL", score: 96.7 },
    { code: "NZL", score: 95.3 },
    { code: "PRT", score: 94.9 },
    { code: "AUT", score: 94.5 },
    { code: "DNK", score: 94.2 },
    { code: "IRL", score: 93.8 },
    { code: "CAN", score: 93.1 },
    { code: "SGP", score: 92.8 },
    { code: "SVN", score: 92.5 },
    { code: "JPN", score: 92.3 },
    { code: "CHE", score: 92.0 },
    { code: "CZE", score: 91.5 },
    { code: "FIN", score: 91.2 },
    { code: "HRV", score: 90.8 },
    { code: "NOR", score: 90.5 },
    { code: "MYS", score: 90.0 },
    { code: "QAT", score: 89.6 },
    { code: "DEU", score: 89.2 },
    { code: "HUN", score: 88.8 },
    { code: "BEL", score: 88.5 },
    { code: "SWE", score: 88.1 },
    { code: "NLD", score: 87.8 },
    { code: "SVK", score: 87.4 },
    { code: "POL", score: 87.0 },
    { code: "AUS", score: 86.8 },
    { code: "ESP", score: 86.5 },
    { code: "ROU", score: 86.2 },
    { code: "ITA", score: 85.8 },
    { code: "MLT", score: 85.3 },
    { code: "EST", score: 85.0 },
    { code: "LTU", score: 84.6 },
    { code: "GBR", score: 84.2 },
    { code: "TWN", score: 83.9 },
    { code: "FRA", score: 83.5 },
    { code: "CHL", score: 83.0 },
    { code: "CHN", score: 80.0 },
    { code: "USA", score: 78.9 },
    { code: "VNM", score: 78.6 },
    { code: "BLR", score: 78.2 },
    { code: "GRC", score: 77.8 },
    { code: "ARG", score: 77.3 },
    { code: "PER", score: 76.9 },
    { code: "KAZ", score: 76.5 },
    { code: "BWA", score: 76.1 },
    { code: "LKA", score: 75.8 },
    { code: "MNG", score: 75.3 },
    { code: "IDN", score: 74.9 },
    { code: "TUN", score: 74.6 },
    { code: "SRB", score: 74.1 },
    { code: "ZAF", score: 70.0 },
    { code: "THA", score: 69.8 },
    { code: "BRA", score: 69.0 },
    { code: "MEX", score: 68.2 },
    { code: "GTM", score: 67.8 },
    { code: "IND", score: 67.0 },
    { code: "PHL", score: 66.5 },
    { code: "TUR", score: 66.0 },
    { code: "EGY", score: 65.5 },
    { code: "COL", score: 65.1 },
    { code: "IRN", score: 64.8 },
    { code: "SAU", score: 64.3 },
    { code: "UKR", score: 63.5 },
    { code: "ISR", score: 62.8 },
    { code: "VEN", score: 62.1 },
    { code: "NGA", score: 61.5 },
    { code: "RUS", score: 60.8 },
    { code: "ETH", score: 59.2 },
    { code: "IRQ", score: 56.4 },
    { code: "LBY", score: 55.0 },
    { code: "AFG", score: 50.2 },
    { code: "SYR", score: 48.5 },
    { code: "YEM", score: 47.8 },
  ];
}
