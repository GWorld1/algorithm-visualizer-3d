// store/useStackQueueStore.ts
import { create } from 'zustand';

interface StackQueueState {
  elements: { value: number; index: number }[];
  push: (value: number) => void;
  pop: () => void;
  enqueue: (value: number) => void;
  dequeue: () => void;
}

export const useStackQueueStore = create<StackQueueState>((set) => ({
  elements: [{ value: 5, index: 0 }, { value: 3, index: 1 }, { value: 7, index: 2 }],
  push: (value: number) => set((state) => ({
    elements: [...state.elements, { value, index: state.elements.length }]
  })),
  pop: () => set((state) => ({
    elements: state.elements.slice(0, -1)
  })),
  enqueue: (value: number) => set((state) => ({
    elements: [...state.elements, { value, index: state.elements.length }]
  })),
  dequeue: () => set((state) => ({
    elements: state.elements.slice(1)
  }))
}));

export default useStackQueueStore;