import { NodeTemplate, NodeType } from '@/types/VisualScripting';

// Node templates for the visual scripting palette
export const nodeTemplates: NodeTemplate[] = [
  // Control Flow Nodes
  {
    type: 'start',
    label: 'Start',
    description: 'Starting point of the algorithm',
    category: 'control',
    icon: 'Play',
    defaultData: {
      label: 'Start',
      isValid: true
    },
    inputs: [],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' }
    ]
  },
  {
    type: 'end',
    label: 'End',
    description: 'End point of the algorithm',
    category: 'control',
    icon: 'Square',
    defaultData: {
      label: 'End',
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' }
    ],
    outputs: []
  },
  {
    type: 'for-loop',
    label: 'For Loop',
    description: 'Iterate through a range of values',
    category: 'control',
    icon: 'RotateCw',
    defaultData: {
      label: 'For Loop',
      loopStart: 0,
      loopEnd: 10,
      loopVariable: 'i',
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'array-in', type: 'array', label: 'Array (optional)' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Loop Body' },
      { id: 'exec-complete', type: 'execution', label: 'Complete' },
      { id: 'index-out', type: 'number', label: 'Current Index' },
      { id: 'array-out', type: 'array', label: 'Array' }
    ]
  },
  {
    type: 'if-condition',
    label: 'If Condition',
    description: 'Conditional execution based on comparison of two values',
    category: 'control',
    icon: 'GitBranch',
    defaultData: {
      label: 'If Condition',
      comparisonOperator: '==',
      leftValue: 0,
      rightValue: 0,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'left-in', type: 'any', label: 'Left Value' },
      { id: 'right-in', type: 'any', label: 'Right Value' }
    ],
    outputs: [
      { id: 'exec-true', type: 'execution', label: 'True' },
      { id: 'exec-false', type: 'execution', label: 'False' },
      { id: 'result-out', type: 'boolean', label: 'Result' }
    ]
  },

  // Array Operation Nodes
  {
    type: 'array-access',
    label: 'Array Access',
    description: 'Get value from array at specific index',
    category: 'array',
    icon: 'Database',
    defaultData: {
      label: 'Array Access',
      arrayIndex1: 0,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'array-in', type: 'array', label: 'Array' },
      { id: 'index-in', type: 'number', label: 'Index' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' },
      { id: 'value-out', type: 'number', label: 'Value' }
    ]
  },
  {
    type: 'array-compare',
    label: 'Compare Elements',
    description: 'Compare two array elements',
    category: 'array',
    icon: 'ArrowUpDown',
    defaultData: {
      label: 'Compare Elements',
      arrayIndex1: 0,
      arrayIndex2: 1,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'array-in', type: 'array', label: 'Array' },
      { id: 'index1-in', type: 'number', label: 'Index 1' },
      { id: 'index2-in', type: 'number', label: 'Index 2' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' },
      { id: 'result-out', type: 'boolean', label: 'Result' }
    ]
  },
  {
    type: 'array-swap',
    label: 'Swap Elements',
    description: 'Swap two elements in the array',
    category: 'array',
    icon: 'ArrowLeftRight',
    defaultData: {
      label: 'Swap Elements',
      arrayIndex1: 0,
      arrayIndex2: 1,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'array-in', type: 'array', label: 'Array' },
      { id: 'index1-in', type: 'number', label: 'Index 1' },
      { id: 'index2-in', type: 'number', label: 'Index 2' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' },
      { id: 'array-out', type: 'array', label: 'Array' }
    ]
  },
  {
    type: 'array-highlight',
    label: 'Highlight Elements',
    description: 'Highlight specific array elements',
    category: 'visualization',
    icon: 'Highlighter',
    defaultData: {
      label: 'Highlight Elements',
      arrayIndex1: 0,
      highlightColor: 'yellow',
      highlightDuration: 1000,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'indices-in', type: 'array', label: 'Indices' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' }
    ]
  },

  // Variable Nodes
  {
    type: 'variable-set',
    label: 'Set Variable',
    description: 'Set a variable to a specific value from data flow or static input',
    category: 'variable',
    icon: 'Equal',
    defaultData: {
      label: 'Set Variable',
      variableName: 'variable',
      variableValue: 0,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'value-in', type: 'any', label: 'Value' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' },
      { id: 'value-out', type: 'any', label: 'Value' }
    ]
  },
  {
    type: 'variable-get',
    label: 'Get Variable',
    description: 'Get the value of a variable',
    category: 'variable',
    icon: 'Variable',
    defaultData: {
      label: 'Get Variable',
      variableName: 'variable',
      isValid: true
    },
    inputs: [],
    outputs: [
      { id: 'value-out', type: 'any', label: 'Value' }
    ]
  },
  {
    type: 'counter-increment',
    label: 'Increment Counter',
    description: 'Increment a numeric variable by 1',
    category: 'variable',
    icon: 'Plus',
    defaultData: {
      label: 'Increment Counter',
      variableName: 'counter',
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' },
      { id: 'value-out', type: 'number', label: 'New Value' }
    ]
  },

  // Visualization Nodes
  {
    type: 'update-description',
    label: 'Update Description',
    description: 'Update the algorithm step description with dynamic values',
    category: 'visualization',
    icon: 'MessageSquare',
    defaultData: {
      label: 'Update Description',
      description: 'Algorithm step description',
      descriptionTemplate: 'Current value: {value}',
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' },
      { id: 'text-in', type: 'any', label: 'Description' },
      { id: 'value-in', type: 'any', label: 'Value' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' }
    ]
  },
  {
    type: 'pause-execution',
    label: 'Pause',
    description: 'Pause execution for visualization',
    category: 'visualization',
    icon: 'Pause',
    defaultData: {
      label: 'Pause',
      pauseDuration: 1000,
      isValid: true
    },
    inputs: [
      { id: 'exec-in', type: 'execution', label: 'Previous' }
    ],
    outputs: [
      { id: 'exec-out', type: 'execution', label: 'Next' }
    ]
  }
];

// Helper function to get template by type
export function getNodeTemplate(type: NodeType): NodeTemplate | undefined {
  return nodeTemplates.find(template => template.type === type);
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): NodeTemplate[] {
  return nodeTemplates.filter(template => template.category === category);
}

// Categories for organizing the palette
export const nodeCategories = [
  { id: 'control', label: 'Control Flow', icon: 'GitBranch' },
  { id: 'array', label: 'Array Operations', icon: 'Database' },
  { id: 'variable', label: 'Variables', icon: 'Variable' },
  { id: 'visualization', label: 'Visualization', icon: 'Eye' }
];
