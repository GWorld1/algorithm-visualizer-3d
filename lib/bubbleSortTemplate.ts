// Bubble Sort Algorithm Template with Dynamic Inner Loop
// This demonstrates the proper implementation of bubble sort using dynamic loop bounds

import { ScriptNode, Connection } from '@/types/visualScripting';

export interface BubbleSortTemplate {
  nodes: ScriptNode[];
  connections: Connection[];
  description: string;
  arrayLength: number;
}

export function createBubbleSortTemplate(arrayLength: number = 5): BubbleSortTemplate {
  const nodes: ScriptNode[] = [
    // Start node
    {
      id: 'start-bubble',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Start Bubble Sort' }
    },

    // Array length variable (n)
    {
      id: 'var-n',
      type: 'variable-set',
      position: { x: 100, y: 200 },
      data: {
        label: 'Array Length (n)',
        variableName: 'n',
        variableValue: arrayLength
      }
    },

    // Outer loop: for (i = 0; i < n-1; i++)
    {
      id: 'outer-loop',
      type: 'for-loop',
      position: { x: 100, y: 300 },
      data: {
        label: 'Outer Loop (i)',
        loopStart: 0,
        loopEnd: arrayLength - 1, // This will be overridden by dynamic connection
        loopVariable: 'i'
      }
    },

    // Calculate n-1 for outer loop end condition
    {
      id: 'calc-n-minus-1',
      type: 'math-operation',
      position: { x: 300, y: 250 },
      data: {
        label: 'n - 1',
        operation: 'subtract',
        leftValue: arrayLength,
        rightValue: 1
      }
    },

    // Calculate n-i-1 for inner loop end condition
    {
      id: 'calc-n-i-1',
      type: 'math-operation',
      position: { x: 300, y: 400 },
      data: {
        label: 'n - i - 1',
        operation: 'subtract',
        leftValue: arrayLength,
        rightValue: 0 // Will be connected to i
      }
    },

    // Subtract 1 from (n-i) to get (n-i-1)
    {
      id: 'calc-minus-1',
      type: 'math-operation',
      position: { x: 500, y: 400 },
      data: {
        label: 'Subtract 1',
        operation: 'subtract',
        leftValue: 0, // Will be connected from calc-n-i-1
        rightValue: 1
      }
    },

    // Inner loop: for (j = 0; j < n-i-1; j++)
    {
      id: 'inner-loop',
      type: 'for-loop',
      position: { x: 100, y: 500 },
      data: {
        label: 'Inner Loop (j)',
        loopStart: 0,
        loopEnd: arrayLength - 2, // This will be overridden by dynamic connection
        loopVariable: 'j'
      }
    },

    // Calculate j+1 for comparison index
    {
      id: 'calc-j-plus-1',
      type: 'math-operation',
      position: { x: 300, y: 600 },
      data: {
        label: 'j + 1',
        operation: 'add',
        leftValue: 0, // Will be connected to j
        rightValue: 1
      }
    },

    // Compare adjacent elements: array[j] > array[j+1]
    {
      id: 'compare-elements',
      type: 'array-compare',
      position: { x: 100, y: 700 },
      data: {
        label: 'Compare arr[j] > arr[j+1]',
        arrayIndex1: 0, // Will be connected to j
        arrayIndex2: 1  // Will be connected to j+1
      }
    },

    // If condition to check if swap is needed
    {
      id: 'if-swap-needed',
      type: 'if-condition',
      position: { x: 100, y: 800 },
      data: {
        label: 'If Greater',
        comparisonOperator: '==',
        leftValue: true,
        rightValue: true
      }
    },

    // Swap elements: swap(array[j], array[j+1])
    {
      id: 'swap-elements',
      type: 'array-swap',
      position: { x: 300, y: 900 },
      data: {
        label: 'Swap arr[j] ↔ arr[j+1]',
        arrayIndex1: 0, // Will be connected to j
        arrayIndex2: 1  // Will be connected to j+1
      }
    },

    // Update description for visualization
    {
      id: 'update-desc',
      type: 'update-description',
      position: { x: 500, y: 900 },
      data: {
        label: 'Update Status',
        description: 'Swapped elements at positions {j} and {j+1}',
        descriptionTemplate: 'Swapped elements at positions {j} and {j+1}'
      }
    },

    // End node
    {
      id: 'end-bubble',
      type: 'end',
      position: { x: 100, y: 1000 },
      data: { label: 'Bubble Sort Complete' }
    }
  ];

  const connections: Connection[] = [
    // Main execution flow
    { source: 'start-bubble', sourceHandle: 'exec-out', target: 'var-n', targetHandle: 'exec-in' },
    { source: 'var-n', sourceHandle: 'exec-out', target: 'calc-n-minus-1', targetHandle: 'exec-in' },
    { source: 'calc-n-minus-1', sourceHandle: 'exec-out', target: 'outer-loop', targetHandle: 'exec-in' },
    { source: 'outer-loop', sourceHandle: 'exec-out', target: 'calc-n-i-1', targetHandle: 'exec-in' },
    { source: 'calc-n-i-1', sourceHandle: 'exec-out', target: 'calc-minus-1', targetHandle: 'exec-in' },
    { source: 'calc-minus-1', sourceHandle: 'exec-out', target: 'inner-loop', targetHandle: 'exec-in' },
    { source: 'inner-loop', sourceHandle: 'exec-out', target: 'calc-j-plus-1', targetHandle: 'exec-in' },
    { source: 'calc-j-plus-1', sourceHandle: 'exec-out', target: 'compare-elements', targetHandle: 'exec-in' },
    { source: 'compare-elements', sourceHandle: 'exec-out', target: 'if-swap-needed', targetHandle: 'exec-in' },
    { source: 'if-swap-needed', sourceHandle: 'exec-true', target: 'swap-elements', targetHandle: 'exec-in' },
    { source: 'swap-elements', sourceHandle: 'exec-out', target: 'update-desc', targetHandle: 'exec-in' },
    { source: 'outer-loop', sourceHandle: 'exec-complete', target: 'end-bubble', targetHandle: 'exec-in' },

    // Data flow connections for dynamic loop bounds
    { source: 'var-n', sourceHandle: 'value-out', target: 'calc-n-minus-1', targetHandle: 'left-in' },
    { source: 'calc-n-minus-1', sourceHandle: 'result-out', target: 'outer-loop', targetHandle: 'loopEnd-in' },
    
    // Dynamic inner loop end condition: n - i - 1
    { source: 'var-n', sourceHandle: 'value-out', target: 'calc-n-i-1', targetHandle: 'left-in' },
    { source: 'outer-loop', sourceHandle: 'index-out', target: 'calc-n-i-1', targetHandle: 'right-in' },
    { source: 'calc-n-i-1', sourceHandle: 'result-out', target: 'calc-minus-1', targetHandle: 'left-in' },
    { source: 'calc-minus-1', sourceHandle: 'result-out', target: 'inner-loop', targetHandle: 'loopEnd-in' },

    // Data flow for array operations
    { source: 'inner-loop', sourceHandle: 'index-out', target: 'calc-j-plus-1', targetHandle: 'left-in' },
    { source: 'inner-loop', sourceHandle: 'index-out', target: 'compare-elements', targetHandle: 'index1-in' },
    { source: 'calc-j-plus-1', sourceHandle: 'result-out', target: 'compare-elements', targetHandle: 'index2-in' },
    { source: 'inner-loop', sourceHandle: 'index-out', target: 'swap-elements', targetHandle: 'index1-in' },
    { source: 'calc-j-plus-1', sourceHandle: 'result-out', target: 'swap-elements', targetHandle: 'index2-in' },
    { source: 'compare-elements', sourceHandle: 'result-out', target: 'if-swap-needed', targetHandle: 'left-in' },

    // Data flow for description updates
    { source: 'inner-loop', sourceHandle: 'index-out', target: 'update-desc', targetHandle: 'value-in' }
  ];

  return {
    nodes,
    connections,
    description: `Bubble Sort algorithm with dynamic inner loop bounds. The inner loop correctly reduces its range from n-1 to 1 as the outer loop progresses, implementing the optimization where each pass places the largest remaining element in its correct position.`,
    arrayLength
  };
}

// Export function to create bubble sort with custom array
export function createBubbleSortForArray(inputArray: number[]): BubbleSortTemplate {
  return createBubbleSortTemplate(inputArray.length);
}
