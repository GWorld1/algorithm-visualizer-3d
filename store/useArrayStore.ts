import { create } from 'zustand';

type ArrayState = {
  elements: number[];
  insert: (index: number, value: number) => void;
  remove: (index: number) => void;
};

export const useArrayStore = create<ArrayState>((set) => ({
  elements: [5, 3, 7 ,1 ,100 , 45 , 8],
  insert: (index, value) => {
    set((state) => {
      const newElements = [...state.elements];
      newElements.splice(index, 0, value);
      return { elements: newElements };
    });
  },
  remove: (index) => {
    set((state) => ({
      elements: state.elements.filter((_, i) => i !== index)
    }));
  }
}));