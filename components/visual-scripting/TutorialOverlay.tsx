"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Play, Lightbulb, Zap } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  highlight?: string;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Visual Scripting!",
    content: "Create custom algorithms by connecting visual nodes. Each node represents an operation, and connections define the execution flow.",
    highlight: "node-palette",
    action: "Let's start by exploring the node palette on the left."
  },
  {
    title: "Node Types",
    content: "Nodes are organized by category:\n• Control: Start, End, Loops, Conditions\n• Array: Access, Compare, Swap, Highlight\n• Variable: Set, Get, Increment\n• Visualization: Update descriptions, Pause",
    highlight: "categories",
    action: "Click on different categories to see available nodes."
  },
  {
    title: "Creating Your First Algorithm",
    content: "Every algorithm needs:\n1. A Start node (green)\n2. One or more operation nodes\n3. An End node (red)\n\nDrag nodes from the palette to the canvas.",
    highlight: "canvas",
    action: "Try the 'Simple Test' template to see a working example."
  },
  {
    title: "Connecting Nodes",
    content: "Connect nodes by dragging from output handles (right side) to input handles (left side):\n• Green handles: Execution flow\n• Blue handles: Data flow\n\nHover over handles to see tooltips.",
    highlight: "handles",
    action: "Practice connecting nodes to create a flow."
  },
  {
    title: "Running Your Algorithm",
    content: "Once your algorithm is complete:\n1. Click the 'Run' button in the toolbar\n2. Your algorithm will execute on the current array\n3. Use the animation controls to step through execution\n4. Watch the 3D visualization update in real-time",
    highlight: "run-button",
    action: "Ready to create your first algorithm!"
  }
];

interface TutorialOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-600 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">
                  {currentTutorialStep.title}
                </CardTitle>
                <div className="text-sm text-gray-400">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`
              }}
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {currentTutorialStep.content}
            </div>
            
            {currentTutorialStep.action && (
              <div className="flex items-start gap-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-blue-300 text-sm">
                  <strong>Try it:</strong> {currentTutorialStep.action}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {isLastStep ? (
              <Button
                onClick={handleSkip}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-1" />
                Get Started
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleNext}
                className="text-gray-400 hover:text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialOverlay;
