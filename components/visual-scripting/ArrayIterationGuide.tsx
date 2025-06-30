"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  RotateCw, 
  Database, 
  Square,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface ArrayIterationGuideProps {
  onClose: () => void;
  onCreateExample: () => void;
}

const ArrayIterationGuide: React.FC<ArrayIterationGuideProps> = ({ onClose, onCreateExample }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Understanding Node Types",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Visual scripting uses two types of connections:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-900/20 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-sm flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Execution Flow (Green)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                <p>Controls the order of operations</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• One connection per handle</li>
                  <li>• Determines what happens next</li>
                  <li>• Like arrows in a flowchart</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Data Flow (Blue)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                <p>Passes values between nodes</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Multiple connections allowed</li>
                  <li>• Carries numbers, arrays, etc.</li>
                  <li>• Like variables in programming</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Array Iteration Pattern",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">To iterate through an array, you need these nodes:</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <Play className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium text-white">Start Node</div>
                <div className="text-sm text-gray-400">Beginning of your algorithm</div>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-500 mx-auto" />

            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <RotateCw className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium text-white">For Loop Node</div>
                <div className="text-sm text-gray-400">Repeats for each array element</div>
                <div className="text-xs text-blue-400 mt-1">Outputs: Current Index (blue)</div>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-500 mx-auto" />

            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <Database className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-medium text-white">Array Access Node</div>
                <div className="text-sm text-gray-400">Gets value at specific index</div>
                <div className="text-xs text-blue-400 mt-1">Inputs: Array, Index (blue)</div>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-500 mx-auto" />

            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <Square className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium text-white">End Node</div>
                <div className="text-sm text-gray-400">Marks completion</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 1: Create Execution Flow",
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Green Connections (Execution Flow)
            </h4>
            <p className="text-gray-300 text-sm mb-3">Connect these in order:</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-400 border-green-500">1</Badge>
                <span className="text-gray-300">Start → For Loop (Previous input)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-400 border-green-500">2</Badge>
                <span className="text-gray-300">For Loop (Loop Body) → Array Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-400 border-green-500">3</Badge>
                <span className="text-gray-300">For Loop (Complete) → End</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <strong>Tip:</strong> The loop body executes repeatedly, while &quot;Complete&quot; runs only once when the loop finishes.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: Connect Data Flow",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Blue Connections (Data Flow)
            </h4>
            <p className="text-gray-300 text-sm mb-3">Connect the loop index to array access:</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-400 border-blue-500">1</Badge>
                <span className="text-gray-300">For Loop (Current Index) → Array Access (Index input)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-400 border-blue-500">2</Badge>
                <span className="text-gray-300">For Loop (Array) → Array Access (Array input) <em className="text-gray-500">(optional)</em></span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <strong>Key Insight:</strong> The loop&apos;s &quot;Current Index&quot; output provides 0, 1, 2, 3... which the Array Access node uses to get array[0], array[1], array[2], etc.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Configure Loop Settings",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Set up your For Loop node:</p>
          
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Start</label>
                <div className="bg-gray-700 rounded px-3 py-2 text-white">0</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">End</label>
                <div className="bg-gray-700 rounded px-3 py-2 text-white">array.length</div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Variable</label>
              <div className="bg-gray-700 rounded px-3 py-2 text-white">i</div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <strong>Important:</strong> Set &quot;End&quot; to match your array length. For a 5-element array, use End = 5.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Complete Example",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Your completed array iteration should look like this:</p>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4 text-green-400" />
                  <span className="text-white">Start</span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-400" />
                <div className="flex items-center gap-1">
                  <RotateCw className="w-4 h-4 text-green-400" />
                  <span className="text-white">For Loop</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <div className="text-transparent">spacer</div>
                <ArrowRight className="w-4 h-4 text-green-400" />
                <div className="flex items-center gap-1">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-white">Array Access</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <div className="text-blue-400 text-xs">index data →</div>
                <div className="text-transparent">→</div>
                <div className="text-blue-400 text-xs">← connects here</div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4 text-green-400" />
                  <span className="text-white">End</span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-400 rotate-180" />
                <div className="text-green-400 text-xs">← Complete</div>
              </div>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <div className="text-sm text-green-200">
                <strong>Result:</strong> This will iterate through each array element, accessing array[0], array[1], array[2], etc.
              </div>
            </div>
          </div>

          <Button 
            onClick={onCreateExample}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Create This Example For Me
          </Button>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Array Iteration Guide</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 
                  index < currentStep ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-400 ml-2">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {steps[currentStep].title}
          </h3>
          {steps[currentStep].content}
        </CardContent>
        
        <div className="flex justify-between p-6 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ArrayIterationGuide;
