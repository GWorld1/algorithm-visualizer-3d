"use client"
import { useState, useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useArrayStore } from '@/store/useArrayStore';
import { useLinkedListStore } from '@/store/useLinkedListStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Clock,
  Activity,
  ChevronDown
} from 'lucide-react';
import { AlgorithmType } from '@/types/AlgorithmType';
import { TreeNode } from '@/types/Treenode';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "@/lib/sortingAlgorithms";
import { generateBFSSteps, generateDFSSteps } from "@/lib/treeAlgorithms";
import { dijkstra } from "@/lib/graphAlgorithms";
import { generateBSTInsertSteps, generateBSTSearchSteps } from "@/lib/bstAlgorithms";
import { generateRandomBST } from "@/lib/nodeManipulation";
import { createLinkedList, searchLinkedList, insertNode, deleteNode } from "@/lib/linkedListAlgorithms";

const ControlDashboard = () => {
  const [treeSize, setTreeSize] = useState<string>('');
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const {
    isPlaying,
    currentStep,
    steps,
    play,
    pause,
    reset,
    animationSettings,
    updateAnimationSettings,
    algorithmType,
    dataStructure,
    setAlgorithmType,
    tree,
    weightedTree,
    updateTree
  } = useAlgorithmStore();

  const { elements } = useArrayStore();

  // Algorithm options for each data structure
  const algorithmOptions = {
    binaryTree: [
      { value: 'create', label: 'Create BST' },
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

  const { isPlaying: isLinkedListPlaying, currentStep: linkedListStep, steps: linkedListSteps } = useLinkedListStore();

  // Determine which animation system is active
  const isActivelyPlaying = dataStructure === 'linkedList' ? isLinkedListPlaying : isPlaying;
  const activeCurrentStep = dataStructure === 'linkedList' ? linkedListStep : currentStep;
  const activeSteps = dataStructure === 'linkedList' ? linkedListSteps : steps;

  // Algorithm execution logic
  const startAlgorithm = () => {
    if (dataStructure === 'linkedList') {
      // Handle linked list algorithms
      const { linkedList, setSteps, setIsPlaying, setLinkedList } = useLinkedListStore.getState();

      switch (algorithmType) {
        case 'createLinkedList':
          const elements = [1, 10, 9]; // Default elements, could be made configurable
          const steps = createLinkedList(elements);
          setSteps(steps);
          setIsPlaying(true);
          if (steps.length > 0) {
            setLinkedList(steps[steps.length - 1].list!);
          }
          break;
        case 'searchLinkedList':
          if (!linkedList) {
            alert('Please create a linked list first');
            return;
          }
          const searchVal = parseInt(searchValue);
          if (isNaN(searchVal)) {
            alert('Please enter a valid search value');
            return;
          }
          const searchSteps = searchLinkedList(linkedList, searchVal);
          setSteps(searchSteps);
          setIsPlaying(true);
          setSearchValue('');
          break;
        case 'insertNode':
          if (!linkedList) {
            alert('Please create a linked list first');
            return;
          }
          const insertAfter = parseInt(searchValue); // Reusing searchValue for insert after
          const newValue = parseInt(insertValue);
          if (isNaN(insertAfter) || isNaN(newValue)) {
            alert('Please enter valid values for insertion');
            return;
          }
          const insertSteps = insertNode(linkedList, insertAfter, newValue);
          setSteps(insertSteps);
          setIsPlaying(true);
          setSearchValue('');
          setInsertValue('');
          break;
        case 'deleteNode':
          if (!linkedList) {
            alert('Please create a linked list first');
            return;
          }
          const deleteVal = parseInt(searchValue);
          if (isNaN(deleteVal)) {
            alert('Please enter a valid value to delete');
            return;
          }
          const deleteSteps = deleteNode(linkedList, deleteVal);
          setSteps(deleteSteps);
          setIsPlaying(true);
          setSearchValue('');
          break;
      }
      return;
    }

    let steps;
    switch (algorithmType) {
      case 'dijkstra':
        if (!weightedTree) return;
        if (!weightedTree.isSource) {
          alert('Please select a source node first');
          return;
        }
        steps = dijkstra(weightedTree, weightedTree.value);
        break;
      case 'bfs':
        if (!tree) return;
        steps = generateBFSSteps(tree);
        break;
      case 'dfs':
        if (!tree) return;
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
      case 'create':
        const size = parseInt(treeSize);
        if (isNaN(size) || size <= 0) {
          alert("Please enter a valid tree size");
          return;
        }
        const newTree = generateRandomBST(size);
        updateTree(newTree);
        setTreeSize('');
        return;
      case 'bstSearch':
        if (!tree) return;
        const searchValueInt = parseInt(searchValue);
        if (isNaN(searchValueInt)) {
          alert("Please enter a valid number to search");
          return;
        }
        steps = generateBSTSearchSteps(tree, searchValueInt);
        useAlgorithmStore.getState().setSteps(steps);
        play();
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
        useAlgorithmStore.getState().setSteps(steps);
        play();
        setInsertValue('');
        return;
      default:
        return;
    }
    useAlgorithmStore.getState().setSteps(steps as TreeNode[] | WeightedTreeNode[]);
    play();
  };

  const handlePlayPause = () => {
    if (isActivelyPlaying) {
      if (dataStructure === 'linkedList') {
        useLinkedListStore.getState().setIsPlaying(false);
      } else {
        pause();
      }
    } else {
      if (dataStructure === 'linkedList') {
        useLinkedListStore.getState().setIsPlaying(true);
      } else {
        play();
      }
    }
  };

  const handleStepForward = () => {
    if (dataStructure === 'linkedList') {
      const store = useLinkedListStore.getState();
      if (store.currentStep < store.steps.length - 1) {
        useLinkedListStore.setState({ currentStep: store.currentStep + 1 });
      }
    } else {
      if (currentStep < steps.length - 1) {
        useAlgorithmStore.setState({ currentStep: currentStep + 1 });
      }
    }
  };

  const handleStepBackward = () => {
    if (dataStructure === 'linkedList') {
      const store = useLinkedListStore.getState();
      if (store.currentStep > 0) {
        useLinkedListStore.setState({ currentStep: store.currentStep - 1 });
      }
    } else {
      if (currentStep > 0) {
        useAlgorithmStore.setState({ currentStep: currentStep - 1 });
      }
    }
  };

  const handleReset = () => {
    if (dataStructure === 'linkedList') {
      useLinkedListStore.getState().reset();
    } else {
      reset();
    }
  };

  const getAlgorithmDisplayName = () => {
    const names: Record<string, string> = {
      bubbleSort: 'Bubble Sort',
      quickSort: 'Quick Sort',
      mergeSort: 'Merge Sort',
      insertionSort: 'Insertion Sort',
      selectionSort: 'Selection Sort',
      bfs: 'Breadth-First Search',
      dfs: 'Depth-First Search',
      dijkstra: 'Dijkstra\'s Algorithm',
      bstInsert: 'BST Insert',
      bstSearch: 'BST Search',
      createLinkedList: 'Create Linked List',
      searchLinkedList: 'Search Linked List',
      insertLinkedList: 'Insert Node',
      deleteLinkedList: 'Delete Node',
    };
    return names[algorithmType] || algorithmType;
  };

  const getComplexityInfo = () => {
    const complexities: Record<string, { time: string; space: string }> = {
      bubbleSort: { time: 'O(n²)', space: 'O(1)' },
      quickSort: { time: 'O(n log n)', space: 'O(log n)' },
      mergeSort: { time: 'O(n log n)', space: 'O(n)' },
      insertionSort: { time: 'O(n²)', space: 'O(1)' },
      selectionSort: { time: 'O(n²)', space: 'O(1)' },
      bfs: { time: 'O(V + E)', space: 'O(V)' },
      dfs: { time: 'O(V + E)', space: 'O(V)' },
      dijkstra: { time: 'O(V²)', space: 'O(V)' },
    };
    return complexities[algorithmType] || { time: 'N/A', space: 'N/A' };
  };

  const complexity = getComplexityInfo();

  // Animation logic - handles automatic stepping
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Handle main animation
    if (isPlaying && !isLinkedListPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        useAlgorithmStore.setState(state => ({
          currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
        }));
      }, animationSettings.stepDuration);
    }

    // Handle linked list animation
    if (isLinkedListPlaying && linkedListStep < linkedListSteps.length - 1) {
      interval = setInterval(() => {
        useLinkedListStore.setState(state => ({
          currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
        }));
      }, animationSettings.stepDuration);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isLinkedListPlaying, currentStep, linkedListStep, steps.length, linkedListSteps.length, animationSettings.stepDuration]);

  return (
    <div className="h-full bg-white/90 backdrop-blur-sm">
      <Card className="h-full border-0 rounded-none bg-transparent">
        <CardContent className="p-3 lg:p-4 h-full">
          <div className="flex items-center justify-between h-full gap-4 overflow-x-auto">
            
            {/* Left Section - Algorithm Selection & Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Algorithm Selection */}
              <div className="flex items-center gap-2">
                <select
                  value={algorithmType}
                  onChange={(e) => setAlgorithmType(e.target.value as AlgorithmType)}
                  className="text-xs border rounded px-2 py-1 bg-white"
                >
                  {algorithmOptions[dataStructure].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Input fields for algorithms that need parameters */}
                {(algorithmType === 'create') && (
                  <input
                    type="number"
                    placeholder="Tree size"
                    value={treeSize}
                    onChange={(e) => setTreeSize(e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-20 bg-white"
                  />
                )}

                {(algorithmType === 'bstInsert' || algorithmType === 'insertNode') && (
                  <input
                    type="number"
                    placeholder="Value"
                    value={insertValue}
                    onChange={(e) => setInsertValue(e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-16 bg-white"
                  />
                )}

                {(algorithmType === 'bstSearch' || algorithmType === 'searchLinkedList' ||
                  algorithmType === 'deleteNode' || algorithmType === 'insertNode') && (
                  <input
                    type="number"
                    placeholder={algorithmType === 'insertNode' ? 'After' : 'Search'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-16 bg-white"
                  />
                )}

                <Button
                  variant="default"
                  size="sm"
                  onClick={startAlgorithm}
                  className="h-8 px-3 text-xs"
                >
                  Start
                </Button>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStepBackward}
                  disabled={activeCurrentStep <= 0}
                  className="h-8 w-8 p-0"
                >
                  <SkipBack className="w-3 h-3" />
                </Button>

                <Button
                  variant={isActivelyPlaying ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handlePlayPause}
                  disabled={activeSteps.length === 0}
                  className="h-8 w-8 p-0"
                >
                  {isActivelyPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStepForward}
                  disabled={activeCurrentStep >= activeSteps.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 ml-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600 hidden lg:block">Speed</span>
                <div className="w-16 lg:w-20">
                  <Slider
                    value={[animationSettings.stepDuration]}
                    onValueChange={(value) => updateAnimationSettings({ stepDuration: value[0] })}
                    max={2000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-gray-500 min-w-[30px]">
                  {(animationSettings.stepDuration / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Center Section - Progress and Algorithm Info */}
            <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-center">
              <div className="text-center min-w-0">
                <div className="text-xs text-gray-600">Algorithm</div>
                <div className="text-sm font-semibold truncate max-w-[120px]">{getAlgorithmDisplayName()}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600">Progress</div>
                <div className="text-sm font-semibold">
                  {activeSteps.length > 0 ? `${activeCurrentStep + 1} / ${activeSteps.length}` : '0 / 0'}
                </div>
              </div>

              <div className="w-24 lg:w-32">
                <div className="text-xs text-gray-600 mb-1">Step Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: activeSteps.length > 0
                        ? `${((activeCurrentStep + 1) / activeSteps.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Performance Metrics */}
            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
              <div className="text-center">
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span className="hidden lg:inline">Time</span>
                </div>
                <div className="text-sm font-mono font-semibold">{complexity.time}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600">
                  <span className="hidden lg:inline">Space</span>
                  <span className="lg:hidden">Mem</span>
                </div>
                <div className="text-sm font-mono font-semibold">{complexity.space}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlDashboard;
