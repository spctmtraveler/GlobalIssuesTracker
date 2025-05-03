import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Globe from "./Globe";
import DataOverlay from "./DataOverlay";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { useAudio } from "../lib/stores/useAudio";

export default function GlobeContainer() {
  const { isLoading } = useGlobeData();
  const { backgroundMusic, toggleMute, isMuted } = useAudio();
  const [canvasReady, setCanvasReady] = useState(false);

  // Play background music when canvas is ready and data is loaded
  useEffect(() => {
    if (canvasReady && !isLoading && backgroundMusic) {
      // Try to play background music
      if (!isMuted) {
        backgroundMusic.play().catch((error) => {
          console.log("Background music play prevented:", error);
        });
      }
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [canvasReady, isLoading, backgroundMusic, isMuted]);

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 4], fov: 45 }}
        onCreated={() => setCanvasReady(true)}
      >
        <color attach="background" args={["#000208"]} />
        
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        
        {/* Stars background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
      
      <DataOverlay />
      
      {/* Sound control button */}
      <button 
        className="absolute top-5 right-5 p-2 text-cyan-500 hover:text-cyan-300 z-50 transition-colors"
        onClick={toggleMute}
        aria-label={isMuted ? "Enable sound" : "Disable sound"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10v4a5 5 0 0 0 10 0v-4a5 5 0 0 0-10 0z"></path><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><line x1="3" y1="7" x2="3" y2="14"></line><line x1="20" y1="7" x2="20" y2="14"></line><path d="M17 10v4a5 5 0 0 1-.1 1"></path><line x1="14" y1="4" x2="14" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line>
          </svg>
        )}
      </button>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
          <div className="p-4 rounded-lg bg-gray-900 bg-opacity-80 text-cyan-400 flex flex-col items-center space-y-3">
            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-center">Loading Global Data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
