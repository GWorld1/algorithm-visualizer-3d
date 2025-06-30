"use client"
import { useEffect, useState, useRef } from 'react';
import ViewportPanel from './ViewportPanel';
import ControlDashboard from './ControlDashboard';
import AlgorithmExplanationPanel from './AlgorithmExplanationPanel';
import VisualScriptingEditor from '@/components/visual-scripting/VisualScriptingEditor';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';

const SplitScreenLayout = () => {
  const { setVisualScriptingMode, setActiveDataTab } = useUIStore();
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExitSplitScreen = () => {
    setVisualScriptingMode(false);
    // Optionally reset to generator tab when exiting split-screen
    setActiveDataTab('generator');
  };

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 25% and 75%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 25), 75);
      setLeftPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="flex-shrink-0 border-b border-gray-700/50">
        <AlgorithmExplanationPanel />
      </div>

      {/* Main split-screen content area */}
      <div
        ref={containerRef}
        className={`flex flex-1 min-h-0 transition-all duration-300 ${
          isMobile ? 'flex-col' : 'flex-row'
        }`}
      >
        {/* Left side - Visual Scripting Editor with dynamic width */}
        <div
          className={`flex flex-col min-h-0 bg-gray-900/50 overflow-hidden transition-all duration-200 ${
            isMobile
              ? 'w-full border-b-2 border-gray-600'
              : 'border-r-2 border-gray-600'
          }`}
          style={{
            width: isMobile ? '100%' : `${leftPanelWidth}%`
          }}
        >
          {/* Header with exit button */}
          <div className="flex-shrink-0 bg-gray-900/95 border-b border-gray-700 px-3 sm:px-4 py-2 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="hidden sm:inline">Visual Scripting Editor</span>
              <span className="sm:hidden">VS Editor</span>
              {!isMobile && (
                <span className="text-xs text-gray-400 ml-2">
                  ({Math.round(leftPanelWidth)}%)
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitSplitScreen}
              className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Exit Split-Screen Mode"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Exit Split View</span>
            </Button>
          </div>

          {/* Visual Scripting Editor with proper containment */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <VisualScriptingEditor />
          </div>
        </div>

        {/* Resize Handle - Only show on desktop */}
        {!isMobile && (
          <div
            className={`w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize transition-all duration-200 relative group ${
              isResizing ? 'bg-blue-500 w-2' : ''
            }`}
            onMouseDown={handleMouseDown}
            title="Drag to resize panels"
          >
            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
              <div className={`w-1 h-8 bg-gray-400 rounded-full transition-all duration-200 ${
                isResizing ? 'opacity-100 bg-blue-400 w-2' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </div>
          </div>
        )}

        {/* Right side - 3D Viewport + Controls with dynamic width */}
        <div
          className={`flex flex-col min-h-0 bg-gray-800/30 transition-all duration-200 ${
            isMobile
              ? 'w-full border-t border-gray-700/50'
              : 'border-l border-gray-700/50'
          }`}
          style={{
            width: isMobile ? '100%' : `${100 - leftPanelWidth}%`
          }}
        >
          {/* Viewport Header */}
          <div className="flex-shrink-0 bg-gray-900/95 border-b border-gray-700 px-3 sm:px-4 py-2">
            <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-sm"></div>
              </div>
              <span className="hidden sm:inline">3D Visualization</span>
              <span className="sm:hidden">3D View</span>
              {!isMobile && (
                <span className="text-xs text-gray-400 ml-2">
                  ({Math.round(100 - leftPanelWidth)}%)
                </span>
              )}
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
