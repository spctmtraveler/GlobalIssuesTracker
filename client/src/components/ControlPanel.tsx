import { useEffect } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import { useAudio } from "../lib/stores/useAudio";
import { Badge } from "./ui/badge";

export default function ControlPanel() {
  const { selectedCategory, setSelectedCategory, isLoading } = useGlobeData();
  const { playHit } = useAudio();
  
  const categories: Array<{ id: DataCategory; label: string; icon: string }> = [
    { id: "health", label: "Health", icon: "❤️" },
    { id: "happiness", label: "Happiness", icon: "😊" },
    { id: "environmental", label: "Environment", icon: "🌱" },
    { id: "qualityOfLife", label: "Quality of Life", icon: "💰" },
    { id: "violence", label: "Peace Index", icon: "☮️" }
  ];
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        setSelectedCategory(categories[num - 1].id);
        playHit();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [categories, setSelectedCategory, playHit]);
  
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-xl border border-cyan-900 flex items-center space-x-2 select-none">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              playHit();
            }}
            disabled={isLoading}
            className={`relative group p-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[100px] ${
              selectedCategory === category.id 
                ? "bg-cyan-900 text-white" 
                : "bg-gray-900 bg-opacity-50 text-gray-300 hover:bg-gray-800"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="text-xl mb-1">{category.icon}</span>
            <span className="text-sm font-medium">{category.label}</span>
            
            {/* Keyboard shortcut badge */}
            <Badge 
              variant="outline" 
              className="absolute -top-2 -right-2 text-xs px-1.5 bg-gray-800 border-cyan-700"
            >
              {index + 1}
            </Badge>
            
            {/* Glow effect on hover and active */}
            <div 
              className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${
                selectedCategory === category.id 
                  ? "opacity-100" 
                  : "opacity-0 group-hover:opacity-40"
              }`}
              style={{
                boxShadow: "0 0 15px 2px rgba(6, 182, 212, 0.7)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
