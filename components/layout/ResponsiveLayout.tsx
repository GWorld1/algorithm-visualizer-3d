"use client"
import { useUIStore } from '@/store/useUIStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ViewportPanel from './ViewportPanel';
import DataCustomizationPanel from './DataCustomizationPanel';
import ControlDashboard from './ControlDashboard';
import AlgorithmExplanationPanel from './AlgorithmExplanationPanel';
import { 
  Eye, 
  Settings, 
  Play, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ResponsiveLayout = () => {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs = [
    { id: 'visualization', label: 'View', icon: Eye },
    { id: 'controls', label: 'Controls', icon: Play },
    { id: 'data', label: 'Data', icon: Settings },
    { id: 'explanation', label: 'Info', icon: BookOpen },
  ] as const;

  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (direction === 'left' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    } else if (direction === 'right' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'visualization':
        return (
          <div className="h-full">
            <ViewportPanel />
          </div>
        );
      case 'controls':
        return (
          <div className="h-full p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4">Animation Controls</h2>
            <div className="h-[calc(100%-2rem)]">
              <ControlDashboard />
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="h-full">
            <DataCustomizationPanel />
          </div>
        );
      case 'explanation':
        return (
          <div className="h-full p-4 bg-white overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Algorithm Information</h2>
            <AlgorithmExplanationPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-r from-violet-200 to-pink-200 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white/90 backdrop-blur-sm border-b border-white/20">
        <h1 className="text-xl font-semibold text-gray-800">3D Algorithm Visualizer</h1>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {renderActivePanel()}
        
        {/* Swipe Navigation Hints */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSwipeNavigation('left')}
            disabled={activeTab === tabs[0].id}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSwipeNavigation('right')}
            disabled={activeTab === tabs[tabs.length - 1].id}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Card className="border-0 rounded-none bg-white/95 backdrop-blur-sm">
        <CardContent className="p-2">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="p-2 bg-white/90 backdrop-blur-sm border-t border-white/20">
        <p className="text-xs text-gray-500 text-center">
          Created by Gnowa Rickneil | 
          <a href="https://github.com/GWorld1" className="inline-flex items-center ml-1">
            <img src="/github-icon.svg" alt="Github" className="w-3 h-3" />
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ResponsiveLayout;
