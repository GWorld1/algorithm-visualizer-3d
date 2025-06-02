"use client"
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "@/lib/sortingAlgorithms";
import { generateBFSSteps, generateDFSSteps } from "@/lib/treeAlgorithms";
import { dijkstra } from "@/lib/graphAlgorithms";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { AlgorithmType } from "@/types/AlgorithmType";
import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from "@/types/WeightedGraphNode";
import { useEffect, useState } from "react";
import { DataStructureType } from "@/types/DataStructure";
import { useArrayStore } from "@/store/useArrayStore";
import { BFSExplanation, BubbleSortExplanation, DFSExplanation, DijkstraExplanation, InsertionSortExplanation, MergeSortExplanation, QuickSortExplanation, SelectionSortExplanation,LinkedListInsertExplanation,
  LinkedListDeleteExplanation,  LinkedListSearchExplanation,
  LinkedListCreateExplanation,
  BSTSearchExplanation,
  BSTInsertExplanation } from "./AlgorithmExplanation";
import { useLinkedListStore } from "@/store/useLinkedListStore";
import { generateBSTInsertSteps, generateBSTSearchSteps } from "@/lib/bstAlgorithms";


export const Controls = () => {
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const {
    dataStructure,
    setDataStructure,
    algorithmType,
    setAlgorithmType,
    play: playMainAnimation,
    pause: pauseMainAnimation,
    restart: restartMainAnimation,
    reset: resetMainAnimation,
    isPlaying: isPlayingMain,
    tree,
    weightedTree,
    animationSettings,
    currentStep,
    steps,
    updateTree
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
      { value: 'dfs', label: 'DFS' },
      { value: 'bstInsert', label: 'Insert Node' },
      { value: 'bstSearch', label: 'Search Node' }
    ],
    weightedGraph: [
      { value: 'dijkstra', label: 'Dijkstra' }
    ], 
    array: [
      { value: 'bubbleSort', label: 'Bubble Sort' },
      { value: 'quickSort', label: 'Quick Sort' },
      { value: 'insertionSort', label: 'Insertion Sort' },
      { value: 'selectionSort', label: 'Selection Sort' },
      { value: 'mergeSort', label: 'Merge Sort' }
    ],
    linkedList: [
      { value: 'createLinkedList', label: 'Create Linked List' },
      { value: 'searchLinkedList', label: 'Search Node' },
      { value: 'insertNode', label: 'Insert Node' },
      { value: 'deleteNode', label: 'Delete Node' }
    ]
  };

  const startAlgorithm = () => {
    if (dataStructure === 'linkedList') {
      if (linkedListSteps.length === 0) {
        // This is a new algorithm, so reset the current step
        useLinkedListStore.getState().setCurrentStep(0);
      }
    // Only set isPlaying to true if there are steps to play
    if (linkedListSteps.length > 0) {
      setLinkedListPlaying(true);
    }
    return;
    }

    let steps;    switch (algorithmType) {
      case 'dijkstra':
        if (!weightedTree) return;
        if (!weightedTree.isSource) {
          alert('Please select a source node first');
          return;
        }
        steps = dijkstra(weightedTree, weightedTree.value);
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
      case 'bstSearch':
        if (!tree) return;
        const searchValueInt = parseInt(searchValue);
        if (isNaN(searchValueInt)) {
          alert("Please enter a valid number");
          return;
        }
        steps = generateBSTSearchSteps(tree, searchValueInt);
        useAlgorithmStore.getState().setSteps(steps);
        playMainAnimation();
        setSearchValue('');
        return;
      case 'bstInsert':
        if (!tree) return;
        const value = parseInt(insertValue);
        if (isNaN(value)) {
          alert("Please enter a valid number");
          return;
        }
        steps = generateBSTInsertSteps(tree, value);
        
        // Set the steps and start the animation
        useAlgorithmStore.getState().setSteps(steps);
        playMainAnimation();
        
        // Clear the input field for next insertion
        setInsertValue('');
        return; // Return early to avoid the default steps setting below
        
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

  // Animation logic is now handled by ControlDashboard to avoid conflicts

  // Also update the reset function to ensure it properly clears the linked list
  const resetAnimation = () => {
    if (dataStructure === 'linkedList') {
      useLinkedListStore.getState().resetLinkedListAnimation();
    } else {
      restartMainAnimation();
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

  // Reset any existing steps and state for all data structures
  if (dataStructure === 'linkedList') {
    // Clear any existing steps but keep the current linked list
    const linkedListStore = useLinkedListStore.getState();
    linkedListStore.setSteps([]);
    linkedListStore.setCurrentStep(0);
    linkedListStore.setIsPlaying(false);
  } else {
    // Reset main algorithm store
    useAlgorithmStore.getState().setSteps([]);
    useAlgorithmStore.setState({ currentStep: 0, isPlaying: false });
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

  // Removed duplicate animation logic - handled by ControlDashboard



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



  const getAlgorithmExplanation = () => {
    switch (algorithmType) {
      case 'bfs':
        return <BFSExplanation />;
      case 'dfs':
        return <DFSExplanation />;
      case 'bubbleSort':
        return <BubbleSortExplanation />;
      case 'quickSort':
        return <QuickSortExplanation />;
      case 'insertionSort':
        return <InsertionSortExplanation />;
      case 'selectionSort':
        return <SelectionSortExplanation />;
      case 'mergeSort':
        return <MergeSortExplanation />;
      case 'dijkstra':
        return <DijkstraExplanation />;
      case 'createLinkedList':
        return <LinkedListCreateExplanation />;
      case 'searchLinkedList':
        return <LinkedListSearchExplanation />;
      case 'insertNode':
        return <LinkedListInsertExplanation />;
      case 'deleteNode':
        return <LinkedListDeleteExplanation />;

      case 'bstInsert':
        return <BSTInsertExplanation />;
      case 'bstSearch':
        return <BSTSearchExplanation />;
      default:
        return null;
    }
  }

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



      {/* Add node insertion input */}
      {dataStructure === 'binaryTree' && algorithmType === 'bstInsert' && (
        <div className="flex items-center gap-2 mr-2">
          <input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            placeholder="Enter node value"
            className="w-32 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={startAlgorithm}
            className="text-blue-600 bg-blue-100 px-4 py-2 rounded-full font-semibold text-sm"
          >
            Insert
          </button>
        </div> 
      )}      {/* Add search input field */}
      {dataStructure === 'binaryTree' && algorithmType === 'bstSearch' && (
        <div className="flex items-center gap-2 mr-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value to search"
            className="w-32 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={startAlgorithm}
            className="text-blue-600 bg-blue-100 px-4 py-2 rounded-full font-semibold text-sm"
          >
            Search
          </button>
        </div>
      )}

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

      {getAlgorithmExplanation()}
    </div>
  );
};