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
  steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[];
  isPlaying: boolean;
  setSteps: (steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[]) => void;
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
    stepDuration: 1000 // Default step duration in milliseconds
  },
  updateAnimationSettings: (settings) => {
    set((state) => ({ animationSettings: { ...state.animationSettings, ...settings } }));
  },
  algorithmType: 'bfs',
  dataStructure: 'binaryTree',
  setDataStructure: (dataStructure: DataStructureType) => {
    set({ dataStructure, currentStep: 0 });
    useAlgorithmStore.getState().reset();
    useLinkedListStore.getState().reset(); // Reset linked list store
  },
  setAlgorithmType: (algorithmType) => {
    set({ 
      algorithmType, 
      currentStep: 0,
      steps: [] // Reset steps when changing algorithm type
    });
  },
  tree: calculateTreeLayout(sampleTree),
  updateTree: (newTree) =>  {
    console.log('Updating tree:', newTree);
    set({ tree: newTree })
  },
  weightedTree: calculateWeightedTreeLayout(sampleWeightedTree),
  updateWeightedTree: (newTree) => set({ weightedTree: newTree }),
  currentStep: 0,  steps: [],
  isPlaying: false,
  setSteps: (steps: TreeNode[] | WeightedTreeNode[] | ArrayElementState[] | LinkedListStep[] | BSTStep[]) => set({ 
    steps,
    currentStep: 0, // Reset current step when setting new steps
    isPlaying: false // Ensure animation is paused when setting new steps
  }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => {
    set({ 
      currentStep: 0, 
      isPlaying: false,
      steps: [] // Clear the steps when resetting
    });
    useLinkedListStore.getState().reset();
  }
  
}));