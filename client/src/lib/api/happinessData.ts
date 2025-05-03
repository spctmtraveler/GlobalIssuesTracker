import { CountryData } from "../types";

// This module handles fetching and processing happiness data from the World Happiness Report
// Documentation: World Happiness Report Data Dashboard

export async function fetchHappinessData(): Promise<Record<string, CountryData>> {
  try {
    // Normally we would fetch from the World Happiness Report API
    // But for simplicity and reliability, we'll use a pre-prepared dataset
    // with recent happiness scores
    
    // In a production app, you would implement a fetch from the API like:
    // const response = await fetch('https://happiness-report-api.example/data');
    
    // For demonstration, we'll use hard-coded data based on the latest World Happiness Report
    const happinessData = getHappinessData();
    
    // Process data into our standard format
    const countryData: Record<string, CountryData> = {};
    
    happinessData.forEach(country => {
      // Convert scores to a 0-10 scale (the original format from the report)
      countryData[country.code] = {
        happiness: country.score
      };
    });
    
    return countryData;
  } catch (error) {
    console.error("Error fetching happiness data:", error);
    // Return empty data in case of failure
    return {};
  }
}

// This represents data derived from the World Happiness Report
// Each country has a happiness score on a scale of 0-10
function getHappinessData() {
  return [
    { code: "FIN", score: 7.8 },
    { code: "DNK", score: 7.6 },
    { code: "ISL", score: 7.5 },
    { code: "CHE", score: 7.5 },
    { code: "NLD", score: 7.4 },
    { code: "SWE", score: 7.3 },
    { code: "NOR", score: 7.3 },
    { code: "ISR", score: 7.2 },
    { code: "NZL", score: 7.1 },
    { code: "AUT", score: 7.1 },
    { code: "AUS", score: 7.1 },
    { code: "IRL", score: 7.0 },
    { code: "USA", score: 6.9 },
    { code: "CAN", score: 6.9 },
    { code: "DEU", score: 6.9 },
    { code: "GBR", score: 6.8 },
    { code: "CZE", score: 6.7 },
    { code: "BEL", score: 6.6 },
    { code: "FRA", score: 6.5 },
    { code: "MEX", score: 6.4 },
    { code: "ESP", score: 6.4 },
    { code: "ITA", score: 6.3 },
    { code: "SVN", score: 6.3 },
    { code: "UZB", score: 6.2 },
    { code: "LTU", score: 6.2 },
    { code: "SVK", score: 6.1 },
    { code: "KOR", score: 6.1 },
    { code: "EST", score: 6.0 },
    { code: "JPN", score: 6.0 },
    { code: "BRA", score: 5.9 },
    { code: "POL", score: 5.9 },
    { code: "GTM", score: 5.8 },
    { code: "ROU", score: 5.8 },
    { code: "KWT", score: 5.8 },
    { code: "THA", score: 5.8 },
    { code: "MYS", score: 5.7 },
    { code: "HUN", score: 5.7 },
    { code: "ARG", score: 5.7 },
    { code: "CHL", score: 5.6 },
    { code: "CHN", score: 5.6 },
    { code: "SRB", score: 5.6 },
    { code: "PRT", score: 5.5 },
    { code: "GRC", score: 5.5 },
    { code: "PHL", score: 5.5 },
    { code: "RUS", score: 5.4 },
    { code: "HKG", score: 5.4 },
    { code: "MNG", score: 5.4 },
    { code: "MDA", score: 5.3 },
    { code: "TUR", score: 5.2 },
    { code: "VNM", score: 5.2 },
    { code: "KAZ", score: 5.2 },
    { code: "IDN", score: 5.1 },
    { code: "PER", score: 5.1 },
    { code: "BLR", score: 5.0 },
    { code: "ZAF", score: 4.9 },
    { code: "IRQ", score: 4.9 },
    { code: "IND", score: 4.8 },
    { code: "EGY", score: 4.6 },
    { code: "ETH", score: 4.2 },
    { code: "KEN", score: 4.2 },
    { code: "UKR", score: 4.1 },
    { code: "NGA", score: 4.0 },
    { code: "TZA", score: 3.7 },
    { code: "ZWE", score: 3.0 },
    { code: "AFG", score: 2.4 },
    { code: "LBN", score: 2.4 },
  ];
}
