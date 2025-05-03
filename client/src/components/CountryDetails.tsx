import { useEffect, useState } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import { X } from "lucide-react";
import { formatDataValue } from "../lib/utils/globeUtils";

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
  const getTrendIndicator = (category: DataCategory, value: number) => {
    // Calculate global average for this category
    const values = Object.values(dataByCountry)
      .map(data => data[category] || 0)
      .filter(val => val > 0);
    
    if (values.length === 0) return null;
    
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    
    // Determine if value is above or below average
    const ratio = value / avg;
    
    if (ratio > 1.25) {
      return <span className="text-green-400">▲ Excellent</span>;
    } else if (ratio > 1.05) {
      return <span className="text-green-300">△ Above Average</span>;
    } else if (ratio > 0.95) {
      return <span className="text-gray-300">○ Average</span>;
    } else if (ratio > 0.75) {
      return <span className="text-red-300">▽ Below Average</span>;
    } else {
      return <span className="text-red-500">▼ Poor</span>;
    }
  };
  
  return (
    <div className="absolute top-20 right-6 z-40">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-5 rounded-lg border border-cyan-900 text-white max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">{countryData.name}</h2>
          <button 
            onClick={() => setSelectedCountry("")}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close country details"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Country data table */}
        <div className="space-y-3">
          {Object.entries(countryData.data).map(([category, value]) => (
            <div key={category} className="flex justify-between items-center p-2 rounded bg-gray-900 bg-opacity-50">
              <span className="text-gray-300">{getCategoryName(category as DataCategory)}</span>
              <div className="flex flex-col items-end">
                <span className="text-cyan-400 font-medium">
                  {formatDataValue(value as number, category as DataCategory)}
                </span>
                <span className="text-xs">
                  {getTrendIndicator(category as DataCategory, value as number)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state if no data */}
        {Object.keys(countryData.data).length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <p>No data available for this country</p>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            Country code: {countryData.code}
          </p>
        </div>
      </div>
    </div>
  );
}
