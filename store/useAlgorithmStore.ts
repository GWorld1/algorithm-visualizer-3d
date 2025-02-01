import { sampleTree } from '@/data/sampleTree';
import { calculateTreeLayout } from '@/lib/treeLayout';
import { TreeNode } from '@/types/Treenode';
import { create } from 'zustand';

type AlgorithmState = {
  algorithmType: 'bfs' | 'dfs';
  setAlgorithmType: (algorithmType: 'bfs' | 'dfs') => void;
  tree: TreeNode;
  updateTree: (newTree: TreeNode) => void;
  currentStep: number;
  steps: TreeNode[];
  isPlaying: boolean;
  setSteps: (steps: TreeNode[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
};

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  algorithmType: 'bfs',
  setAlgorithmType: (algorithmType) => {
     set({ algorithmType }) 
     useAlgorithmStore.getState().reset();
    },
  tree: calculateTreeLayout(sampleTree),
  updateTree: (newTree) =>  {
    console.log('Updating tree:', newTree);
    set({ tree: newTree })
  },
  currentStep: 0,
  steps: [],
  isPlaying: false,
  setSteps: (steps) => set({ steps }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
}));