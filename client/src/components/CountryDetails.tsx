import { useEffect, useState } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import { X } from "lucide-react";
import { formatDataValue } from "../lib/utils/globeUtils";
import { InterfacePanel, InterfaceTitle, InterfaceStat, InterfaceDivider } from "./ui/interface";

export default function CountryDetails() {
  const { selectedCountry, setSelectedCountry, dataByCountry, countries } = useGlobeData();
  const [countryData, setCountryData] = useState<any>(null);
  
  // Fetch country data when a country is selected
  useEffect(() => {
    if (selectedCountry && dataByCountry) {
      const data = dataByCountry[selectedCountry] || {};
      
      // Find country name from GeoJSON data
      const country = countries.find(c => c.properties.ISO_A3 === selectedCountry);
      const countryName = country ? country.properties.NAME : selectedCountry;
      
      setCountryData({
        code: selectedCountry,
        name: countryName,
        data
      });
    } else {
      setCountryData(null);
    }
  }, [selectedCountry, dataByCountry, countries]);
  
  if (!countryData) {
    return null;
  }
  
  // Map category to readable name
  const getCategoryName = (category: DataCategory): string => {
    const categoryMap: Record<DataCategory, string> = {
      health: "Health Index",
      happiness: "Happiness Score",
      environmental: "Environmental Performance",
      qualityOfLife: "Quality of Life Score",
      violence: "Peace Index"
    };
    return categoryMap[category] || category;
  };

  // Generate trend indicator
  const getTrendIndicator = (category: DataCategory, value: number): "up" | "down" | "neutral" => {
    // Calculate global average for this category
    const values = Object.values(dataByCountry)
      .map(data => data[category] || 0)
      .filter(val => val > 0);
    
    if (values.length === 0) return "neutral";
    
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    
    // Determine if value is above or below average
    const ratio = value / avg;
    
    if (ratio > 1.10) {
      return "up";
    } else if (ratio < 0.90) {
      return "down";
    } else {
      return "neutral";
    }
  };
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <InterfacePanel focused className="p-5 min-w-[350px] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <InterfaceTitle>{countryData.name}</InterfaceTitle>
          <button 
            onClick={() => setSelectedCountry("")}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
            aria-label="Close country details"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Country data in stats panel */}
        <div className="space-y-3">
          {Object.entries(countryData.data).map(([category, value]) => (
            <InterfaceStat
              key={category}
              label={getCategoryName(category as DataCategory)}
              value={formatDataValue(value as number, category as DataCategory)}
              trend={getTrendIndicator(category as DataCategory, value as number)}
            />
          ))}
        </div>
        
        {/* Empty state if no data */}
        {Object.keys(countryData.data).length === 0 && (
          <div className="text-center py-4 text-gray-400 border border-cyan-900/30 rounded bg-black/20 mt-3">
            <p>No data available for this country</p>
          </div>
        )}
        
        <InterfaceDivider />
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-cyan-800">
            Country code: <span className="text-cyan-400">{countryData.code}</span>
          </span>
          <span className="text-xs text-cyan-800">
            Source: <span className="text-cyan-600">Global Index Database</span>
          </span>
        </div>
      </InterfacePanel>
    </div>
  );
}
