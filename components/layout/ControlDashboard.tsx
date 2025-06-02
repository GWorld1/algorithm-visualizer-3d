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
  Activity
} from 'lucide-react';
import { AlgorithmType } from '@/types/AlgorithmType';
import { TreeNode } from '@/types/Treenode';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "@/lib/sortingAlgorithms";
import { generateBFSSteps, generateDFSSteps } from "@/lib/treeAlgorithms";
import { dijkstra } from "@/lib/graphAlgorithms";
import { generateBSTInsertSteps, generateBSTSearchSteps } from "@/lib/bstAlgorithms";
import { createLinkedList, searchLinkedList, insertNode, deleteNode } from "@/lib/linkedListAlgorithms";

const ControlDashboard = () => {
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);

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
    updateTree,
    updateWeightedTree
  } = useAlgorithmStore();

  const { elements } = useArrayStore();

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

  const { isPlaying: isLinkedListPlaying, currentStep: linkedListStep, steps: linkedListSteps } = useLinkedListStore();

  // Determine which animation system is active
  const isActivelyPlaying = dataStructure === 'linkedList' ? isLinkedListPlaying : isPlaying;
  const activeCurrentStep = dataStructure === 'linkedList' ? linkedListStep : currentStep;
  const activeSteps = dataStructure === 'linkedList' ? linkedListSteps : steps;

  // Function to generate algorithm steps automatically
  const generateAlgorithmSteps = async () => {
    if (isGeneratingSteps) return;

    setIsGeneratingSteps(true);

    try {
      if (dataStructure === 'linkedList') {
        // Handle linked list algorithms
        const { linkedList, setSteps } = useLinkedListStore.getState();

        switch (algorithmType) {
          case 'createLinkedList':
            const elements = [1, 10, 9]; // Default elements
            const steps = createLinkedList(elements);
            setSteps(steps);
            if (steps.length > 0) {
              useLinkedListStore.getState().setLinkedList(steps[steps.length - 1].list!);
            }
            break;
          case 'searchLinkedList':
            if (!linkedList) return;
            const searchVal = linkedList.value; // Use first node value as default
            const searchSteps = searchLinkedList(linkedList, searchVal);
            setSteps(searchSteps);
            setSearchValue(searchVal.toString());
            break;
          case 'insertNode':
            if (!linkedList) return;
            const insertAfter = linkedList.value; // Use first node value as default
            const newValue = Math.floor(Math.random() * 100); // Random new value
            const insertSteps = insertNode(linkedList, insertAfter, newValue);
            setSteps(insertSteps);
            setSearchValue(insertAfter.toString());
            setInsertValue(newValue.toString());
            break;
          case 'deleteNode':
            if (!linkedList) return;
            const deleteVal = linkedList.value; // Use first node value as default
            const deleteSteps = deleteNode(linkedList, deleteVal);
            setSteps(deleteSteps);
            setSearchValue(deleteVal.toString());
            break;
        }
        return;
      }

      // Handle other data structures
      let steps;
      switch (algorithmType) {
        case 'dijkstra':
          if (!weightedTree) return;
          if (!weightedTree.isSource) {
            // Auto-select the first node as source if none selected
            const firstNode = weightedTree;
            firstNode.isSource = true;
            updateWeightedTree(firstNode);
            return; // This will trigger another generation via the updateWeightedTree logic
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
        case 'bstSearch':
          if (!tree) return;
          const defaultSearchValue = tree.value; // Use root value as default
          steps = generateBSTSearchSteps(tree, defaultSearchValue);
          setSearchValue(defaultSearchValue.toString());
          break;
        case 'bstInsert':
          if (!tree) return;
          // Generate a random value that's not already in the tree
          const getRandomInsertValue = (node: TreeNode): number => {
            const existingValues = new Set<number>();
            const collectValues = (n: TreeNode) => {
              existingValues.add(n.value);
              if (n.left) collectValues(n.left);
              if (n.right) collectValues(n.right);
            };
            collectValues(node);

            let randomValue;
            do {
              randomValue = Math.floor(Math.random() * 100);
            } while (existingValues.has(randomValue));

            return randomValue;
          };

          const defaultInsertValue = getRandomInsertValue(tree);
          steps = generateBSTInsertSteps(tree, defaultInsertValue);
          setInsertValue(defaultInsertValue.toString());
          break;
        default:
          return;
      }

      if (steps) {
        useAlgorithmStore.getState().setSteps(steps as TreeNode[] | WeightedTreeNode[]);
      }
    } catch (error) {
      console.error('Error generating algorithm steps:', error);
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  // Function to handle parameter changes and regenerate steps
  const handleParameterChange = (paramType: 'insert' | 'search', value: string) => {
    if (paramType === 'insert') {
      setInsertValue(value);
      if (algorithmType === 'bstInsert' && tree && value.trim() !== '') {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          const steps = generateBSTInsertSteps(tree, numValue);
          useAlgorithmStore.getState().setSteps(steps);
        }
      } else if (algorithmType === 'insertNode' && value.trim() !== '') {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && searchValue.trim() !== '') {
          const insertAfter = parseInt(searchValue);
          if (!isNaN(insertAfter)) {
            const { linkedList, setSteps } = useLinkedListStore.getState();
            if (linkedList) {
              const insertSteps = insertNode(linkedList, insertAfter, numValue);
              setSteps(insertSteps);
            }
          }
        }
      }
    } else if (paramType === 'search') {
      setSearchValue(value);
      if (algorithmType === 'bstSearch' && tree && value.trim() !== '') {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          const steps = generateBSTSearchSteps(tree, numValue);
          useAlgorithmStore.getState().setSteps(steps);
        }
      } else if ((algorithmType === 'searchLinkedList' || algorithmType === 'deleteNode') && value.trim() !== '') {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          const { linkedList, setSteps } = useLinkedListStore.getState();
          if (linkedList) {
            if (algorithmType === 'searchLinkedList') {
              const searchSteps = searchLinkedList(linkedList, numValue);
              setSteps(searchSteps);
            } else if (algorithmType === 'deleteNode') {
              const deleteSteps = deleteNode(linkedList, numValue);
              setSteps(deleteSteps);
            }
          }
        }
      } else if (algorithmType === 'insertNode' && value.trim() !== '' && insertValue.trim() !== '') {
        const insertAfter = parseInt(value);
        const newValue = parseInt(insertValue);
        if (!isNaN(insertAfter) && !isNaN(newValue)) {
          const { linkedList, setSteps } = useLinkedListStore.getState();
          if (linkedList) {
            const insertSteps = insertNode(linkedList, insertAfter, newValue);
            setSteps(insertSteps);
          }
        }
      }
    }
  };

  // Auto-generate steps when algorithm type changes
  useEffect(() => {
    generateAlgorithmSteps();
  }, [algorithmType, dataStructure, tree, weightedTree, elements]);



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
    <div className="h-full bg-gray-900/95 backdrop-blur-sm">
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
                  className="text-xs border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
                >
                  {algorithmOptions[dataStructure].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Input fields for algorithms that need parameters */}

                {(algorithmType === 'bstInsert' || algorithmType === 'insertNode') && (
                  <input
                    type="number"
                    placeholder="Value"
                    value={insertValue}
                    onChange={(e) => handleParameterChange('insert', e.target.value)}
                    className="text-xs border border-gray-600 rounded px-2 py-1 w-16 bg-gray-800 text-white placeholder-gray-400"
                  />
                )}

                {(algorithmType === 'bstSearch' || algorithmType === 'searchLinkedList' ||
                  algorithmType === 'deleteNode' || algorithmType === 'insertNode') && (
                  <input
                    type="number"
                    placeholder={algorithmType === 'insertNode' ? 'After' : 'Search'}
                    value={searchValue}
                    onChange={(e) => handleParameterChange('search', e.target.value)}
                    className="text-xs border border-gray-600 rounded px-2 py-1 w-16 bg-gray-800 text-white placeholder-gray-400"
                  />
                )}

                {/* Steps generation status indicator */}
                {isGeneratingSteps && (
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepBackward}
                  disabled={activeCurrentStep <= 0}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500"
                >
                  <SkipBack className="w-3 h-3" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  disabled={activeSteps.length === 0}
                  className={`h-8 w-8 p-0 border-gray-600 disabled:opacity-50 ${
                    isActivelyPlaying
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                  } ${activeSteps.length === 0 ? 'bg-gray-800 text-gray-500' : ''}`}
                >
                  {isActivelyPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepForward}
                  disabled={activeCurrentStep >= activeSteps.length - 1}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 ml-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300 hidden lg:block">Speed</span>
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
                <span className="text-xs text-gray-400 min-w-[30px]">
                  {(animationSettings.stepDuration / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Center Section - Progress and Algorithm Info */}
            <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-center">
              <div className="text-center min-w-0">
                <div className="text-xs text-gray-400">Algorithm</div>
                <div className="text-sm font-semibold text-white truncate max-w-[120px]">{getAlgorithmDisplayName()}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-400">Progress</div>
                <div className="text-sm font-semibold text-white">
                  {activeSteps.length > 0 ? `${activeCurrentStep + 1} / ${activeSteps.length}` : '0 / 0'}
                </div>
              </div>

              <div className="w-24 lg:w-32">
                <div className="text-xs text-gray-400 mb-1">Step Progress</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span className="hidden lg:inline">Time</span>
                </div>
                <div className="text-sm font-mono font-semibold text-white">{complexity.time}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-400">
                  <span className="hidden lg:inline">Space</span>
                  <span className="lg:hidden">Mem</span>
                </div>
                <div className="text-sm font-mono font-semibold text-white">{complexity.space}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlDashboard;
