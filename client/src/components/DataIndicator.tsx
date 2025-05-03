import { LucideIcon } from "lucide-react";
import { 
  Globe, 
  Database, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart2,
  Heart,
  Zap
} from "lucide-react";

interface DataIndicatorProps {
  label: string;
  value: string;
  icon?: string; // Icon name
  color?: string; // Tailwind color class
}

export default function DataIndicator({ 
  label, 
  value, 
  icon = "chart", 
  color = "text-blue-500" 
}: DataIndicatorProps) {
  // Map icon string to actual icon component
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, LucideIcon> = {
      globe: Globe,
      database: Database,
      "trending-up": TrendingUp,
      "trending-down": TrendingDown,
      alert: AlertTriangle,
      chart: BarChart2,
      heart: Heart,
      zap: Zap
    };
    
    const IconComponent = iconMap[iconName] || BarChart2;
    return <IconComponent className={`${color} h-5 w-5`} />;
  };
  
  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-gray-900 bg-opacity-50">
      <div className="flex-shrink-0">
        {getIcon(icon)}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-base font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
