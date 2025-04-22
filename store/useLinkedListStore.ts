import { create } from 'zustand';
import { LinkedListNode } from '@/types/LinkedListNode';
import { LinkedListStep } from '@/lib/linkedListAlgorithms';
import { calculateLinkedListLayout } from '@/lib/linkedListLayout';

type LinkedListState = {
  linkedList: LinkedListNode | null;
  steps: LinkedListStep[];
  currentStep: number;
  isPlaying: boolean;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  setLinkedList: (list: LinkedListNode | null) => void;
  setSteps: (steps: LinkedListStep[]) => void;
  setCurrentStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  reset: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

export const useLinkedListStore = create<LinkedListState>((set) => ({
  linkedList: null,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  isCreating: false,
  setIsCreating: (isCreating) => set({ isCreating }),
  setLinkedList: (list) => set({ linkedList: calculateLinkedListLayout(list) }),
  setSteps: (steps) => set({ steps }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  reset: () => set({ 
    currentStep: 0, 
    isPlaying: false, 
    steps: [],
    // Don't reset the linkedList here, as we want to keep it between operations
  }),
  goToNextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      isPlaying: false, // Pause animation when manually stepping
    }));
  },
  goToPreviousStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
      isPlaying: false, // Pause animation when manually stepping
    }));
  },
}));