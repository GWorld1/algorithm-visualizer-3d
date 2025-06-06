import { create } from 'zustand';
import { 
  ScriptNode, 
  Connection, 
  CustomAlgorithm, 
  CustomAlgorithmStep, 
  NodeType, 
  Position,
  ExecutionContext,
  ValidationResult
} from '@/types/VisualScripting';

interface VisualScriptingState {
  // Editor state
  nodes: ScriptNode[];
  connections: Connection[];
  selectedNode: string | null;
  isEditing: boolean;
  
  // Algorithm state
  currentAlgorithm: CustomAlgorithm | null;
  savedAlgorithms: CustomAlgorithm[];
  
  // Execution state
  compiledSteps: CustomAlgorithmStep[];
  executionContext: ExecutionContext | null;
  
  // UI state
  showNodePalette: boolean;
  draggedNodeType: NodeType | null;
  
  // Actions
  addNode: (type: NodeType, position: Position) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Partial<ScriptNode['data']>) => void;
  selectNode: (nodeId: string | null) => void;
  
  // Connection actions
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (connectionId: string) => void;
  
  // Algorithm actions
  createNewAlgorithm: (name: string, description: string) => void;
  saveAlgorithm: () => void;
  loadAlgorithm: (algorithmId: string) => void;
  compileAlgorithm: () => CustomAlgorithmStep[];
  validateScript: () => ValidationResult;
  
  // Execution actions
  executeAlgorithm: (inputArray: number[]) => CustomAlgorithmStep[];
  resetExecution: () => void;
  
  // UI actions
  setEditing: (editing: boolean) => void;
  toggleNodePalette: () => void;
  setDraggedNodeType: (type: NodeType | null) => void;
  
  // Utility actions
  clearAll: () => void;
  importAlgorithm: (algorithm: CustomAlgorithm) => void;
  exportAlgorithm: () => CustomAlgorithm | null;
}

// Generate unique IDs
const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default execution context
const createDefaultExecutionContext = (): ExecutionContext => ({
  variables: new Map(),
  currentArray: [],
  currentIndex: 0,
  loopStack: [],
  executionStack: [],
  isComplete: false
});

export const useVisualScriptingStore = create<VisualScriptingState>((set, get) => ({
  // Initial state
  nodes: [],
  connections: [],
  selectedNode: null,
  isEditing: false,
  
  currentAlgorithm: null,
  savedAlgorithms: [],
  
  compiledSteps: [],
  executionContext: null,
  
  showNodePalette: true,
  draggedNodeType: null,
  
  // Node actions
  addNode: (type: NodeType, position: Position) => {
    const nodeId = generateId();
    const newNode: ScriptNode = {
      id: nodeId,
      type,
      position,
      data: {
        label: getDefaultLabel(type),
        isValid: true
      }
    };
    
    set(state => ({
      nodes: [...state.nodes, newNode],
      selectedNode: nodeId
    }));
  },
  
  removeNode: (nodeId: string) => {
    set(state => ({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      connections: state.connections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      ),
      selectedNode: state.selectedNode === nodeId ? null : state.selectedNode
    }));
  },
  
  updateNode: (nodeId: string, data: Partial<ScriptNode['data']>) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    }));
  },
  
  selectNode: (nodeId: string | null) => {
    set({ selectedNode: nodeId });
  },
  
  // Connection actions
  addConnection: (connection: Omit<Connection, 'id'>) => {
    const connectionId = generateId();
    set(state => ({
      connections: [...state.connections, { ...connection, id: connectionId }]
    }));
  },
  
  removeConnection: (connectionId: string) => {
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== connectionId)
    }));
  },
  
  // Algorithm actions
  createNewAlgorithm: (name: string, description: string) => {
    const algorithm: CustomAlgorithm = {
      id: generateId(),
      name,
      description,
      dataStructureType: 'array',
      nodes: [],
      connections: [],
      isValid: false
    };
    
    set({
      currentAlgorithm: algorithm,
      nodes: [],
      connections: [],
      selectedNode: null,
      isEditing: true
    });
  },
  
  saveAlgorithm: () => {
    const state = get();
    if (!state.currentAlgorithm) return;
    
    const updatedAlgorithm: CustomAlgorithm = {
      ...state.currentAlgorithm,
      nodes: state.nodes,
      connections: state.connections,
      isValid: state.validateScript().isValid
    };
    
    set(prevState => ({
      currentAlgorithm: updatedAlgorithm,
      savedAlgorithms: [
        ...prevState.savedAlgorithms.filter(alg => alg.id !== updatedAlgorithm.id),
        updatedAlgorithm
      ]
    }));
  },
  
  loadAlgorithm: (algorithmId: string) => {
    const state = get();
    const algorithm = state.savedAlgorithms.find(alg => alg.id === algorithmId);
    
    if (algorithm) {
      set({
        currentAlgorithm: algorithm,
        nodes: algorithm.nodes,
        connections: algorithm.connections,
        selectedNode: null,
        isEditing: true
      });
    }
  },
  
  compileAlgorithm: () => {
    const state = get();
    const validation = state.validateScript();

    if (!validation.isValid) {
      console.error('Cannot compile invalid script:', validation.errors);
      return [];
    }

    // Import the interpreter dynamically to avoid circular dependencies
    import('@/lib/visualScriptingInterpreter').then(({ VisualScriptingInterpreter }) => {
      const interpreter = new VisualScriptingInterpreter(state.nodes, state.connections, [1, 2, 3, 4, 5]);
      const steps = interpreter.execute();
      set({ compiledSteps: steps });
    });

    return get().compiledSteps;
  },
  
  validateScript: () => {
    const state = get();
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Basic validation
    const hasStart = state.nodes.some(node => node.type === 'start');
    const hasEnd = state.nodes.some(node => node.type === 'end');
    
    if (!hasStart) errors.push('Algorithm must have a Start node');
    if (!hasEnd) errors.push('Algorithm must have an End node');
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },
  
  executeAlgorithm: (inputArray: number[]) => {
    const state = get();
    const validation = state.validateScript();

    if (!validation.isValid) {
      console.error('Cannot execute invalid script:', validation.errors);
      return [];
    }

    // Import the interpreter dynamically
    import('@/lib/visualScriptingInterpreter').then(({ VisualScriptingInterpreter }) => {
      const interpreter = new VisualScriptingInterpreter(state.nodes, state.connections, inputArray);
      const steps = interpreter.execute();
      set({ compiledSteps: steps });

      // Also update the main algorithm store
      import('@/store/useAlgorithmStore').then(({ useAlgorithmStore }) => {
        const algorithmStore = useAlgorithmStore.getState();
        algorithmStore.setSteps(steps);
        algorithmStore.setAlgorithmType('customVisualScript');
        algorithmStore.setDataStructure('array'); // Ensure array visualization is used
      });
    });

    return get().compiledSteps;
  },
  
  resetExecution: () => {
    set({
      executionContext: createDefaultExecutionContext(),
      compiledSteps: []
    });
  },
  
  // UI actions
  setEditing: (editing: boolean) => {
    set({ isEditing: editing });
  },
  
  toggleNodePalette: () => {
    set(state => ({ showNodePalette: !state.showNodePalette }));
  },
  
  setDraggedNodeType: (type: NodeType | null) => {
    set({ draggedNodeType: type });
  },
  
  // Utility actions
  clearAll: () => {
    set({
      nodes: [],
      connections: [],
      selectedNode: null,
      currentAlgorithm: null,
      compiledSteps: [],
      executionContext: null
    });
  },
  
  importAlgorithm: (algorithm: CustomAlgorithm) => {
    set({
      currentAlgorithm: algorithm,
      nodes: algorithm.nodes,
      connections: algorithm.connections,
      selectedNode: null,
      isEditing: true
    });
  },
  
  exportAlgorithm: () => {
    const state = get();
    return state.currentAlgorithm;
  }
}));

// Helper function to get default labels for node types
function getDefaultLabel(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    'start': 'Start',
    'end': 'End',
    'for-loop': 'For Loop',
    'if-condition': 'If Condition',
    'array-access': 'Array Access',
    'array-compare': 'Compare Elements',
    'array-swap': 'Swap Elements',
    'array-highlight': 'Highlight Elements',
    'variable-set': 'Set Variable',
    'variable-get': 'Get Variable',
    'counter-increment': 'Increment Counter',
    'update-description': 'Update Description',
    'pause-execution': 'Pause'
  };
  
  return labels[type] || type;
}
