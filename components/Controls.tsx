"use client"

import { generateBFSSteps } from "@/lib/algorithm";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { useEffect } from "react";

export const Controls = () => {
    const { play, pause, reset, isPlaying,tree } = useAlgorithmStore();
    //const [tree] = useState(() => calculateTreeLayout(sampleTree));
  
    const startBFS = () => {
      const steps = generateBFSSteps(tree);
      useAlgorithmStore.getState().setSteps(steps);
      play();
    };
  
    useEffect(() => {
      if (!isPlaying) return;
      
      const interval = setInterval(() => {
        useAlgorithmStore.setState((state) => ({
          currentStep: 
            state.currentStep < state.steps.length - 1 
              ? state.currentStep + 1 
              : state.currentStep
        }));
      }, 1000);
  
      return () => clearInterval(interval);
    }, [isPlaying]);
  
    return (
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow">
        <button onClick={startBFS} className="bg-blue-500 px-4 py-2 rounded">
          Start BFS
        </button>
        <button onClick={pause} className="bg-yellow-500 px-4 py-2 rounded ml-2">
          Pause
        </button>
        <button onClick={reset} className="bg-gray-500 px-4 py-2 rounded ml-2">
          Reset
        </button>
      </div>
    );
  };