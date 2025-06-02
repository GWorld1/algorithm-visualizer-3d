import { sampleTree } from '@/data/sampleTree';
import { sampleWeightedTree } from '@/data/sampleWeightTree';
import { calculateTreeLayout } from '@/lib/treeLayout';
import { calculateWeightedTreeLayout } from '@/lib/weightedGraphLayout';
import { TreeNode } from '@/types/Treenode';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { create } from 'zustand';
import { DataStructureType } from '@/types/DataStructure';
import { ArrayElementState} from '@/lib/sortingAlgorithms';
import { useLinkedListStore } from './useLinkedListStore';
import { LinkedListStep } from '@/lib/linkedListAlgorithms';
import { AlgorithmType } from '@/types/AlgorithmType';
import { BSTStep } from '@/lib/bstAlgorithms';
import { DijkstraStep } from '@/lib/graphAlgorithms';
import { TraversalStep } from '@/lib/treeAlgorithms';


type AnimationSettings = {
  speed: number;
  autoRotate: boolean;
  showLabels: boolean;
  showGrid: boolean;
  stepDuration: number; // Add step duration control
};

type AlgorithmState = {
  // Add to state
  animationSettings: AnimationSettings;
  updateAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  algorithmType: AlgorithmType;
  dataStructure: DataStructureType;
  setAlgorithmType: (algorithmType: AlgorithmType) => void;
  setDataStructure: (dataStructure: DataStructureType) => void;
  weightedTree?: WeightedTreeNode;
  updateWeightedTree: (newTree: WeightedTreeNode) => void;
  tree: TreeNode;
  updateTree: (newTree: TreeNode) => void;
  currentStep: number;
  steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[] | DijkstraStep[] | TraversalStep[];
  isPlaying: boolean;
  setSteps: (steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[] | DijkstraStep[] | TraversalStep[]) => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
  reset: () => void;
  
};

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  animationSettings: {
    speed: 1,
    autoRotate: true,
    showLabels: true,
    showGrid: false,
    stepDuration: 1000 // Default step duration in milliseconds
  },
  updateAnimationSettings: (settings) => {
    set((state) => ({ animationSettings: { ...state.animationSettings, ...settings } }));
  },
  algorithmType: 'bfs',
  dataStructure: 'binaryTree',
  setDataStructure: (dataStructure: DataStructureType) => {
    // Stop any running animations before switching
    const currentState = useAlgorithmStore.getState();
    const linkedListState = useLinkedListStore.getState();

    // Stop animations
    if (currentState.isPlaying) {
      set({ isPlaying: false });
    }
    if (linkedListState.isPlaying) {
      linkedListState.setIsPlaying(false);
    }

    // Reset states
    set({ dataStructure, currentStep: 0, steps: [], isPlaying: false });
    useLinkedListStore.getState().reset();
  },
  setAlgorithmType: (algorithmType) => {
    // Stop any running animations before switching algorithms
    const currentState = useAlgorithmStore.getState();
    const linkedListState = useLinkedListStore.getState();

    if (currentState.isPlaying) {
      set({ isPlaying: false });
    }
    if (linkedListState.isPlaying) {
      linkedListState.setIsPlaying(false);
    }

    set({
      algorithmType,
      currentStep: 0,
      steps: [], // Reset steps when changing algorithm type
      isPlaying: false // Ensure animation is stopped when changing algorithm
    });

    // Reset linked list steps but keep the list structure
    linkedListState.resetSteps();
  },
  tree: calculateTreeLayout(sampleTree),
  updateTree: (newTree) =>  {
    console.log('Updating tree:', newTree);
    set({ tree: newTree })
  },
  weightedTree: calculateWeightedTreeLayout(sampleWeightedTree),
  updateWeightedTree: (newTree) => {
    set({ weightedTree: newTree });
    // If we're in Dijkstra mode, recalculate with the new source
    const state = useAlgorithmStore.getState();
    if (state.algorithmType === 'dijkstra') {
      // Find the source node
      const findSourceNode = (node: WeightedTreeNode, visited = new Set<number>()): WeightedTreeNode | null => {
        if (visited.has(node.value)) return null;
        visited.add(node.value);
        
        if (node.isSource) return node;
        
        for (const edge of Object.values(node.edges)) {
          const found = findSourceNode(edge.node, visited);
          if (found) return found;
        }
        
        return null;
      };
      
      const sourceNode = findSourceNode(newTree);
      if (sourceNode) {
        import('@/lib/graphAlgorithms').then(({ dijkstra }) => {
          const steps = dijkstra(newTree, sourceNode.value);
          set({ steps, currentStep: 0 });
        });
      }
    }
  },
  currentStep: 0,  steps: [],
  isPlaying: false,
  setSteps: (steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[] | DijkstraStep[] | TraversalStep[]) => set({
    steps,
    currentStep: 0, // Reset current step when setting new steps
    isPlaying: false // Ensure animation is paused when setting new steps
  }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  restart: () => {
    set({
      currentStep: 0,
      isPlaying: false
      // Keep steps intact for restart functionality
    });
    useLinkedListStore.getState().resetLinkedListAnimation();
  },
  reset: () => {
    set({
      currentStep: 0,
      isPlaying: false,
      steps: [] // Clear the steps when resetting
    });
    useLinkedListStore.getState().reset();
  }
  
}));