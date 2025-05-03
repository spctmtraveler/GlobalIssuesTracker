import { useEffect } from "react";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { DataCategory } from "../lib/types";
import { useAudio } from "../lib/stores/useAudio";
import { Heart, Smile, Leaf, BarChart2, Shield } from "lucide-react";
import { InterfaceBadge } from "./ui/interface";

export default function ControlPanel() {
  const { selectedCategory, setSelectedCategory, isLoading } = useGlobeData();
  const { playHit } = useAudio();
  
  const categories: Array<{ id: DataCategory; label: string; icon: React.ReactNode }> = [
    { id: "health", label: "Health", icon: <Heart className="w-5 h-5" /> },
    { id: "happiness", label: "Happiness", icon: <Smile className="w-5 h-5" /> },
    { id: "environmental", label: "Environment", icon: <Leaf className="w-5 h-5" /> },
    { id: "qualityOfLife", label: "Quality of Life", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "violence", label: "Peace Index", icon: <Shield className="w-5 h-5" /> }
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
      <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-cyan-900/70 flex items-center space-x-3 select-none">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              playHit();
            }}
            disabled={isLoading}
            className={`relative group px-4 py-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[100px] ${
              selectedCategory === category.id 
                ? "bg-cyan-900/80 text-cyan-100" 
                : "bg-black/50 text-cyan-300 hover:bg-cyan-950/50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className={`mb-2 transition-colors ${
              selectedCategory === category.id ? "text-cyan-400" : "text-cyan-600"
            }`}>
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.label}</span>
            
            {/* Keyboard shortcut badge */}
            <InterfaceBadge 
              color="cyan"
              glowing={selectedCategory === category.id}
              className="absolute -top-2 -right-2 text-xs"
            >
              {index + 1}
            </InterfaceBadge>
            
            {/* Bottom indicator line */}
            <div 
              className={`absolute bottom-0 left-4 right-4 h-0.5 rounded transition-all duration-300 ${
                selectedCategory === category.id 
                  ? "bg-cyan-400" 
                  : "bg-transparent group-hover:bg-cyan-700/50"
              }`}
            />
            
            {/* Glow effect on hover and active */}
            {selectedCategory === category.id && (
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  boxShadow: "0 0 12px 1px rgba(6, 182, 212, 0.4)",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
