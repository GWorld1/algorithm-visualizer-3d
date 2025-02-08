import { sampleTree } from '@/data/sampleTree';
import { sampleWeightedTree } from '@/data/sampleWeightTree';
import { calculateTreeLayout } from '@/lib/treeLayout';
import { calculateWeightedTreeLayout } from '@/lib/weightedGraphLayout';
import { TreeNode } from '@/types/Treenode';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { create } from 'zustand';
import { DataStructureType } from '@/types/DataStructure';
import { ArrayElementState} from '@/lib/sortingAlgorithms';
type AlgorithmType = 
  | 'bfs' 
  | 'dfs' 
  | 'dijkstra'
  | 'traverse'
  | 'reverse'
  | 'bubbleSort'
  | 'quickSort';

// Add to useAlgorithmStore.ts
type AnimationSettings = {
  speed: number;
  autoRotate: boolean;
  showLabels: boolean;
  showGrid: boolean;
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
  steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[];
  isPlaying: boolean;
  setSteps: (steps: TreeNode[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
};

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  animationSettings: {
    speed: 1,
    autoRotate: true,
    showLabels: true,
    showGrid: false,
  },
  updateAnimationSettings: (settings) => {
    set((state) => ({ animationSettings: { ...state.animationSettings, ...settings } }));
  },
  algorithmType: 'bfs',
  dataStructure: 'binaryTree',
  setDataStructure: (dataStructure: DataStructureType) => {
    set({ dataStructure });
    useAlgorithmStore.getState().reset();
  },
  setAlgorithmType: (algorithmType) => {
     set({ algorithmType }) 
     useAlgorithmStore.getState().reset();
    },
  tree: calculateTreeLayout(sampleTree),
  updateTree: (newTree) =>  {
    console.log('Updating tree:', newTree);
    set({ tree: newTree })
  },
  weightedTree: calculateWeightedTreeLayout(sampleWeightedTree),
  updateWeightedTree: (newTree) => set({ weightedTree: newTree }),
  currentStep: 0,
  steps: [],
  isPlaying: false,
  setSteps: (steps) => set({ steps }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
}));