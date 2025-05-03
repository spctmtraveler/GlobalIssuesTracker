import { Suspense, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import GlobeContainer from "./components/GlobeContainer";
import ControlPanel from "./components/ControlPanel";
import CountryDetails from "./components/CountryDetails";
import HUD from "./components/HUD";
import { useAudio } from "./lib/stores/useAudio";
import { useGlobeData } from "./lib/stores/useGlobeData";

function AudioInitializer() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize audio elements
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);

    const hitSound = new Audio("/sounds/hit.mp3");
    setHitSound(hitSound);

    const successSound = new Audio("/sounds/success.mp3");
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}

function App() {
  const { loadAllData } = useGlobeData();
  
  // Load all data on initial mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen bg-black overflow-hidden relative">
        <AudioInitializer />
        <HUD />
        <Suspense fallback={<div className="text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading Globe...</div>}>
          <GlobeContainer />
        </Suspense>
        <ControlPanel />
        <CountryDetails />
      </div>
    </QueryClientProvider>
  );
}

export default App;
