"use client"
import { useEffect } from 'react';
import ViewportPanel from './ViewportPanel';
import ControlDashboard from './ControlDashboard';
import AlgorithmExplanationPanel from './AlgorithmExplanationPanel';
import VisualScriptingEditor from '@/components/visual-scripting/VisualScriptingEditor';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';

const SplitScreenLayout = () => {
  const { setVisualScriptingMode } = useUIStore();

  const handleExitSplitScreen = () => {
    setVisualScriptingMode(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleExitSplitScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 flex flex-col">
      {/* Algorithm Explanation Panel - Top banner */}
      <div className="flex-shrink-0">
        <AlgorithmExplanationPanel />
      </div>

      {/* Main split-screen content area */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Left side - Visual Scripting Editor (50%) */}
        <div className="w-full lg:w-1/2 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-600 flex flex-col min-h-0 bg-gray-900/50">
          {/* Header with exit button */}
          <div className="flex-shrink-0 bg-gray-900/95 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-purple-400" />
              Visual Scripting Editor
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitSplitScreen}
              className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Exit Split-Screen Mode"
            >
              <X className="w-4 h-4" />
              Exit Split View
            </Button>
          </div>

          {/* Visual Scripting Editor */}
          <div className="flex-1 min-h-0">
            <VisualScriptingEditor />
          </div>
        </div>

        {/* Right side - 3D Viewport + Controls (50%) */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 bg-gray-800/30">
          {/* Viewport Header */}
          <div className="flex-shrink-0 bg-gray-900/95 border-b border-gray-700 px-4 py-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              3D Visualization
            </h2>
          </div>

          {/* 3D Viewport */}
          <div className="flex-1 min-h-0 relative">
            <ViewportPanel />
          </div>

          {/* Control Dashboard - Fixed height */}
          <div className="h-[80px] lg:h-[80px] xl:h-[100px] flex-shrink-0 border-t border-gray-700">
            <ControlDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenLayout;
