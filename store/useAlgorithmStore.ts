import { sampleTree } from '@/data/sampleTree';
import { sampleWeightedTree } from '@/data/sampleWeightTree';
import { calculateTreeLayout } from '@/lib/treeLayout';
import { calculateWeightedTreeLayout } from '@/lib/weightedGraphLayout';
import { TreeNode } from '@/types/Treenode';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { create } from 'zustand';

type AlgorithmState = {
  algorithmType: 'bfs' | 'dfs' | "dijkstra";
  setAlgorithmType: (algorithmType: 'bfs' | 'dfs' |'dijkstra') => void;
  weightedTree?: WeightedTreeNode;
  updateWeightedTree: (newTree: WeightedTreeNode) => void;
  tree: TreeNode;
  updateTree: (newTree: TreeNode) => void;
  currentStep: number;
  steps: TreeNode[] | WeightedTreeNode[];
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