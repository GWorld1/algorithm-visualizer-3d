// Create a new store for visualization settings
import { create } from 'zustand'
interface VisualizationSettings {
    showGrid: boolean
    showLabels: boolean
    autoRotate: boolean
    animationSpeed: number
    setShowGrid: (show: boolean) => void
    setShowLabels: (show: boolean) => void
    setAutoRotate: (rotate: boolean) => void
    setAnimationSpeed: (speed: number) => void
  }
  
  export const useVisualizationStore = create<VisualizationSettings>((set) => ({
    showGrid: true,
    showLabels: true,
    autoRotate: false,
    animationSpeed: 1,
    setShowGrid: (show) => set({ showGrid: show }),
    setShowLabels: (show) => set({ showLabels: show }),
    setAutoRotate: (rotate) => set({ autoRotate: rotate }),
    setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  }))