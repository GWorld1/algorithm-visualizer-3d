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
  animationSpeed: number;
  setIsCreating: (isCreating: boolean) => void;
  setLinkedList: (list: LinkedListNode | null) => void;
  setSteps: (steps: LinkedListStep[]) => void;
  setCurrentStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  resetLinkedListAnimation: () => void;
  resetSteps: () => void;
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
  animationSpeed: 1,
  setIsCreating: (isCreating) => set({ isCreating }),
  setLinkedList: (list) => set({ linkedList: calculateLinkedListLayout(list) }),
  setSteps: (steps) => set({ steps }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  reset: () => set({ 
    currentStep: 0, 
    isPlaying: false, 
    steps: [],
  //  linkedList: null,
  }),
  resetSteps: () => set({
    currentStep:0
  }),
  resetLinkedListAnimation: () => set({
    currentStep:0,
    isPlaying: false
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