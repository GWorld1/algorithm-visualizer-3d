"use client"
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useLinkedListStore } from '@/store/useLinkedListStore';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Activity, Clock } from 'lucide-react';

const AlgorithmExplanationPanel = () => {
  const {
    algorithmType,
    currentStep,
    steps,
    dataStructure,
    isPlaying
  } = useAlgorithmStore();

  const {
    currentStep: linkedListCurrentStep,
    steps: linkedListSteps,
    isPlaying: isLinkedListPlaying
  } = useLinkedListStore();

  // Get current step description
  const getCurrentStepDescription = () => {
    // Handle linked list algorithms
    if (dataStructure === 'linkedList') {
      if (!linkedListSteps || linkedListSteps.length === 0) return '';
      const currentStepData = linkedListSteps[linkedListCurrentStep];
      if (!currentStepData) return '';
      return currentStepData.description || '';
    }

    // Handle other algorithms
    if (!steps || steps.length === 0) return '';
    const currentStepData = steps[currentStep];
    if (!currentStepData) return '';

    // Handle different step formats
    if (typeof currentStepData === 'object' && 'description' in currentStepData) {
      return (currentStepData as { description: string }).description;
    }

    return '';
  };

  // Get algorithm information
  const getAlgorithmInfo = () => {
    const algorithmData: Record<string, {
      name: string;
      description: string;
      pseudocode: string[];
      keyPoints: string[];
    }> = {
      bubbleSort: {
        name: 'Bubble Sort',
        description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        pseudocode: [
          'for i = 0 to n-1:',
          '  for j = 0 to n-i-2:',
          '    if arr[j] > arr[j+1]:',
          '      swap(arr[j], arr[j+1])'
        ],
        keyPoints: [
          'Compares adjacent elements',
          'Largest element "bubbles" to the end',
          'Time complexity: O(n²)',
          'Space complexity: O(1)'
        ]
      },
      quickSort: {
        name: 'Quick Sort',
        description: 'An efficient divide-and-conquer algorithm that picks a pivot element and partitions the array around it.',
        pseudocode: [
          'function quickSort(arr, low, high):',
          '  if low < high:',
          '    pi = partition(arr, low, high)',
          '    quickSort(arr, low, pi-1)',
          '    quickSort(arr, pi+1, high)'
        ],
        keyPoints: [
          'Divide-and-conquer approach',
          'Chooses a pivot element',
          'Average time complexity: O(n log n)',
          'Worst case: O(n²)'
        ]
      },
      mergeSort: {
        name: 'Merge Sort',
        description: 'A stable divide-and-conquer algorithm that divides the array into halves, sorts them, and merges them back.',
        pseudocode: [
          'function mergeSort(arr):',
          '  if length(arr) <= 1: return arr',
          '  mid = length(arr) / 2',
          '  left = mergeSort(arr[0:mid])',
          '  right = mergeSort(arr[mid:])',
          '  return merge(left, right)'
        ],
        keyPoints: [
          'Stable sorting algorithm',
          'Consistent O(n log n) performance',
          'Requires O(n) extra space',
          'Good for large datasets'
        ]
      },
      bfs: {
        name: 'Breadth-First Search',
        description: 'A graph traversal algorithm that explores vertices level by level, visiting all neighbors before moving to the next level.',
        pseudocode: [
          'function BFS(graph, start):',
          '  queue = [start]',
          '  visited = set()',
          '  while queue is not empty:',
          '    vertex = queue.dequeue()',
          '    for neighbor in graph[vertex]:',
          '      if neighbor not in visited:',
          '        queue.enqueue(neighbor)'
        ],
        keyPoints: [
          'Uses a queue data structure',
          'Explores level by level',
          'Finds shortest path in unweighted graphs',
          'Time complexity: O(V + E)'
        ]
      },
      dfs: {
        name: 'Depth-First Search',
        description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
        pseudocode: [
          'function DFS(graph, vertex, visited):',
          '  visited.add(vertex)',
          '  for neighbor in graph[vertex]:',
          '    if neighbor not in visited:',
          '      DFS(graph, neighbor, visited)'
        ],
        keyPoints: [
          'Uses recursion or stack',
          'Explores depth before breadth',
          'Good for detecting cycles',
          'Time complexity: O(V + E)'
        ]
      },
      insertionSort: {
        name: 'Insertion Sort',
        description: 'A simple sorting algorithm that builds the final sorted array one item at a time.',
        pseudocode: [
          'for i = 1 to n-1:',
          '  key = arr[i]',
          '  j = i - 1',
          '  while j >= 0 and arr[j] > key:',
          '    arr[j+1] = arr[j]',
          '    j = j - 1',
          '  arr[j+1] = key'
        ],
        keyPoints: [
          'Efficient for small datasets',
          'Adaptive - performs well on nearly sorted data',
          'Time complexity: O(n²)',
          'Space complexity: O(1)'
        ]
      },
      selectionSort: {
        name: 'Selection Sort',
        description: 'A sorting algorithm that repeatedly finds the minimum element and places it at the beginning.',
        pseudocode: [
          'for i = 0 to n-2:',
          '  min_idx = i',
          '  for j = i+1 to n-1:',
          '    if arr[j] < arr[min_idx]:',
          '      min_idx = j',
          '  swap(arr[i], arr[min_idx])'
        ],
        keyPoints: [
          'Simple implementation',
          'Performs well on small lists',
          'Time complexity: O(n²)',
          'Space complexity: O(1)'
        ]
      },
      dijkstra: {
        name: 'Dijkstra\'s Algorithm',
        description: 'A graph search algorithm that finds the shortest path between nodes in a weighted graph.',
        pseudocode: [
          'function dijkstra(graph, source):',
          '  dist[source] = 0',
          '  for each vertex v in graph:',
          '    if v ≠ source: dist[v] = ∞',
          '  while unvisited vertices exist:',
          '    u = vertex with minimum dist',
          '    for each neighbor v of u:',
          '      alt = dist[u] + weight(u,v)',
          '      if alt < dist[v]: dist[v] = alt'
        ],
        keyPoints: [
          'Finds shortest path in weighted graphs',
          'Uses a priority queue',
          'Time complexity: O(V²) or O(E + V log V)',
          'Cannot handle negative weights'
        ]
      },
      createLinkedList: {
        name: 'Create Linked List',
        description: 'Creates a new linked list by inserting elements one by one.',
        pseudocode: [
          'function createLinkedList(elements):',
          '  head = null',
          '  for each element in elements:',
          '    newNode = createNode(element)',
          '    if head is null:',
          '      head = newNode',
          '    else:',
          '      append newNode to end'
        ],
        keyPoints: [
          'Dynamic data structure',
          'Efficient insertion and deletion',
          'No random access to elements',
          'Extra memory for pointers'
        ]
      },
      searchLinkedList: {
        name: 'Search Linked List',
        description: 'Searches for a specific value in the linked list by traversing from head to tail.',
        pseudocode: [
          'function search(head, target):',
          '  current = head',
          '  while current is not null:',
          '    if current.value == target:',
          '      return current',
          '    current = current.next',
          '  return null'
        ],
        keyPoints: [
          'Linear search algorithm',
          'Must traverse from beginning',
          'Time complexity: O(n)',
          'Space complexity: O(1)'
        ]
      },
      insertNode: {
        name: 'Insert Node',
        description: 'Inserts a new node after a specified node in the linked list.',
        pseudocode: [
          'function insertAfter(node, value):',
          '  newNode = createNode(value)',
          '  newNode.next = node.next',
          '  node.next = newNode'
        ],
        keyPoints: [
          'Constant time insertion',
          'Requires reference to insertion point',
          'Time complexity: O(1) if position known',
          'May require O(n) to find position'
        ]
      },
      deleteNode: {
        name: 'Delete Node',
        description: 'Removes a node with the specified value from the linked list.',
        pseudocode: [
          'function delete(head, value):',
          '  if head.value == value:',
          '    return head.next',
          '  current = head',
          '  while current.next:',
          '    if current.next.value == value:',
          '      current.next = current.next.next',
          '      break',
          '    current = current.next'
        ],
        keyPoints: [
          'Must find node before deletion',
          'Handle special case of head deletion',
          'Time complexity: O(n)',
          'Space complexity: O(1)'
        ]
      }
    };

    return algorithmData[algorithmType] || {
      name: algorithmType,
      description: 'Algorithm description not available.',
      pseudocode: [],
      keyPoints: []
    };
  };

  const algorithmInfo = getAlgorithmInfo();
  const currentDescription = getCurrentStepDescription();

  // Get complexity information for the current algorithm
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
      createLinkedList: { time: 'O(n)', space: 'O(n)' },
      searchLinkedList: { time: 'O(n)', space: 'O(1)' },
      insertNode: { time: 'O(1)', space: 'O(1)' },
      deleteNode: { time: 'O(n)', space: 'O(1)' },
      bstInsert: { time: 'O(log n)', space: 'O(1)' },
      bstSearch: { time: 'O(log n)', space: 'O(1)' },
      create: { time: 'O(n log n)', space: 'O(n)' }
    };
    return complexities[algorithmType] || { time: 'N/A', space: 'N/A' };
  };

  const complexity = getComplexityInfo();

  // Get the active current step for display
  const activeCurrentStep = dataStructure === 'linkedList' ? linkedListCurrentStep : currentStep;
  const activeSteps = dataStructure === 'linkedList' ? linkedListSteps : steps;
  const activeIsPlaying = dataStructure === 'linkedList' ? isLinkedListPlaying : isPlaying;

  // Determine if algorithm is executing (has steps and is playing or has active steps)
  const isExecuting = activeSteps.length > 0 && (activeIsPlaying || activeCurrentStep >= 0);

  return (
    <div className="h-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-sm relative z-10 transition-all duration-300">
      <Card className="border-0 rounded-none bg-transparent h-full">
        <CardContent className="p-4 h-full overflow-hidden">
          {isExecuting ? (
            // Show step-by-step content when algorithm is executing
            <div className="h-full flex flex-col">
              {/* Header with algorithm name and step counter */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <h2 className="text-lg font-semibold text-white">{algorithmInfo.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                    Step {activeCurrentStep + 1} of {activeSteps.length}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Activity className="w-3 h-3" />
                    <span>Executing</span>
                  </div>
                </div>
              </div>

              {/* Current step description */}
              <div className="flex-1 min-h-0">
                {currentDescription ? (
                  <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 h-full overflow-y-auto">
                    <p className="text-sm text-blue-200 font-medium">
                      {currentDescription}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 h-full flex items-center justify-center">
                    <p className="text-sm text-gray-400">
                      Step description not available
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show static algorithm information when not executing
            <div className="h-full flex flex-col">
              {/* Header with algorithm name and complexity */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <h2 className="text-lg font-semibold text-white">{algorithmInfo.name}</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Time: {complexity.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Space: {complexity.space}</span>
                  </div>
                </div>
              </div>

              {/* Algorithm description and key points */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-100">Description</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {algorithmInfo.description}
                  </p>
                </div>
                {/* <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-100">Key Points</h3>
                  <ul className="space-y-1">
                    {algorithmInfo.keyPoints.slice(0, 3).map((point, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmExplanationPanel;
