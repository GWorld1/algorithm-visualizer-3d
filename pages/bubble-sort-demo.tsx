import React, { useState, useEffect } from 'react';
import { VisualScriptingInterpreter } from '@/lib/visualScriptingInterpreter';
import { createBubbleSortTemplate } from '@/lib/bubbleSortTemplate';

const BubbleSortDemo: React.FC = () => {
  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22]);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const runBubbleSort = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    try {
      // Create bubble sort template for the input array
      const template = createBubbleSortTemplate(inputArray.length);
      
      // Execute the bubble sort algorithm
      const interpreter = new VisualScriptingInterpreter(
        template.nodes,
        template.connections,
        [...inputArray]
      );
      
      const steps = interpreter.execute();
      setExecutionSteps(steps);
      
      console.log('Bubble Sort Execution Steps:', steps);
      
    } catch (error) {
      console.error('Bubble sort execution failed:', error);
      setExecutionSteps([]);
    }
    
    setIsRunning(false);
  };

  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...inputArray];
    newArray[index] = parseInt(value) || 0;
    setInputArray(newArray);
  };

  const addElement = () => {
    setInputArray([...inputArray, Math.floor(Math.random() * 100)]);
  };

  const removeElement = (index: number) => {
    setInputArray(inputArray.filter((_, i) => i !== index));
  };

  const resetArray = () => {
    setInputArray([64, 34, 25, 12, 22]);
    setExecutionSteps([]);
    setCurrentStep(0);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Bubble Sort with Dynamic Inner Loop Demo</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">🎯 Key Enhancement</h2>
        <p className="text-sm text-gray-700">
          This demo showcases the new <strong>dynamic loop end conditions</strong> feature. 
          The inner loop now correctly calculates its end condition as <code>n - i - 1</code> 
          for each outer loop iteration, making bubble sort more efficient by reducing 
          unnecessary comparisons.
        </p>
      </div>

      {/* Array Input Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Input Array</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {inputArray.map((value, index) => (
            <div key={index} className="flex items-center gap-1">
              <input
                type="number"
                value={value}
                onChange={(e) => handleArrayChange(index, e.target.value)}
                className="w-16 px-2 py-1 border rounded text-center"
                min="0"
                max="999"
              />
              <button
                onClick={() => removeElement(index)}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={inputArray.length <= 2}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={addElement}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            disabled={inputArray.length >= 10}
          >
            Add Element
          </button>
          <button
            onClick={resetArray}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Execution Controls */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Execution</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={runBubbleSort}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Bubble Sort'}
          </button>
          
          {executionSteps.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {executionSteps.length}
              </span>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm disabled:opacity-50"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(executionSteps.length - 1, currentStep + 1))}
                disabled={currentStep === executionSteps.length - 1}
                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Execution Steps Display */}
      {executionSteps.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Execution Steps</h2>
          
          {/* Current Step Highlight */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <h3 className="font-semibold">Current Step:</h3>
            <p className="text-sm">{executionSteps[currentStep]?.description}</p>
            {executionSteps[currentStep]?.metadata && (
              <div className="text-xs text-gray-600 mt-1">
                {executionSteps[currentStep].metadata.loopIteration && (
                  <span className="mr-4">
                    Loop: {executionSteps[currentStep].metadata.loopVariable} = {executionSteps[currentStep].metadata.loopValue}
                  </span>
                )}
                {executionSteps[currentStep].metadata.hasDynamicBounds && (
                  <span className="bg-green-100 text-green-800 px-1 rounded text-xs">Dynamic Bounds</span>
                )}
                {executionSteps[currentStep].metadata.mathOperation && (
                  <span className="bg-blue-100 text-blue-800 px-1 rounded text-xs">Math Operation</span>
                )}
              </div>
            )}
          </div>

          {/* All Steps Summary */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              View All Steps ({executionSteps.length} total)
            </summary>
            <div className="mt-2 max-h-64 overflow-y-auto border rounded p-2">
              {executionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 border-b cursor-pointer ${
                    index === currentStep ? 'bg-yellow-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="font-mono">{step.description}</div>
                  {step.metadata && (
                    <div className="text-gray-500 mt-1">
                      {step.metadata.loopVariable && (
                        <span className="mr-2">
                          {step.metadata.loopVariable}={step.metadata.loopValue}
                        </span>
                      )}
                      {step.metadata.hasDynamicBounds && <span className="text-green-600">Dynamic </span>}
                      {step.metadata.mathOperation && <span className="text-blue-600">Math </span>}
                      {step.metadata.hasDataFlow && <span className="text-purple-600">DataFlow </span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How Dynamic Loop Bounds Work</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Traditional Bubble Sort:</strong> Inner loop runs from 0 to n-1 every time, 
            doing unnecessary comparisons on already-sorted elements.
          </p>
          <p>
            <strong>Optimized Bubble Sort:</strong> Inner loop dynamically calculates its end 
            condition as <code>n - i - 1</code>, where:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>n</code> = array length</li>
            <li><code>i</code> = current outer loop iteration</li>
            <li>Each pass places one element in its final position</li>
            <li>Subsequent passes can ignore the sorted portion</li>
          </ul>
          <p>
            <strong>Result:</strong> Fewer comparisons, better performance, and proper algorithmic implementation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortDemo;
