"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  XCircle,
  Lightbulb,
  ArrowRight,
  Play,
  RotateCw,
  Database,
  BookOpen
} from 'lucide-react';
import { ValidationResult } from '@/types/VisualScripting';

interface ValidationFeedbackProps {
  validation: ValidationResult;
  onOpenGuide: () => void;
  onCreateExample: () => void;
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({ 
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
        description: "Every algorithm needs a starting point. Drag a Start node from the palette."
      });
    }
    
    if (errors.some(e => e.includes('End node'))) {
      solutions.push({
        icon: <XCircle className="w-4 h-4 text-red-400" />,
        title: "Add an End Node", 
        description: "Mark where your algorithm completes. Drag an End node from the palette."
      });
    }
    
    // Check for common array iteration issues
    const hasLoop = errors.some(e => e.includes('loop') || e.includes('iteration'));
    const hasArrayAccess = errors.some(e => e.includes('array') || e.includes('access'));
    
    if (hasLoop || hasArrayAccess) {
      solutions.push({
        icon: <RotateCw className="w-4 h-4 text-blue-400" />,
        title: "Array Iteration Pattern",
        description: "For array processing, connect: Start → For Loop → Array Access → End",
        action: "Show Guide"
      });
    }
    
    return solutions;
  };

  const getConnectionTips = () => {
    return [
      {
        icon: <div className="w-3 h-3 bg-green-500 rounded-full" />,
        text: "Green handles = Execution flow (what happens next)"
      },
      {
        icon: <div className="w-3 h-3 bg-blue-500 rounded-full" />,
        text: "Blue handles = Data flow (values passed between nodes)"
      },
      {
        icon: <ArrowRight className="w-4 h-4 text-gray-400" />,
        text: "Connect outputs (right side) to inputs (left side)"
      }
    ];
  };

  const solutions = getCommonSolutions(validation.errors);
  const connectionTips = getConnectionTips();

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">Issues Found</span>
            </div>
            <ul className="space-y-1 text-sm text-red-300 ml-6">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Warnings</span>
            </div>
            <ul className="space-y-1 text-sm text-yellow-300 ml-6">
              {validation.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Solutions */}
        {solutions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Quick Fixes</span>
            </div>
            <div className="space-y-2">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3 p-2 bg-gray-700 rounded">
                  {solution.icon}
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{solution.title}</div>
                    <div className="text-gray-300 text-xs">{solution.description}</div>
                  </div>
                  {solution.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={solution.action === "Show Guide" ? onOpenGuide : undefined}
                      className="text-xs"
                    >
                      {solution.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Tips */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">Connection Tips</span>
          </div>
          <div className="space-y-1">
            {connectionTips.map((tip, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                {tip.icon}
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onOpenGuide}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Array Iteration Guide
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onCreateExample}
          >
            <Database className="w-4 h-4 mr-1" />
            Create Example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationFeedback;
