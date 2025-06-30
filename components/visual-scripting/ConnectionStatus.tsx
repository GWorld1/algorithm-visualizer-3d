/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface ConnectionStatusProps {
  isConnecting: boolean;
  sourceNode?: string;
  sourceHandle?: string;
  sourceType?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnecting,
  sourceNode,
  sourceHandle,
  sourceType
}) => {
  if (!isConnecting) return null;

  const getHandleInfo = (handleId: string, type: string) => {
    const isExecution = type === 'execution';
    const icon = isExecution ? <Zap className="w-4 h-4 text-green-400" /> : <Database className="w-4 h-4 text-blue-400" />;
    const color = isExecution ? 'text-green-400' : 'text-blue-400';
    
    let description = '';
    switch (handleId) {
      case 'exec-out':
        description = 'Loop Body - executes repeatedly';
        break;
      case 'exec-complete':
        description = 'Complete - executes once when loop ends';
        break;
      case 'index-out':
        description = 'Current Index - provides 0, 1, 2, 3...';
        break;
      case 'array-out':
        description = 'Array - the array being processed';
        break;
      default:
        description = handleId.replace('-', ' ');
    }
    
    return { icon, color, description };
  };

  const handleInfo = sourceHandle && sourceType ? getHandleInfo(sourceHandle, sourceType) : null;

  return (
    <Card className="fixed top-4 right-4 z-50 bg-gray-800 border-gray-600 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">Connecting...</span>
        </div>
        
        {handleInfo && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {handleInfo.icon}
              <span className={`text-sm ${handleInfo.color}`}>
                {handleInfo.description}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ArrowRight className="w-3 h-3" />
              <span>Drag to a compatible input</span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-300">Green glow = Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">Dimmed = Incompatible</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs">
          <div className="flex items-start gap-2">
            <Info className="w-3 h-3 text-blue-400 mt-0.5" />
            <div className="text-blue-200">
              <div className="font-medium">Quick Tips:</div>
              <div>• Green handles = Execution flow</div>
              <div>• Blue handles = Data flow</div>
              <div>• Look for glowing handles</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;
