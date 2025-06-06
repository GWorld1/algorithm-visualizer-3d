"use client"
import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import ViewportPanel from './ViewportPanel';
import DataCustomizationPanel from './DataCustomizationPanel';
import ControlDashboard from './ControlDashboard';
import AlgorithmExplanationPanel from './AlgorithmExplanationPanel';
import ResponsiveLayout from './ResponsiveLayout';
import SplitScreenLayout from './SplitScreenLayout';

const QuadPanelLayout = () => {
  const { isMobileView, isVisualScriptingMode, setMobileView } = useUIStore();

  // Handle responsive behavior - only use mobile layout for screens smaller than 768px
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileView]);

  // Mobile layout
  if (isMobileView) {
    return <ResponsiveLayout />;
  }

  // Split-screen layout for Visual Scripting
  if (isVisualScriptingMode) {
    return <SplitScreenLayout />;
  }

  // Desktop quad-panel layout
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 flex flex-col">
      {/* Header with title */}
      {/* <header className="relative z-10 px-4 py-3 flex-shrink-0">
        <h1 className="text-2xl lg:text-3xl font-semibold text-white">3D Algorithm Visualizer</h1>
      </header> */}

      {/* Algorithm Explanation Panel - Collapsible top banner */}
      <div className="flex-shrink-0">
        <AlgorithmExplanationPanel />
      </div>

      {/* Main content area - Takes remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Left section - Viewport + Controls */}
        <div className="flex flex-col w-[75%] xl:w-[70%] 2xl:w-[75%] min-h-0">
          {/* Primary 3D Viewport - 90% of left section height */}
          <div className="flex-1 min-h-0 relative">
            <ViewportPanel />
          </div>

          {/* Control Dashboard - Fixed height */}
          <div className="h-[80px] lg:h-[80px] xl:h-[100px] flex-shrink-0 border-t border-gray-700">
            <ControlDashboard />
          </div>
        </div>

        {/* Data Customization Panel - Right sidebar */}
        <div className="w-[25%] xl:w-[30%] 2xl:w-[25%] border-l border-gray-700 flex-shrink-0 min-w-[280px] max-w-[450px]">
          <DataCustomizationPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 right-2 z-20 pointer-events-none">
        <p className="text-xs text-gray-400 bg-gray-800/80 backdrop-blur-sm rounded px-2 py-1 pointer-events-auto">
          Created by Gnowa Rickneil |
          <a href="https://github.com/GWorld1" className="inline-flex items-center ml-1 hover:text-gray-300">
            <img src="/github-icon.svg" alt="Github" className="w-3 h-3" />
          </a>
        </p>
      </footer>
    </div>
  );
};

export default QuadPanelLayout;
