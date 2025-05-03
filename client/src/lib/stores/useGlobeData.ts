import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Feature, FeatureCollection, DataCategory, CountryData } from "../types";
import { fetchHealthData } from "../api/healthData";
import { fetchHappinessData } from "../api/happinessData";
import { fetchEnvironmentalData } from "../api/environmentalData";
import { fetchQualityOfLifeData } from "../api/qualityOfLifeData";
import { fetchViolenceData } from "../api/violenceData";
import { useDataCache } from "../hooks/useDataCache";

interface GlobeDataState {
  // Data
  countries: Feature[];
  dataByCountry: Record<string, CountryData>;
  
  // UI state
  selectedCategory: DataCategory;
  selectedCountry: string;
  isLoading: boolean;
  
  // Actions
  setSelectedCategory: (category: DataCategory) => void;
  setSelectedCountry: (countryCode: string) => void;
  loadAllData: () => Promise<void>;
}

export const useGlobeData = create<GlobeDataState>()(
  subscribeWithSelector((set, get) => ({
    // Data
    countries: [],
    dataByCountry: {},
    
    // UI state
    selectedCategory: "health",
    selectedCountry: "",
    isLoading: true,
    
    // Actions
    setSelectedCategory: (category) => {
      set({ selectedCategory: category });
    },
    
    setSelectedCountry: (countryCode) => {
      set({ selectedCountry: countryCode });
    },
    
    loadAllData: async () => {
      set({ isLoading: true });
      
      try {
        // Load country boundaries
        await loadCountryData();
        
        // Load all data categories in parallel
        const [
          healthData,
          happinessData,
          environmentalData,
          qualityOfLifeData,
          violenceData
        ] = await Promise.all([
          fetchHealthData(),
          fetchHappinessData(),
          fetchEnvironmentalData(),
          fetchQualityOfLifeData(),
          fetchViolenceData()
        ]);
        
        // Merge all data by country
        const mergedData: Record<string, CountryData> = {};
        
        // Helper to merge data from each category
        const mergeData = (data: Record<string, CountryData>) => {
          Object.entries(data).forEach(([countryCode, countryData]) => {
            mergedData[countryCode] = {
              ...mergedData[countryCode] || {},
              ...countryData
            };
          });
        };
        
        // Merge all data categories
        mergeData(healthData);
        mergeData(happinessData);
        mergeData(environmentalData);
        mergeData(qualityOfLifeData);
        mergeData(violenceData);
        
        set({ 
          dataByCountry: mergedData,
          isLoading: false
        });
      } catch (error) {
        console.error("Error loading globe data:", error);
        set({ isLoading: false });
      }
    }
  }))
);

// Load country boundaries GeoJSON
async function loadCountryData() {
  try {
    const response = await fetch("/data/countries.geojson");
    const data: FeatureCollection = await response.json();
    
    // Store countries in the state
    useGlobeData.setState({ countries: data.features });
  } catch (error) {
    console.error("Error loading country boundaries:", error);
  }
}
