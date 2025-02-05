"use client"

import { dijkstra, generateBFSSteps, generateDFSSteps } from "@/lib/algorithm";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { useEffect } from "react";

export const Controls = () => {
    const {algorithmType, setAlgorithmType, play, pause, reset, isPlaying,tree, weightedTree } = useAlgorithmStore();
    //const [tree] = useState(() => calculateTreeLayout(sampleTree));
  
    const startAlgorithm = () => {
      let steps;
    switch (algorithmType) {
      case 'dijkstra':
        if (!weightedTree) return;
        steps = dijkstra(weightedTree);
        console.log(steps);
        break;
      case 'bfs':
        steps = generateBFSSteps(tree);
        break;
      case 'dfs':
        steps = generateDFSSteps(tree);
        break;
    }
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
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow flex items-center">
        <select 
          value={algorithmType}
          className="appearance-none mr-2 py-2 px-4 rounded-full outline-none border-0 text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onChange={(e) => setAlgorithmType(e.target.value as 'bfs' | 'dfs'| 'dijkstra')}
        >
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
        </select>
        {
          !isPlaying ? 
            <button onClick={startAlgorithm} className="text-blue-600 bg-blue-100 px-4 py-2 ml-2  rounded-full font-semibold text-sm">
              Play 
            </button>
           :
          <button onClick={pause} className="text-yellow-600 bg-yellow-100 px-4 py-2  ml-2 rounded-full font-semibold text-sm">
            Pause
          </button>
        }
        <button onClick={reset} className="text-gray-600 bg-gray-100 px-4 py-2  ml-2 rounded-full font-semibold text-sm">
          Reset
        </button>

        {
          isPlaying && (
            <p className="text-sm text-gray-500 ml-2">
              Current Step: {useAlgorithmStore.getState().currentStep + 1}/{useAlgorithmStore.getState().steps.length}
            </p>
          )
        }
      </div>
    );
  };