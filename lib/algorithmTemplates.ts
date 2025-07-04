import { NodeType } from '@/types/VisualScripting';

export interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sorting' | 'searching' | 'graph' | 'array' | 'debug';
  complexity: {
    time: string;
    space: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  estimatedTime: string; // e.g., "2-3 minutes"
  tags: string[];
  preview: {
    nodeCount: number;
    connectionCount: number;
    thumbnail?: string; // Optional base64 or URL for visual preview
  };
  nodes: Array<{
    type: NodeType;
    position: { x: number; y: number };
    data?: Record<string, unknown>;
  }>;
  connections: Array<{
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }>;
  documentation: {
    overview: string;
    steps: string[];
    learningObjectives: string[];
    prerequisites?: string[];
  };
}

export const algorithmTemplates: AlgorithmTemplate[] = [
  {
    id: 'simple-test',
    name: 'Simple Test (Debug)',
    description: 'A basic template for testing array access and highlighting functionality',
    category: 'debug',
    complexity: {
      time: 'O(1)',
      space: 'O(1)',
      level: 'beginner'
    },
    estimatedTime: '30 seconds',
    tags: ['debug', 'test', 'array', 'basic'],
    preview: {
      nodeCount: 4,
      connectionCount: 3
    },
    nodes: [
      { type: 'start', position: { x: 100, y: 200 } },
      { type: 'array-access', position: { x: 300, y: 200 } },
      { type: 'array-highlight', position: { x: 500, y: 200 } },
      { type: 'end', position: { x: 700, y: 200 } }
    ],
    connections: [
      { source: 'start-1', sourceHandle: 'exec-out', target: 'array-access-1', targetHandle: 'exec-in' },
      { source: 'array-access-1', sourceHandle: 'exec-out', target: 'array-highlight-1', targetHandle: 'exec-in' },
      { source: 'array-highlight-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
    ],
    documentation: {
      overview: 'This template demonstrates basic array operations with visual feedback.',
      steps: [
        'Start the algorithm',
        'Access an array element',
        'Highlight the accessed element',
        'End the algorithm'
      ],
      learningObjectives: [
        'Understand basic visual scripting flow',
        'Learn array access operations',
        'Practice element highlighting'
      ]
    }
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    description: 'Search for a target value by checking each element sequentially',
    category: 'searching',
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      level: 'beginner'
    },
    estimatedTime: '2-3 minutes',
    tags: ['search', 'linear', 'sequential', 'array'],
    preview: {
      nodeCount: 8,
      connectionCount: 7
    },
    nodes: [
      { type: 'start', position: { x: 100, y: 100 } },
      { 
        type: 'variable-set', 
        position: { x: 100, y: 200 },
        data: {
          variableName: 'target',
          variableValue: 5,
          label: 'Set Target = 5'
        }
      },
      { 
        type: 'for-loop', 
        position: { x: 100, y: 300 },
        data: {
          loopStart: 0,
          loopVariable: 'i',
          label: 'For i = 0 to array.length'
        }
      },
      { type: 'array-access', position: { x: 300, y: 350 } },
      { 
        type: 'if-condition', 
        position: { x: 300, y: 450 },
        data: {
          condition: 'array[i] == target',
          label: 'If array[i] == target'
        }
      },
      { 
        type: 'array-highlight', 
        position: { x: 500, y: 400 },
        data: {
          arrayIndex1: 0,
          highlightColor: 'green',
          label: 'Highlight Found Element'
        }
      },
      { 
        type: 'update-description', 
        position: { x: 500, y: 500 },
        data: {
          description: 'Element found!',
          label: 'Show Success Message'
        }
      },
      { type: 'end', position: { x: 700, y: 450 } }
    ],
    connections: [
      { source: 'start-1', sourceHandle: 'exec-out', target: 'variable-set-1', targetHandle: 'exec-in' },
      { source: 'variable-set-1', sourceHandle: 'exec-out', target: 'for-loop-1', targetHandle: 'exec-in' },
      { source: 'for-loop-1', sourceHandle: 'exec-out', target: 'array-access-1', targetHandle: 'exec-in' },
      { source: 'array-access-1', sourceHandle: 'exec-out', target: 'if-condition-1', targetHandle: 'exec-in' },
      { source: 'if-condition-1', sourceHandle: 'true-out', target: 'array-highlight-1', targetHandle: 'exec-in' },
      { source: 'array-highlight-1', sourceHandle: 'exec-out', target: 'update-description-1', targetHandle: 'exec-in' },
      { source: 'update-description-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
    ],
    documentation: {
      overview: 'Linear search examines each element in sequence until the target is found or all elements are checked.',
      steps: [
        'Set the target value to search for',
        'Start a loop from the first element',
        'Access the current array element',
        'Compare with the target value',
        'If found, highlight the element and show success',
        'Continue until found or end of array'
      ],
      learningObjectives: [
        'Understand sequential search algorithms',
        'Learn loop-based array traversal',
        'Practice conditional logic in algorithms',
        'Visualize search process step by step'
      ],
      prerequisites: ['Basic understanding of arrays', 'Familiarity with loops and conditions']
    }
  },
  {
    id: 'find-maximum',
    name: 'Find Maximum',
    description: 'Find the largest element in an array by comparing each element',
    category: 'array',
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      level: 'beginner'
    },
    estimatedTime: '2-3 minutes',
    tags: ['array', 'maximum', 'comparison', 'traversal'],
    preview: {
      nodeCount: 8,
      connectionCount: 7
    },
    nodes: [
      { type: 'start', position: { x: 100, y: 100 } },
      { 
        type: 'variable-set', 
        position: { x: 100, y: 200 },
        data: {
          variableName: 'max',
          variableValue: 'array[0]',
          label: 'Set max = array[0]'
        }
      },
      { 
        type: 'for-loop', 
        position: { x: 100, y: 300 },
        data: {
          loopStart: 1,
          loopVariable: 'i',
          label: 'For i = 1 to array.length'
        }
      },
      { type: 'array-access', position: { x: 300, y: 350 } },
      { 
        type: 'if-condition', 
        position: { x: 300, y: 450 },
        data: {
          condition: 'array[i] > max',
          label: 'If array[i] > max'
        }
      },
      { 
        type: 'variable-set', 
        position: { x: 500, y: 400 },
        data: {
          variableName: 'max',
          variableValue: 'array[i]',
          label: 'Update max = array[i]'
        }
      },
      { 
        type: 'array-highlight', 
        position: { x: 500, y: 500 },
        data: {
          arrayIndex1: 0,
          highlightColor: 'blue',
          label: 'Highlight New Max'
        }
      },
      { type: 'end', position: { x: 700, y: 450 } }
    ],
    connections: [
      { source: 'start-1', sourceHandle: 'exec-out', target: 'variable-set-1', targetHandle: 'exec-in' },
      { source: 'variable-set-1', sourceHandle: 'exec-out', target: 'for-loop-1', targetHandle: 'exec-in' },
      { source: 'for-loop-1', sourceHandle: 'exec-out', target: 'array-access-1', targetHandle: 'exec-in' },
      { source: 'array-access-1', sourceHandle: 'exec-out', target: 'if-condition-1', targetHandle: 'exec-in' },
      { source: 'if-condition-1', sourceHandle: 'true-out', target: 'variable-set-2', targetHandle: 'exec-in' },
      { source: 'variable-set-2', sourceHandle: 'exec-out', target: 'array-highlight-1', targetHandle: 'exec-in' },
      { source: 'array-highlight-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
    ],
    documentation: {
      overview: 'This algorithm finds the maximum element by maintaining a running maximum and comparing each element.',
      steps: [
        'Initialize max with the first array element',
        'Loop through remaining elements starting from index 1',
        'Access the current element',
        'Compare current element with max',
        'If current > max, update max and highlight element',
        'Continue until all elements are processed'
      ],
      learningObjectives: [
        'Understand comparison-based algorithms',
        'Learn variable tracking in loops',
        'Practice conditional updates',
        'Visualize maximum finding process'
      ],
      prerequisites: ['Basic understanding of arrays', 'Familiarity with variables and comparisons']
    }
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    description: 'Sort an array by repeatedly swapping adjacent elements that are in wrong order',
    category: 'sorting',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
      level: 'beginner'
    },
    estimatedTime: '3-4 minutes',
    tags: ['sorting', 'bubble', 'comparison', 'swap'],
    preview: {
      nodeCount: 10,
      connectionCount: 9
    },
    nodes: [
      { type: 'start', position: { x: 100, y: 100 } },
      {
        type: 'for-loop',
        position: { x: 100, y: 200 },
        data: {
          loopStart: 0,
          loopVariable: 'i',
          label: 'For i = 0 to array.length-1'
        }
      },
      {
        type: 'for-loop',
        position: { x: 100, y: 300 },
        data: {
          loopStart: 0,
          loopVariable: 'j',
          label: 'For j = 0 to array.length-i-1'
        }
      },
      { type: 'array-access', position: { x: 300, y: 350 } },
      { type: 'array-access', position: { x: 300, y: 450 } },
      {
        type: 'if-condition',
        position: { x: 500, y: 400 },
        data: {
          condition: 'array[j] > array[j+1]',
          label: 'If array[j] > array[j+1]'
        }
      },
      {
        type: 'array-highlight',
        position: { x: 700, y: 350 },
        data: {
          highlightColor: 'red',
          label: 'Highlight Elements to Swap'
        }
      },
      {
        type: 'array-swap',
        position: { x: 700, y: 450 },
        data: {
          label: 'Swap array[j] and array[j+1]'
        }
      },
      {
        type: 'update-description',
        position: { x: 700, y: 550 },
        data: {
          description: 'Swapped elements',
          label: 'Update Description'
        }
      },
      { type: 'end', position: { x: 900, y: 400 } }
    ],
    connections: [
      { source: 'start-1', sourceHandle: 'exec-out', target: 'for-loop-1', targetHandle: 'exec-in' },
      { source: 'for-loop-1', sourceHandle: 'exec-out', target: 'for-loop-2', targetHandle: 'exec-in' },
      { source: 'for-loop-2', sourceHandle: 'exec-out', target: 'array-access-1', targetHandle: 'exec-in' },
      { source: 'array-access-1', sourceHandle: 'exec-out', target: 'array-access-2', targetHandle: 'exec-in' },
      { source: 'array-access-2', sourceHandle: 'exec-out', target: 'if-condition-1', targetHandle: 'exec-in' },
      { source: 'if-condition-1', sourceHandle: 'true-out', target: 'array-highlight-1', targetHandle: 'exec-in' },
      { source: 'array-highlight-1', sourceHandle: 'exec-out', target: 'array-swap-1', targetHandle: 'exec-in' },
      { source: 'array-swap-1', sourceHandle: 'exec-out', target: 'update-description-1', targetHandle: 'exec-in' },
      { source: 'update-description-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
    ],
    documentation: {
      overview: 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      steps: [
        'Start with outer loop for number of passes',
        'Inner loop compares adjacent elements',
        'Access current and next elements',
        'Compare the two elements',
        'If current > next, highlight and swap them',
        'Continue until array is sorted'
      ],
      learningObjectives: [
        'Understand nested loops in sorting',
        'Learn comparison-based sorting',
        'Practice element swapping',
        'Visualize sorting process step by step'
      ],
      prerequisites: ['Basic understanding of arrays', 'Familiarity with nested loops']
    }
  }
];

export const templateCategories = [
  { id: 'debug', name: 'Debug & Testing', icon: 'Bug', description: 'Simple templates for testing functionality' },
  { id: 'searching', name: 'Search Algorithms', icon: 'Search', description: 'Templates for various search algorithms' },
  { id: 'array', name: 'Array Operations', icon: 'Database', description: 'Templates for array manipulation and analysis' },
  { id: 'sorting', name: 'Sorting Algorithms', icon: 'ArrowUpDown', description: 'Templates for sorting algorithms' },
  { id: 'graph', name: 'Graph Algorithms', icon: 'GitBranch', description: 'Templates for graph traversal and analysis' }
];

// Helper functions
export function getTemplateById(id: string): AlgorithmTemplate | undefined {
  return algorithmTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): AlgorithmTemplate[] {
  return algorithmTemplates.filter(template => template.category === category);
}

export function searchTemplates(query: string): AlgorithmTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return algorithmTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
