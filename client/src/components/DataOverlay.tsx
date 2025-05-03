import { useMemo } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import DataIndicator from "./DataIndicator";
import { InterfacePanel, InterfaceTitle, InterfaceDivider } from "./ui/interface";

interface CategorySummary {
  average: number;
  maximum: number;
  minimum: number;
  totalCountries: number;
  highCount: number;
  lowCount: number;
}

type CategorySummaries = {
  [K in DataCategory]?: CategorySummary | null;
};

export default function DataOverlay() {
  const { selectedCategory, dataByCountry, isLoading } = useGlobeData();
  
  // Calculate summary data for all categories
  const allCategorySummaries = useMemo<CategorySummaries>(() => {
    if (isLoading || !dataByCountry) return {};
    
    const categories: DataCategory[] = [
      "health", "happiness", "environmental", "qualityOfLife", "violence"
    ];
    
    const summaries: CategorySummaries = {};
    
    categories.forEach(category => {
      // Extract all values for this category
      const values = Object.values(dataByCountry)
        .map(countryData => countryData[category] || 0)
        .filter(value => value > 0); // Filter out zeros
      
      if (values.length === 0) {
        summaries[category] = null;
        return;
      }
      
      // Calculate statistics
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      // Count countries in different ranges
      const countryCount = values.length;
      const highCount = values.filter(v => v > avg * 1.25).length;
      const lowCount = values.filter(v => v < avg * 0.75).length;
      
      summaries[category] = {
        average: avg,
        maximum: max,
        minimum: min,
        totalCountries: countryCount,
        highCount,
        lowCount
      };
    });
    
    return summaries;
  }, [dataByCountry, isLoading]);
  
  // Get the title and description for each category
  const categoryInfoMap = {
    health: {
      title: "Health Index",
      description: "Life expectancy metrics",
      icon: "heart",
      color: "cyan"
    },
    happiness: {
      title: "Happiness Index",
      description: "Life satisfaction metrics",
      icon: "chart",
      color: "cyan"
    },
    environmental: {
      title: "Environmental",
      description: "Environmental quality",
      icon: "database",
      color: "cyan"
    },
    qualityOfLife: {
      title: "Quality of Life",
      description: "Standard of living metrics",
      icon: "zap",
      color: "cyan"
    },
    violence: {
      title: "Peace Index",
      description: "Conflict and safety metrics",
      icon: "globe",
      color: "cyan"
    }
  };
  
  if (Object.keys(allCategorySummaries).length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Left side data panels */}
      <div className="absolute top-20 left-5 z-40 pointer-events-none space-y-5 max-w-xs">
        <CategoryPanel 
          category="health" 
          summary={allCategorySummaries.health} 
          isSelected={selectedCategory === "health"}
        />
        <CategoryPanel 
          category="happiness" 
          summary={allCategorySummaries.happiness} 
          isSelected={selectedCategory === "happiness"}
        />
      </div>
      
      {/* Right side data panels */}
      <div className="absolute top-20 right-5 z-40 pointer-events-none space-y-5 max-w-xs">
        <CategoryPanel 
          category="environmental" 
          summary={allCategorySummaries.environmental} 
          isSelected={selectedCategory === "environmental"}
        />
        <CategoryPanel 
          category="qualityOfLife" 
          summary={allCategorySummaries.qualityOfLife} 
          isSelected={selectedCategory === "qualityOfLife"}
        />
        <CategoryPanel 
          category="violence" 
          summary={allCategorySummaries.violence} 
          isSelected={selectedCategory === "violence"}
        />
      </div>
    </>
  );
}

// Component for a single category panel
function CategoryPanel({ category, summary, isSelected }: { 
  category: DataCategory; 
  summary: CategorySummary | null; 
  isSelected: boolean;
}) {
  if (!summary) return null;
  
  // Define type-safe info map
  type CategoryInfo = {
    [key in DataCategory]: {
      title: string;
      description: string;
      icon: string;
      color: string;
      unit: string;
    }
  };
  
  // Get the title and description for the category
  const categoryInfoMap: CategoryInfo = {
    health: {
      title: "Health Index",
      description: "Life expectancy metrics",
      icon: "heart",
      color: "text-cyan-400",
      unit: "years"
    },
    happiness: {
      title: "Happiness Index",
      description: "Life satisfaction metrics",
      icon: "chart",
      color: "text-cyan-400",
      unit: "/10"
    },
    environmental: {
      title: "Environmental",
      description: "Environmental quality",
      icon: "database",
      color: "text-cyan-400",
      unit: "/100"
    },
    qualityOfLife: {
      title: "Quality of Life",
      description: "Standard of living metrics",
      icon: "zap",
      color: "text-cyan-400",
      unit: "/100"
    },
    violence: {
      title: "Peace Index",
      description: "Conflict and safety metrics",
      icon: "globe",
      color: "text-cyan-400",
      unit: "/100"
    }
  };
  
  const info = categoryInfoMap[category];
  
  return (
    <InterfacePanel focused={isSelected} className="p-4">
      <InterfaceTitle className="mb-2 flex items-center">
        <span className="mr-2">{info.title}</span>
        {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>}
      </InterfaceTitle>
      
      <p className="text-gray-300 text-xs mb-3">{info.description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <DataIndicator 
          label="Global Average" 
          value={`${summary.average.toFixed(1)}${info.unit}`} 
          icon={info.icon}
          color={info.color} 
        />
        <DataIndicator 
          label="Countries" 
          value={summary.totalCountries.toString()} 
          icon="database"
          color={info.color} 
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-900 mr-1"></span>
          <span>Low</span>
        </div>
        <div>•••</div>
        <div className="flex items-center">
          <span>High</span>
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 ml-1"></span>
        </div>
      </div>
    </InterfacePanel>
  );
}
