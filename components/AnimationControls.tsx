"use client"
import { bubbleSort,quickSort } from "@/lib/sortingAlgorithms";
import { generateBFSSteps, generateDFSSteps } from "@/lib/treeAlgorithms";
import { dijkstra } from "@/lib/graphAlgorithms";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { AlgorithmType } from "@/types/AlgorithmType";
import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from "@/types/WeightedGraphNode";
import { useEffect} from "react";
import { DataStructureType } from "@/types/DataStructure";
import { useArrayStore } from "@/store/useArrayStore";
import { BFSExplanation, BubbleSortExplanation, DFSExplanation, DijkstraExplanation, QuickSortExplanation } from "./AlgorithmExplanation";

export const Controls = () => {
    const {dataStructure,setDataStructure,algorithmType, setAlgorithmType, play, pause, reset, isPlaying,tree, weightedTree } = useAlgorithmStore();
    const {elements} = useArrayStore();
     // Algorithm options for each data structure
     const algorithmOptions = {
      binaryTree: [
          { value: 'bfs', label: 'BFS' },
          { value: 'dfs', label: 'DFS' }
      ],
      weightedGraph: [
          { value: 'dijkstra', label: 'Dijkstra' }
      ],
      array: [
          { value: 'bubbleSort', label: 'Bubble Sort' },
          { value: 'quickSort', label: 'Quick Sort' }
      ],
      
  };

  
    const startAlgorithm = () => {
      let steps;
    switch (algorithmType) {
      case 'dijkstra':
        if (!weightedTree) return;
        steps = dijkstra(weightedTree,1);
        console.log(steps);
        break;
      case 'bfs':
        steps = generateBFSSteps(tree);
        break;
      case 'dfs':
        steps = generateDFSSteps(tree);
        break;
      case 'bubbleSort':
        steps = bubbleSort(elements);
        break;
      case 'quickSort':
        steps = quickSort(elements);
        break;
    }
      useAlgorithmStore.getState().setSteps(steps as TreeNode[]|WeightedTreeNode[]);
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

    // Handle data structure change
    const handleDataStructureChange = (value: string) => {
      setDataStructure(value as DataStructureType);
      // Set first algorithm of the selected data structure as default
      const firstAlgorithm = algorithmOptions[value as keyof typeof algorithmOptions][0].value;
      setAlgorithmType(firstAlgorithm as AlgorithmType);
  };

  const goToNextStep = () => {
    useAlgorithmStore.setState((state) => ({
      currentStep:
        state.currentStep < state.steps.length - 1
          ? state.currentStep + 1
          : state.currentStep,
    }));
  };

  const goToPreviousStep = () => {
    useAlgorithmStore.setState((state) => ({
      currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0,
    }));
  };

  
    return (
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow flex items-center">

        {/* Data Structure Selector */}
        <select 
                value={dataStructure}
                className="appearance-none mr-2 py-2 px-4 rounded-full outline-none border-0 text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
                onChange={(e) => handleDataStructureChange(e.target.value)}
            >
                <option value="binaryTree">Binary Tree</option>
                <option value="weightedGraph">Weighted Graph</option>
                <option value="array">Array</option>
                
            </select>
        {/* Algorithm Selector */}
        <select 
          value={algorithmType}
          className="appearance-none mr-2 py-2 px-4 rounded-full outline-none border-0 text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onChange={(e) => setAlgorithmType(e.target.value as AlgorithmType )}
        >
          {
            algorithmOptions[dataStructure as keyof typeof algorithmOptions].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          }
        </select>

        
        <button
          onClick={goToPreviousStep}
          className="text-blue-600 bg-blue-100 px-4 py-2 ml-2  rounded-full font-semibold text-sm"
        >
          Previous
        </button>

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

        <button
          onClick={goToNextStep}
          className="text-blue-600 bg-blue-100 px-4 py-2 ml-2  rounded-full font-semibold text-sm"
        >
          Next
        </button>

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
        {
          algorithmType === 'quickSort' && (
            <QuickSortExplanation/>
          )
        }
        {
          algorithmType === 'bubbleSort' && (
            <BubbleSortExplanation/>
          )
        }
        {
          algorithmType === 'dijkstra' && (
            <DijkstraExplanation />
          )
        }

      {
        algorithmType === 'bfs' && (
          <BFSExplanation />
        )
      }
      {
        algorithmType === 'dfs' && (
          <DFSExplanation />
        )
      }
      </div>
    );
  };