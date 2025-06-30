"use client"
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  Play,
  RotateCw,
  Database,
  BookOpen,
  Bug
} from 'lucide-react';
import { ValidationResult } from '@/types/VisualScripting';

interface DebuggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: ValidationResult;
  onOpenGuide: () => void;
  onCreateExample: () => void;
}

const DebuggerModal: React.FC<DebuggerModalProps> = ({ 
  isOpen,
  onClose,
  validation, 
  onOpenGuide, 
  onCreateExample 
}) => {
  if (validation.isValid && validation.errors.length === 0 && validation.warnings.length === 0) {
    return null;
  }

  const getCommonSolutions = (errors: string[]) => {
    const solutions = [];
    
    if (errors.some(e => e.includes('Start node'))) {
      solutions.push({
        icon: <Play className="w-4 h-4 text-green-400" />,
        title: "Add a Start Node",
        description: "Every algorithm needs a starting point. Drag a Start node from the palette.",
        action: "Show Guide"
      });
    }
    
    if (errors.some(e => e.includes('End node'))) {
      solutions.push({
        icon: <XCircle className="w-4 h-4 text-red-400" />,
        title: "Add an End Node", 
        description: "Mark where your algorithm completes. Drag an End node from the palette.",
        action: "Show Guide"
      });
    }
    
    if (errors.some(e => e.includes('disconnected') || e.includes('isolated'))) {
      solutions.push({
        icon: <ArrowRight className="w-4 h-4 text-blue-400" />,
        title: "Connect All Nodes",
        description: "Make sure all nodes are connected in a valid execution path.",
        action: "Show Guide"
      });
    }
    
    if (errors.some(e => e.includes('array') || e.includes('data'))) {
      solutions.push({
        icon: <Database className="w-4 h-4 text-purple-400" />,
        title: "Array Operations Guide",
        description: "Learn how to work with arrays in visual scripting.",
        action: "Open Array Guide"
      });
    }
    
    return solutions;
  };

  const solutions = getCommonSolutions(validation.errors);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Bug className="w-5 h-5 text-red-400" />
            Algorithm Debugger
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Issues found in your visual script. Fix these to run your algorithm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Errors */}
          {validation.errors.length > 0 && (
            <Card className="bg-gray-900 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Critical Issues</span>
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                    {validation.errors.length}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-red-300">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <Card className="bg-gray-900 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Warnings</span>
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                    {validation.warnings.length}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-yellow-300">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Solutions */}
          {solutions.length > 0 && (
            <Card className="bg-gray-900 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Suggested Fixes</span>
                </div>
                <div className="space-y-3">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                      {solution.icon}
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{solution.title}</div>
                        <div className="text-gray-300 text-xs mt-1">{solution.description}</div>
                      </div>
                      {solution.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={solution.action === "Show Guide" ? onOpenGuide : 
                                  solution.action === "Open Array Guide" ? onOpenGuide : undefined}
                          className="text-xs border-gray-600 hover:bg-gray-700"
                        >
                          {solution.action}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Tips */}
          <Card className="bg-gray-900 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Connection Tips</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Green handles = Execution flow (what happens next)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Blue handles = Data flow (values passed between nodes)</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Connect outputs (right side) to inputs (left side). Hover over handles for more info.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onCreateExample}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Create Example
            </Button>
            <Button
              onClick={onOpenGuide}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-700 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Open Guide
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebuggerModal;
