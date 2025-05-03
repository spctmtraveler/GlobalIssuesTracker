import { useMemo } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import DataIndicator from "./DataIndicator";

export default function DataOverlay() {
  const { selectedCategory, dataByCountry, isLoading } = useGlobeData();
  
  // Calculate global summary data
  const summaryData = useMemo(() => {
    if (isLoading || !dataByCountry) return null;
    
    // Extract all values for the selected category
    const values = Object.values(dataByCountry)
      .map(countryData => countryData[selectedCategory] || 0)
      .filter(value => value > 0); // Filter out zeros
    
    if (values.length === 0) return null;
    
    // Calculate statistics
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Count countries in different ranges
    const countryCount = values.length;
    const highCount = values.filter(v => v > avg * 1.25).length;
    const lowCount = values.filter(v => v < avg * 0.75).length;
    
    return {
      average: avg,
      maximum: max,
      minimum: min,
      totalCountries: countryCount,
      highCount,
      lowCount
    };
  }, [dataByCountry, selectedCategory, isLoading]);
  
  // Get the title and description for the current category
  const getCategoryInfo = (category: DataCategory) => {
    switch(category) {
      case "health":
        return {
          title: "Global Health",
          description: "Life expectancy and disease burden metrics",
          goodLabel: "Higher values indicate better health outcomes",
          badLabel: "Lower values indicate worse health outcomes"
        };
      case "happiness":
        return {
          title: "Happiness Index",
          description: "Wellbeing and life satisfaction metrics",
          goodLabel: "Higher values indicate greater happiness",
          badLabel: "Lower values indicate less happiness"
        };
      case "environmental":
        return {
          title: "Environmental Health",
          description: "Air quality, biodiversity and climate health",
          goodLabel: "Higher values indicate better environmental conditions",
          badLabel: "Lower values indicate worse environmental conditions"
        };
      case "qualityOfLife":
        return {
          title: "Quality of Life",
          description: "Standard of living and poverty metrics",
          goodLabel: "Higher values indicate better quality of life",
          badLabel: "Lower values indicate higher poverty rates"
        };
      case "violence":
        return {
          title: "Peace Index",
          description: "Conflict and safety metrics",
          goodLabel: "Higher values indicate more peaceful conditions",
          badLabel: "Lower values indicate higher conflict levels"
        };
      default:
        return {
          title: "Global Data",
          description: "Select a category to explore",
          goodLabel: "",
          badLabel: ""
        };
    }
  };
  
  const categoryInfo = getCategoryInfo(selectedCategory);
  
  if (!summaryData) {
    return null;
  }
  
  return (
    <div className="absolute top-20 left-6 z-40 pointer-events-none">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-5 rounded-lg border border-cyan-900 text-white max-w-md">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2 flex items-center">
          <span className="mr-2">{categoryInfo.title}</span>
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
        </h2>
        
        <p className="text-gray-300 text-sm mb-4">{categoryInfo.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DataIndicator 
            label="Global Average" 
            value={summaryData.average.toFixed(2)} 
            icon="globe"
            color="text-cyan-400" 
          />
          <DataIndicator 
            label="Countries Analyzed" 
            value={summaryData.totalCountries.toString()} 
            icon="database"
            color="text-blue-400" 
          />
          <DataIndicator 
            label="High Performance" 
            value={summaryData.highCount.toString()} 
            icon="trending-up"
            color="text-green-400" 
          />
          <DataIndicator 
            label="Low Performance" 
            value={summaryData.lowCount.toString()} 
            icon="trending-down"
            color="text-red-400" 
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            <span>{categoryInfo.badLabel}</span>
          </div>
          <div className="flex items-center">
            <span>{categoryInfo.goodLabel}</span>
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-1"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
