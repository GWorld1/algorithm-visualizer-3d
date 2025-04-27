"use client"
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "@/lib/sortingAlgorithms";
import { generateBFSSteps, generateDFSSteps } from "@/lib/treeAlgorithms";
import { dijkstra } from "@/lib/graphAlgorithms";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { AlgorithmType } from "@/types/AlgorithmType";
import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from "@/types/WeightedGraphNode";
import { useEffect } from "react";
import { DataStructureType } from "@/types/DataStructure";
import { useArrayStore } from "@/store/useArrayStore";
import { BFSExplanation, BubbleSortExplanation, DFSExplanation, DijkstraExplanation, InsertionSortExplanation, MergeSortExplanation, QuickSortExplanation, SelectionSortExplanation,LinkedListInsertExplanation,
  LinkedListDeleteExplanation,
  LinkedListSearchExplanation,
  LinkedListCreateExplanation } from "./AlgorithmExplanation";
import { useLinkedListStore } from "@/store/useLinkedListStore";

export const Controls = () => {
  const {
    dataStructure,
    setDataStructure,
    algorithmType,
    setAlgorithmType,
    play: playMainAnimation,
    pause: pauseMainAnimation,
    reset: resetMainAnimation,
    isPlaying: isPlayingMain,
    tree,
    weightedTree,
    animationSettings,
    currentStep,
    steps,
    
  } = useAlgorithmStore();

  const { elements } = useArrayStore();
  const {
    isPlaying: isPlayingLinkedList,
    setIsPlaying: setLinkedListPlaying,
    steps: linkedListSteps,
    currentStep: linkedListCurrentStep,
    goToNextStep: linkedListNextStep,
    goToPreviousStep: linkedListPreviousStep,
    resetLinkedListAnimation: resetLinkedListAnimation
  } = useLinkedListStore();

  // Combined play state
  const isPlaying = dataStructure === 'linkedList' ? isPlayingLinkedList : isPlayingMain;

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
      { value: 'quickSort', label: 'Quick Sort' },
      { value: 'insertionSort', label: 'Insertion Sort' } ,
      { value: 'selectionSort', label: 'Selection Sort' }  ,
      { value: 'mergeSort', label: 'Merge Sort' }
    ],
    linkedList: [
      { value: 'createLinkedList', label: 'Create Linked List' },
      { value: 'searchLinkedList', label: 'Search Node' },
      { value: 'insertNode', label: 'Insert Node' },
      { value: 'deleteNode', label: 'Delete Node' },
    ],
  };

  const startAlgorithm = () => {
    if (dataStructure === 'linkedList') {
      // Reset the steps and current step before playing
    useLinkedListStore.getState().setCurrentStep(0);
    // Only set isPlaying to true if there are steps to play
    if (linkedListSteps.length > 0) {
      setLinkedListPlaying(true);
    }
    return;
    }

    let steps;
    switch (algorithmType) {
      case 'dijkstra':
        if (!weightedTree) return;
        steps = dijkstra(weightedTree, 1);
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
      case 'insertionSort':
        steps = insertionSort(elements);
        break;
      case 'selectionSort':
        steps = selectionSort(elements);
        break;
      case 'mergeSort':
        steps = mergeSort(elements);
        break;
      default:
        return;
    }
    useAlgorithmStore.getState().setSteps(steps as TreeNode[] | WeightedTreeNode[]);
    playMainAnimation();
  };

  const pauseAnimation = () => {
    if (dataStructure === 'linkedList') {
      setLinkedListPlaying(false);
    } else {
      pauseMainAnimation();
    }
  };

  // Replace the existing animation useEffect with this unified version
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (isPlaying) {
    if (dataStructure === 'linkedList' && linkedListCurrentStep < linkedListSteps.length - 1) {
      interval = setInterval(() => {
        useLinkedListStore.setState(state => ({
          currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
        }));
      }, animationSettings.stepDuration);
    } else if (dataStructure !== 'linkedList' && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        useAlgorithmStore.setState(state => ({
          currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
        }));
      }, animationSettings.stepDuration);
    }
  }

  return () => clearInterval(interval);
}, [
  isPlaying, 
  dataStructure, 
  currentStep, 
  steps, 
  linkedListCurrentStep, 
  linkedListSteps, 
  animationSettings.stepDuration
]);

  // Also update the reset function to ensure it properly clears the linked list
  const resetAnimation = () => {
    if (dataStructure === 'linkedList') {
      resetLinkedListAnimation();
      // Also clear the linked list itself when resetting
     // useLinkedListStore.getState().setLinkedList(null);
    } else {
      resetMainAnimation();
    }
  };

  // Handle data structure change
  const handleDataStructureChange = (value: string) => {
    setDataStructure(value as DataStructureType);
    // Set first algorithm of the selected data structure as default
    const firstAlgorithm = algorithmOptions[value as keyof typeof algorithmOptions][0].value;
    setAlgorithmType(firstAlgorithm as AlgorithmType);
  };

  // Handle algorithm change
const handleAlgorithmChange = (value: AlgorithmType) => {
  setAlgorithmType(value);
  
  // Reset any existing steps and state
  if (dataStructure === 'linkedList') {
    // Clear any existing steps but keep the current linked list
    useLinkedListStore.getState().setSteps([]);
    useLinkedListStore.getState().setCurrentStep(0);
    useLinkedListStore.getState().setIsPlaying(false);
  }
};

  const goToNextStep = () => {
    if (dataStructure === 'linkedList') {
      linkedListNextStep();
      setLinkedListPlaying(false); // Ensure animation pauses
    } else {
      useAlgorithmStore.setState((state) => ({
        currentStep:
          state.currentStep < state.steps.length - 1
            ? state.currentStep + 1
            : state.currentStep,
        isPlaying: false, // Ensure animation pauses
      }));
    }
  };

  
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  // Handle main animation
  if (isPlayingMain && !isPlayingLinkedList && currentStep < steps.length - 1) {
    interval = setInterval(() => {
      useAlgorithmStore.setState(state => ({
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
      }));
    }, animationSettings.stepDuration);
  }
  
  // Handle linked list animation
  if (isPlayingLinkedList && linkedListCurrentStep < linkedListSteps.length - 1) {
    interval = setInterval(() => {
      useLinkedListStore.setState(state => ({
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
      }));
    }, animationSettings.stepDuration);
  }

  return () => clearInterval(interval);
}, [isPlaying, isPlayingLinkedList, currentStep, steps, linkedListCurrentStep, linkedListSteps, animationSettings.stepDuration, isPlayingMain]);



  const goToPreviousStep = () => {
    if (dataStructure === 'linkedList') {
      linkedListPreviousStep();
      setLinkedListPlaying(false); // Ensure animation pauses
    } else {
      useAlgorithmStore.setState((state) => ({
        currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0,
        isPlaying: false, // Ensure animation pauses
      }));
    }
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
        <option value="linkedList">Linked List</option>
      </select>

      {/* Algorithm Selector */}
      <select
        value={algorithmType}
        className="appearance-none mr-2 py-2 px-4 rounded-full outline-none border-0 text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
        onChange={(e) => handleAlgorithmChange(e.target.value as AlgorithmType)}
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
        className="text-blue-600 bg-blue-100 px-4 py-2 ml-2 rounded-full font-semibold text-sm"
      >
        Previous
      </button>

      {!isPlaying ? (
        <button
          onClick={startAlgorithm}
          className="text-blue-600 bg-blue-100 px-4 py-2 ml-2 rounded-full font-semibold text-sm"
        >
          Play
        </button>
      ) : (
        <button
          onClick={pauseAnimation}
          className="text-yellow-600 bg-yellow-100 px-4 py-2 ml-2 rounded-full font-semibold text-sm"
        >
          Pause
        </button>
      )}

      <button
        onClick={goToNextStep}
        className="text-blue-600 bg-blue-100 px-4 py-2 ml-2 rounded-full font-semibold text-sm"
      >
        Next
      </button>

      <button
        onClick={resetAnimation}
        className="text-gray-600 bg-gray-100 px-4 py-2 ml-2 rounded-full font-semibold text-sm"
      >
        Reset
      </button>

      {(dataStructure === 'linkedList' && linkedListSteps.length > 0) && (
        <p className="text-sm text-gray-500 ml-2">
          Current Step: {linkedListCurrentStep + 1}/{linkedListSteps.length}
        </p>
      )}

      {(dataStructure !== 'linkedList' && steps.length > 0) && (
        <p className="text-sm text-gray-500 ml-2">
          Current Step: {currentStep + 1}/{steps.length}
        </p>
      )}

      {algorithmType === 'quickSort' && <QuickSortExplanation />}
      {algorithmType === 'bubbleSort' && <BubbleSortExplanation />}
      {algorithmType === 'insertionSort' && <InsertionSortExplanation />}
      {algorithmType === 'dijkstra' && <DijkstraExplanation />}
      {algorithmType === 'bfs' && <BFSExplanation />}
      {algorithmType === 'dfs' && <DFSExplanation />}
      {algorithmType === 'selectionSort' && <SelectionSortExplanation />}
      {algorithmType === 'mergeSort' && <MergeSortExplanation />}
      {algorithmType === 'createLinkedList' && <LinkedListCreateExplanation />}
      {algorithmType === 'searchLinkedList' && <LinkedListSearchExplanation />}
      {algorithmType === 'insertNode' && <LinkedListInsertExplanation />}
      {algorithmType === 'deleteNode' && <LinkedListDeleteExplanation />}
    </div>
  );
};