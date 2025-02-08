// sortingAlgorithms.ts

export type ArrayElementState = {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted';
  position: number;
};

export type SortStep = {
  action: 'compare' | 'swap' | 'complete';
  indices: [number, number];
  array: number[];
  elements: ArrayElementState[];
};

// sortingAlgorithms.ts
export const bubbleSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  const n = arr.length;

  // Function to check if an index is in its final sorted position
  const isInFinalPosition = (idx: number, currentArray: number[]): boolean => {
    if (idx === 0) {
      return currentArray[idx] <= currentArray[idx + 1];
    } else if (idx === currentArray.length - 1) {
      return currentArray[idx] >= currentArray[idx - 1];
    }
    return currentArray[idx] >= currentArray[idx - 1] && 
           currentArray[idx] <= currentArray[idx + 1];
  };

  const createElementStates = (
    arr: number[],
    comparing: number[] = [],
    swapping: number[] = [],
    sortedIndices: number[] = []
  ): ArrayElementState[] => {
    return arr.map((value, idx) => {
      // Check if the element is being compared but is also in its final position
      const isComparing = comparing.includes(idx);
      const isSwapping = swapping.includes(idx);
      const isSorted = sortedIndices.includes(idx) || 
                      (isComparing && isInFinalPosition(idx, arr));

      return {
        value,
        state: isSwapping ? 'swapping' : 
               isComparing && !isSorted ? 'comparing' : 
               isSorted ? 'sorted' : 
               'default',
        position: idx,
      };
    });
  };

  // Track sorted elements
  const sortedIndices = new Set<number>();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Add comparison step
      steps.push({
        action: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        elements: createElementStates(arr, [j, j + 1], [], Array.from(sortedIndices)),
      });

      if (arr[j] > arr[j + 1]) {
        // Add swap step
        steps.push({
          action: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          elements: createElementStates(arr, [], [j, j + 1], Array.from(sortedIndices)),
        });

        // Perform the swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Add step after swap is complete
        steps.push({
          action: 'complete',
          indices: [j, j + 1],
          array: [...arr],
          elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
        });
      }
    }

    // Mark the last element in this pass as sorted
    sortedIndices.add(n - i - 1);

    // Check if elements are in their final positions
    for (let k = 0; k < n; k++) {
      if (isInFinalPosition(k, arr)) {
        sortedIndices.add(k);
      }
    }

    // Add step to show sorted elements
    steps.push({
      action: 'complete',
      indices: [n - i - 1, n - i - 1],
      array: [...arr],
      elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
    });

    if (!swapped) {
      // If no swaps occurred, all remaining elements are sorted
      for (let k = 0; k < n; k++) {
        sortedIndices.add(k);
      }
      break;
    }
  }

  // Final step with all elements marked as sorted
  steps.push({
    action: 'complete',
    indices: [0, 0],
    array: [...arr],
    elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
  });

  return steps;
};

// Quick Sort Implementation with Visualization Steps
export const quickSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  const sortedIndices = new Set<number>();

  // Function to check if an index is in its final sorted position
  const isInFinalPosition = (idx: number, finalArray: number[]): boolean => {
    if (idx === 0) return finalArray[idx] <= finalArray[idx + 1];
    if (idx === finalArray.length - 1) return finalArray[idx] >= finalArray[idx - 1];
    return finalArray[idx] >= finalArray[idx - 1] && 
           finalArray[idx] <= finalArray[idx + 1];
  };

  const createElementStates = (
    arr: number[],
    pivotIndex?: number,
    compareIndices: number[] = [],
    partitionIndices: number[] = [],
    sortedIndices: Set<number> = new Set()
  ): ArrayElementState[] => {
    return arr.map((value, idx) => {
      const isComparing = compareIndices.includes(idx);
      const isPartitioning = partitionIndices.includes(idx);
      const isPivot = idx === pivotIndex;
      const isSorted = sortedIndices.has(idx) || 
                       (isInFinalPosition(idx, arr) && !isComparing);

      return {
        value,
        state: isPivot ? 'swapping' :  // Pivot highlighted differently
               isPartitioning ? 'comparing' : 
               isSorted ? 'sorted' : 
               isComparing ? 'comparing' : 
               'default',
        position: idx,
      };
    });
  };

  const partition = (
    low: number, 
    high: number, 
    currentArr: number[]
  ): { pivotIndex: number; steps: SortStep[] } => {
    const partitionSteps: SortStep[] = [];
    const pivot = currentArr[high];
    let i = low - 1;

    // Initial pivot selection step
    partitionSteps.push({
      action: 'compare',
      indices: [high, high],
      array: [...currentArr],
      elements: createElementStates(currentArr, high, [], [])
    });

    for (let j = low; j < high; j++) {
      // Comparison step
      partitionSteps.push({
        action: 'compare',
        indices: [j, high],
        array: [...currentArr],
        elements: createElementStates(currentArr, high, [j], [])
      });

      if (currentArr[j] <= pivot) {
        i++;

        // Swap elements
        if (i !== j) {
          [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];

          // Swap visualization step
          partitionSteps.push({
            action: 'swap',
            indices: [i, j],
            array: [...currentArr],
            elements: createElementStates(currentArr, high, [], [i, j])
          });
        }
      }
    }

    // Final swap to put pivot in correct position
    const pivotIndex = i + 1;
    [currentArr[pivotIndex], currentArr[high]] = [currentArr[high], currentArr[pivotIndex]];
    
    partitionSteps.push({
      action: 'complete',
      indices: [pivotIndex, high],
      array: [...currentArr],
      elements: createElementStates(currentArr, pivotIndex, [], [], new Set([pivotIndex]))
    });

    return { pivotIndex, steps: partitionSteps };
  };

  const quickSortRecursive = (
    low: number, 
    high: number, 
    currentArr: number[]
  ): SortStep[] => {
    const recursiveSteps: SortStep[] = [];

    if (low < high) {
      // Initial range comparison step
      recursiveSteps.push({
        action: 'compare',
        indices: [low, high],
        array: [...currentArr],
        elements: createElementStates(currentArr)
      });

      // Partition the array
      const { pivotIndex, steps: partitionSteps } = partition(low, high, currentArr);
      recursiveSteps.push(...partitionSteps);

      // Recursively sort left and right subarrays
      const leftSubArraySteps = quickSortRecursive(low, pivotIndex - 1, currentArr);
      const rightSubArraySteps = quickSortRecursive(pivotIndex + 1, high, currentArr);

      recursiveSteps.push(...leftSubArraySteps, ...rightSubArraySteps);

      // Mark pivot and surrounding elements as sorted
      const sortedIndicesSet = new Set([pivotIndex]);
      for (let i = Math.max(0, pivotIndex - 1); i <= Math.min(high, pivotIndex + 1); i++) {
        if (isInFinalPosition(i, currentArr)) {
          sortedIndicesSet.add(i);
        }
      }

      recursiveSteps.push({
        action: 'complete',
        indices: [low, high],
        array: [...currentArr],
        elements: createElementStates(currentArr, undefined, [], [], sortedIndicesSet)
      });
    }

    return recursiveSteps;
  };

  // Generate steps for the entire quicksort process
  const finalSteps = quickSortRecursive(0, arr.length - 1, arr);

  // Add a final step to mark all elements as sorted
  const allSortedIndices = new Set(arr.keys());
  finalSteps.push({
    action: 'complete',
    indices: [0, arr.length - 1],
    array: arr,
    elements: createElementStates(arr, undefined, [], [], allSortedIndices)
  });

  return finalSteps;
};

// Export for use in visualization components
