import { CountryData } from "../types";

// This module handles fetching and processing quality of life data
// Source: World Bank Poverty and Inequality Platform (PIP)

export async function fetchQualityOfLifeData(): Promise<Record<string, CountryData>> {
  try {
    // For quality of life data, we'll use a combination of HDI (Human Development Index)
    // and economic indicators
    
    // In a production app, you would fetch from the World Bank API:
    // const response = await fetch('https://api.worldbank.org/v2/country/all/indicator/SI.POV.DDAY?format=json');
    
    // For demonstration, we'll use a curated dataset
    const qualityData = getQualityOfLifeData();
    
    // Process data into our standard format
    const countryData: Record<string, CountryData> = {};
    
    qualityData.forEach(country => {
      // Quality of life scores are on a 0-100 scale
      countryData[country.code] = {
        qualityOfLife: country.score
      };
    });
    
    return countryData;
  } catch (error) {
    console.error("Error fetching quality of life data:", error);
    // Return empty data in case of failure
    return {};
  }
}

// Data representing quality of life metrics (based on HDI and other indices)
// Scores are normalized to a 0-100 scale for consistency
function getQualityOfLifeData() {
  return [
    { code: "NOR", score: 95.7 },
    { code: "CHE", score: 95.5 },
    { code: "IRL", score: 95.2 },
    { code: "HKG", score: 94.9 },
    { code: "ISL", score: 94.7 },
    { code: "DEU", score: 94.2 },
    { code: "SWE", score: 94.0 },
    { code: "AUS", score: 93.8 },
    { code: "NLD", score: 93.4 },
    { code: "DNK", score: 93.2 },
    { code: "FIN", score: 92.8 },
    { code: "SGP", score: 92.5 },
    { code: "GBR", score: 92.1 },
    { code: "CAN", score: 91.9 },
    { code: "NZL", score: 91.7 },
    { code: "USA", score: 91.4 },
    { code: "BEL", score: 91.2 },
    { code: "JPN", score: 91.0 },
    { code: "AUT", score: 90.8 },
    { code: "LUX", score: 90.5 },
    { code: "KOR", score: 90.2 },
    { code: "ISR", score: 89.8 },
    { code: "SVN", score: 89.5 },
    { code: "ITA", score: 88.5 },
    { code: "ESP", score: 88.3 },
    { code: "CZE", score: 87.9 },
    { code: "FRA", score: 87.8 },
    { code: "MLT", score: 87.3 },
    { code: "EST", score: 86.9 },
    { code: "GRC", score: 86.4 },
    { code: "POL", score: 86.3 },
    { code: "LTU", score: 86.0 },
    { code: "ARE", score: 85.9 },
    { code: "SAU", score: 85.6 },
    { code: "SVK", score: 85.5 },
    { code: "LVA", score: 84.8 },
    { code: "PRT", score: 84.5 },
    { code: "QAT", score: 84.3 },
    { code: "HUN", score: 83.8 },
    { code: "HRV", score: 83.5 },
    { code: "ARG", score: 83.2 },
    { code: "TUR", score: 82.0 },
    { code: "MYS", score: 79.5 },
    { code: "RUS", score: 79.3 },
    { code: "KAZ", score: 79.0 },
    { code: "BLR", score: 78.8 },
    { code: "CRI", score: 77.9 },
    { code: "IRN", score: 77.2 },
    { code: "GEO", score: 77.0 },
    { code: "THA", score: 76.6 },
    { code: "MEX", score: 76.1 },
    { code: "BRA", score: 75.1 },
    { code: "COL", score: 74.8 },
    { code: "PER", score: 74.5 },
    { code: "CHN", score: 74.1 },
    { code: "ECU", score: 73.5 },
    { code: "LKA", score: 72.2 },
    { code: "EGY", score: 69.8 },
    { code: "VNM", score: 68.9 },
    { code: "PHL", score: 68.0 },
    { code: "IDN", score: 67.8 },
    { code: "ZAF", score: 67.0 },
    { code: "MAR", score: 66.5 },
    { code: "GTM", score: 62.9 },
    { code: "IND", score: 61.0 },
    { code: "KEN", score: 55.3 },
    { code: "TZA", score: 51.2 },
    { code: "NGA", score: 48.7 },
    { code: "ETH", score: 47.3 },
    { code: "AFG", score: 45.3 },
    { code: "LBN", score: 62.0 },
    { code: "IRQ", score: 65.8 },
  ];
}
