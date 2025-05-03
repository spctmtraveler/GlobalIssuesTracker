import { useEffect, useState } from "react";
import { AlertCircle, Info } from "lucide-react";
import { InterfacePanel, InterfaceBadge } from "./ui/interface";

export default function HUD() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: "info" | "warning" }>>([]);
  const [scanStatus, setScanStatus] = useState<"scanning" | "complete" | "idle">("idle");
  
  // Update the clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulate system notifications
  useEffect(() => {
    // Initial scan notification
    setTimeout(() => {
      setScanStatus("scanning");
      addNotification("Global data scan initiated", "info");
    }, 2000);
    
    // Complete scan
    setTimeout(() => {
      setScanStatus("complete");
      addNotification("Data scan complete", "info");
    }, 5000);
    
    // Random system notifications
    const messages = [
      { message: "New environmental data available", type: "info" as const },
      { message: "Quality of life metrics updated", type: "info" as const },
      { message: "Health index anomaly detected in region 7", type: "warning" as const },
      { message: "Global happiness index stable", type: "info" as const }
    ];
    
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < messages.length) {
        const msg = messages[counter];
        addNotification(msg.message, msg.type);
        counter++;
      } else {
        clearInterval(interval);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Add a notification
  const addNotification = (message: string, type: "info" | "warning") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Format time with leading zeros
  const formatTimeComponent = (value: number) => {
    return value.toString().padStart(2, "0");
  };
  
  const formattedTime = `${formatTimeComponent(currentTime.getHours())}:${formatTimeComponent(currentTime.getMinutes())}:${formatTimeComponent(currentTime.getSeconds())}`;
  const formattedDate = currentTime.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  
  return (
    <>
      {/* Top-left: Clock and date */}
      <div className="absolute top-5 left-5 z-30">
        <InterfacePanel className="py-2 px-3">
          <div className="text-cyan-400 font-mono text-lg">
            {formattedTime}
          </div>
          <div className="text-gray-400 text-xs">
            {formattedDate}
          </div>
        </InterfacePanel>
      </div>
      
      {/* Top-center: System status */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-30">
        <InterfacePanel className="py-2 px-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${scanStatus === "idle" ? "bg-gray-500" : scanStatus === "scanning" ? "bg-cyan-500 animate-pulse" : "bg-green-500"}`}></div>
            <span className="text-xs text-gray-300">SYSTEM</span>
          </div>
          <InterfaceBadge color="cyan" className="uppercase">
            {scanStatus === "scanning" ? "Scanning" : scanStatus === "complete" ? "Online" : "Standby"}
          </InterfaceBadge>
        </InterfacePanel>
      </div>
      
      {/* Top-right: Notifications */}
      <div className="absolute top-16 right-5 z-30 space-y-2 max-w-xs">
        {notifications.map(notification => (
          <InterfacePanel
            key={notification.id}
            className={`py-2 px-3 flex items-start gap-2 animate-fadeIn ${notification.type === "warning" ? "border-yellow-700" : ""}`}
          >
            {notification.type === "warning" ? (
              <AlertCircle className="text-yellow-500 w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="text-cyan-500 w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div className={notification.type === "warning" ? "text-yellow-200" : "text-gray-300"}>
              {notification.message}
            </div>
          </InterfacePanel>
        ))}
      </div>
    </>
  );
}
