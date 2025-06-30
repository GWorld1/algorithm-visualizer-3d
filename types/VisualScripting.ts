// Visual Scripting Types for Algorithm Visualizer

export interface Position {
  x: number;
  y: number;
}

export interface NodeInput {
  id: string;
  type: 'execution' | 'array' | 'number' | 'boolean' | 'any';
  label: string;
}

export interface NodeOutput {
  id: string;
  type: 'execution' | 'array' | 'number' | 'boolean' | 'any';
  label: string;
}

export interface Connection {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

export type NodeType = 
  | 'start'
  | 'end'
  | 'for-loop'
  | 'if-condition'
  | 'array-access'
  | 'array-compare'
  | 'array-swap'
  | 'array-highlight'
  | 'variable-set'
  | 'variable-get'
  | 'counter-increment'
  | 'update-description'
  | 'pause-execution';

export interface ScriptNodeData {
  label: string;
  // Control Flow
  condition?: string;
  comparisonOperator?: string;
  leftValue?: any;
  rightValue?: any;
  loopStart?: number;
  loopEnd?: number;
  loopVariable?: string;

  // Array Operations
  arrayIndex1?: number;
  arrayIndex2?: number;
  highlightColor?: string;
  highlightDuration?: number;

  // Variables
  variableName?: string;
  variableValue?: any;

  // Visualization
  description?: string;
  pauseDuration?: number;

  // Validation
  isValid?: boolean;
  errorMessage?: string;
}

export interface ScriptNode {
  id: string;
  type: NodeType;
  position: Position;
  data: ScriptNodeData;
  inputs?: NodeInput[];
  outputs?: NodeOutput[];
}

export interface CustomAlgorithmStep {
  dataStructureState: any;
  highlightedElements: number[];
  description: string;
  action: 'compare' | 'swap' | 'traverse' | 'highlight' | 'pause' | 'custom';
  metadata?: {
    indices?: number[];
    values?: any[];
    color?: string;
    duration?: number;
  };
}

export interface CustomAlgorithm {
  id: string;
  name: string;
  description: string;
  dataStructureType: 'array' | 'binaryTree' | 'linkedList' | 'weightedGraph';
  nodes: ScriptNode[];
  connections: Connection[];
  isValid: boolean;
  compiledSteps?: CustomAlgorithmStep[];
}

export interface ExecutionContext {
  variables: Map<string, any>;
  currentArray: number[];
  currentIndex: number;
  loopStack: Array<{
    variable: string;
    current: number;
    end: number;
    nodeId: string;
  }>;
  executionStack: string[];
  isComplete: boolean;
  error?: string;
}

// Node Templates for the palette
export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  category: 'control' | 'array' | 'variable' | 'visualization';
  icon: string;
  defaultData: ScriptNodeData;
  inputs: NodeInput[];
  outputs: NodeOutput[];
}

// Validation result for node connections
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
