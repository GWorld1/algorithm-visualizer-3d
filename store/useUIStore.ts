import { create } from 'zustand';

type UIState = {
  // Panel visibility
  isMobileView: boolean;
  activeTab: 'visualization' | 'controls' | 'data' | 'explanation';
  
  // Data customization panel state
  activeDataTab: 'generator' | 'manual';
  
  // Generator settings
  generatorSettings: {
    size: number;
    minValue: number;
    maxValue: number;
    distribution: 'uniform' | 'normal' | 'sorted' | 'reverse';
  };
  
  // Manual input state
  manualInput: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  
  // Actions
  setMobileView: (isMobile: boolean) => void;
  setActiveTab: (tab: 'visualization' | 'controls' | 'data' | 'explanation') => void;
  setActiveDataTab: (tab: 'generator' | 'manual') => void;
  updateGeneratorSettings: (settings: Partial<UIState['generatorSettings']>) => void;
  updateManualInput: (input: Partial<UIState['manualInput']>) => void;
  resetUI: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isMobileView: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  activeTab: 'visualization',
  activeDataTab: 'generator',
  
  generatorSettings: {
    size: 10,
    minValue: 1,
    maxValue: 100,
    distribution: 'uniform',
  },
  
  manualInput: {
    value: '',
    isValid: true,
    errorMessage: '',
  },
  
  // Actions
  setMobileView: (isMobile) =>
    set({ isMobileView: isMobile }),
  
  setActiveTab: (tab) =>
    set({ activeTab: tab }),
  
  setActiveDataTab: (tab) =>
    set({ activeDataTab: tab }),
  
  updateGeneratorSettings: (settings) =>
    set((state) => ({
      generatorSettings: { ...state.generatorSettings, ...settings },
    })),
  
  updateManualInput: (input) =>
    set((state) => ({
      manualInput: { ...state.manualInput, ...input },
    })),
  
  resetUI: () =>
    set({
      activeTab: 'visualization',
      activeDataTab: 'generator',
      generatorSettings: {
        size: 10,
        minValue: 1,
        maxValue: 100,
        distribution: 'uniform',
      },
      manualInput: {
        value: '',
        isValid: true,
        errorMessage: '',
      },
    }),
}));
