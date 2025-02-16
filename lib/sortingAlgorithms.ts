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
  description: string; // Added description field
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
      // Add comparison step with description
      steps.push({
        action: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        elements: createElementStates(arr, [j, j + 1], [], Array.from(sortedIndices)),
        description: `Comparing elements at positions ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`
      });

      if (arr[j] > arr[j + 1]) {
        // Add swap step with description
        steps.push({
          action: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          elements: createElementStates(arr, [], [j, j + 1], Array.from(sortedIndices)),
          description: `Swapping ${arr[j]} and ${arr[j + 1]} as ${arr[j]} > ${arr[j + 1]}`
        });

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          action: 'complete',
          indices: [j, j + 1],
          array: [...arr],
          elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
          description: `Completed swapping elements`
        });
      }
    }

    sortedIndices.add(n - i - 1);

    for (let k = 0; k < n; k++) {
      if (isInFinalPosition(k, arr)) {
        sortedIndices.add(k);
      }
    }

    steps.push({
      action: 'complete',
      indices: [n - i - 1, n - i - 1],
      array: [...arr],
      elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
      description: `Element ${arr[n - i - 1]} is now in its sorted position`
    });

    if (!swapped) {
      for (let k = 0; k < n; k++) {
        sortedIndices.add(k);
      }
      break;
    }
  }

  steps.push({
    action: 'complete',
    indices: [0, 0],
    array: [...arr],
    elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
    description: 'Array is now fully sorted!'
  });

  return steps;
};

// Quick Sort Implementation with Visualization Steps
export const quickSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  // const steps: SortStep[] = [];
  // const sortedIndices = new Set<number>();

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

    partitionSteps.push({
      action: 'compare',
      indices: [high, high],
      array: [...currentArr],
      elements: createElementStates(currentArr, high, [], []),
      description: `Selected pivot element: ${pivot} at position ${high}`
    });

    for (let j = low; j < high; j++) {
      partitionSteps.push({
        action: 'compare',
        indices: [j, high],
        array: [...currentArr],
        elements: createElementStates(currentArr, high, [j], []),
        description: `Comparing element ${currentArr[j]} with pivot ${pivot}`
      });

      if (currentArr[j] <= pivot) {
        i++;

        if (i !== j) {
          [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];

          partitionSteps.push({
            action: 'swap',
            indices: [i, j],
            array: [...currentArr],
            elements: createElementStates(currentArr, high, [], [i, j]),
            description: `Moving ${currentArr[i]} to the left side of pivot as it's smaller/equal`
          });
        }
      }
    }

    const pivotIndex = i + 1;
    [currentArr[pivotIndex], currentArr[high]] = [currentArr[high], currentArr[pivotIndex]];
    
    partitionSteps.push({
      action: 'complete',
      indices: [pivotIndex, high],
      array: [...currentArr],
      elements: createElementStates(currentArr, pivotIndex, [], [], new Set([pivotIndex])),
      description: `Placed pivot ${pivot} in its final position ${pivotIndex}`
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
        elements: createElementStates(currentArr),
        description: `Comparing elements at positions ${low} (${currentArr[low]}) and ${high} (${currentArr[high]})`
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
        elements: createElementStates(currentArr, undefined, [], [], sortedIndicesSet),
        description: `Elements at positions ${low} (${currentArr[low]}) and ${high} (${currentArr[high]}) are now sorted`
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
    elements: createElementStates(arr, undefined, [], [], allSortedIndices),
    description: 'All elements are now sorted!'
  });

  return finalSteps;
};

export const insertionSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  const n = arr.length;
  const sortedIndices = new Set<number>();

  // Helper function to create element states (reuse from existing code)
  const createElementStates = (
    arr: number[],
    comparing: number[] = [],
    swapping: number[] = [],
    sortedIndices: number[] = []
  ): ArrayElementState[] => {
    return arr.map((value, idx) => ({
      value,
      state: swapping.includes(idx) ? 'swapping' :
             comparing.includes(idx) ? 'comparing' :
             sortedIndices.includes(idx) ? 'sorted' :
             'default',
      position: idx,
    }));
  };

  // First element is always sorted
  sortedIndices.add(0);
  steps.push({
    action: 'complete',
    indices: [0, 0],
    array: [...arr],
    elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
    description: 'First element starts as sorted'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Show current element being considered
    steps.push({
      action: 'compare',
      indices: [i, i],
      array: [...arr],
      elements: createElementStates(arr, [i], [], Array.from(sortedIndices)),
      description: `Inserting element ${key} into sorted portion`
    });

    while (j >= 0 && arr[j] > key) {
      // Compare current element with each sorted element
      steps.push({
        action: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        elements: createElementStates(arr, [j, j + 1], [], Array.from(sortedIndices)),
        description: `Comparing ${arr[j]} with ${key}`
      });

      // Shift element
      steps.push({
        action: 'swap',
        indices: [j, j + 1],
        array: [...arr],
        elements: createElementStates(arr, [], [j, j + 1], Array.from(sortedIndices)),
        description: `Shifting ${arr[j]} one position to the right`
      });

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;

    // Show insertion complete
    sortedIndices.add(i);
    steps.push({
      action: 'complete',
      indices: [j + 1, j + 1],
      array: [...arr],
      elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
      description: `Inserted ${key} into its correct position`
    });
  }

  // Final step showing sorted array
  steps.push({
    action: 'complete',
    indices: [0, 0],
    array: [...arr],
    elements: createElementStates(arr, [], [], Array.from(sortedIndices)),
    description: 'Array is now fully sorted!'
  });

  return steps;
};


export const selectionSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  const n = arr.length;
  const sortedIndices = new Set<number>();

  const createElementStates = (
    arr: number[],
    comparing: number[] = [],
    swapping: number[] = [],
    sorted: Set<number> = new Set()
  ): ArrayElementState[] => {
    return arr.map((value, idx) => ({
      value,
      state: swapping.includes(idx) ? 'swapping' :
             comparing.includes(idx) ? 'comparing' :
             sorted.has(idx) ? 'sorted' :
             'default',
      position: idx,
    }));
  };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Add step to show current position being checked
    steps.push({
      action: 'compare',
      indices: [i, i],
      array: [...arr],
      elements: createElementStates(arr, [i], [], sortedIndices),
      description: `Starting to find the minimum element from position ${i}`
    });

    // Find the minimum element in the unsorted part
    for (let j = i + 1; j < n; j++) {
      // Add step for comparison
      steps.push({
        action: 'compare',
        indices: [minIdx, j],
        array: [...arr],
        elements: createElementStates(arr, [minIdx, j], [], sortedIndices),
        description: `Comparing current minimum ${arr[minIdx]} with ${arr[j]}`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        // Add step to show new minimum found
        steps.push({
          action: 'compare',
          indices: [minIdx, minIdx],
          array: [...arr],
          elements: createElementStates(arr, [minIdx], [], sortedIndices),
          description: `Found new minimum: ${arr[minIdx]} at position ${minIdx}`
        });
      }
    }

    // Swap the found minimum element with the first element of unsorted part
    if (minIdx !== i) {
      steps.push({
        action: 'swap',
        indices: [i, minIdx],
        array: [...arr],
        elements: createElementStates(arr, [], [i, minIdx], sortedIndices),
        description: `Swapping ${arr[i]} with minimum value ${arr[minIdx]}`
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      steps.push({
        action: 'complete',
        indices: [i, minIdx],
        array: [...arr],
        elements: createElementStates(arr, [], [], sortedIndices),
        description: `Completed swap`
      });
    }

    // Mark current position as sorted
    sortedIndices.add(i);
    steps.push({
      action: 'complete',
      indices: [i, i],
      array: [...arr],
      elements: createElementStates(arr, [], [], sortedIndices),
      description: `Position ${i} is now sorted with value ${arr[i]}`
    });
  }

  // Mark the last element as sorted
  sortedIndices.add(n - 1);
  steps.push({
    action: 'complete',
    indices: [n - 1, n - 1],
    array: [...arr],
    elements: createElementStates(arr, [], [], sortedIndices),
    description: 'Array is now fully sorted!'
  });

  return steps;
};

export const mergeSort = (inputArr: number[]): SortStep[] => {
  const arr = [...inputArr];
  const steps: SortStep[] = [];
  
  // Helper function to create element states
  const createElementStates = (
    arr: number[],
    comparing: number[] = [],
    merging: number[] = [],
    sortedIndices: number[] = []
  ): ArrayElementState[] => {
    return arr.map((value, idx) => ({
      value,
      state: merging.includes(idx) ? 'swapping' :
             comparing.includes(idx) ? 'comparing' :
             sortedIndices.includes(idx) ? 'sorted' :
             'default',
      position: idx,
    }));
  };

  // Merge function with visualization steps
  const merge = (
    left: number, 
    middle: number, 
    right: number, 
    fullArray: number[]
  ): void => {
    const leftArray = fullArray.slice(left, middle + 1);
    const rightArray = fullArray.slice(middle + 1, right + 1);
    
    steps.push({
      action: 'compare',
      indices: [left, right],
      array: [...fullArray],
      elements: createElementStates(
        fullArray,
        [left, right],
        [],
        []
      ),
      description: `Merging subarrays from index ${left} to ${middle} and ${middle + 1} to ${right}`
    });

    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      // Compare elements
      steps.push({
        action: 'compare',
        indices: [left + i, middle + 1 + j],
        array: [...fullArray],
        elements: createElementStates(
          fullArray,
          [left + i, middle + 1 + j],
          [],
          []
        ),
        description: `Comparing ${leftArray[i]} and ${rightArray[j]}`
      });

      if (leftArray[i] <= rightArray[j]) {
        // Place left element
        steps.push({
          action: 'swap',
          indices: [k, left + i],
          array: [...fullArray],
          elements: createElementStates(
            fullArray,
            [],
            [k],
            []
          ),
          description: `Placing ${leftArray[i]} from left subarray`
        });
        fullArray[k] = leftArray[i];
        i++;
      } else {
        // Place right element
        steps.push({
          action: 'swap',
          indices: [k, middle + 1 + j],
          array: [...fullArray],
          elements: createElementStates(
            fullArray,
            [],
            [k],
            []
          ),
          description: `Placing ${rightArray[j]} from right subarray`
        });
        fullArray[k] = rightArray[j];
        j++;
      }
      k++;
    }

    // Copy remaining elements from left array
    while (i < leftArray.length) {
      steps.push({
        action: 'swap',
        indices: [k, left + i],
        array: [...fullArray],
        elements: createElementStates(
          fullArray,
          [],
          [k],
          []
        ),
        description: `Placing remaining element ${leftArray[i]} from left subarray`
      });
      fullArray[k] = leftArray[i];
      i++;
      k++;
    }

    // Copy remaining elements from right array
    while (j < rightArray.length) {
      steps.push({
        action: 'swap',
        indices: [k, middle + 1 + j],
        array: [...fullArray],
        elements: createElementStates(
          fullArray,
          [],
          [k],
          []
        ),
        description: `Placing remaining element ${rightArray[j]} from right subarray`
      });
      fullArray[k] = rightArray[j];
      j++;
      k++;
    }

    // Mark merged section as sorted
    const sortedIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
    steps.push({
      action: 'complete',
      indices: [left, right],
      array: [...fullArray],
      elements: createElementStates(
        fullArray,
        [],
        [],
        sortedIndices
      ),
      description: `Completed merging subarrays from ${left} to ${right}`
    });
  };

  // Recursive merge sort function
  const mergeSortRecursive = (
    left: number,
    right: number,
    fullArray: number[]
  ): void => {
    if (left < right) {
      const middle = Math.floor((left + right) / 2);

      // Visualize division of array
      steps.push({
        action: 'compare',
        indices: [left, right],
        array: [...fullArray],
        elements: createElementStates(
          fullArray,
          [left, right],
          [],
          []
        ),
        description: `Dividing array from index ${left} to ${right} at middle point ${middle}`
      });

      // Recursively sort left and right halves
      mergeSortRecursive(left, middle, fullArray);
      mergeSortRecursive(middle + 1, right, fullArray);

      // Merge the sorted halves
      merge(left, middle, right, fullArray);
    }
  };

  // Start the merge sort
  mergeSortRecursive(0, arr.length - 1, arr);

  // Add final step showing entire array as sorted
  steps.push({
    action: 'complete',
    indices: [0, arr.length - 1],
    array: [...arr],
    elements: createElementStates(
      arr,
      [],
      [],
      Array.from(arr.keys())
    ),
    description: 'Array is now fully sorted!'
  });

  return steps;
};