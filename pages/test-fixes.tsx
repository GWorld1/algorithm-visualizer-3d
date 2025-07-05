import React, { useEffect, useState } from 'react';
import { VisualScriptingInterpreter } from '@/lib/visualScriptingInterpreter';

interface TestResult {
  success: boolean;
  message: string;
  steps?: any[];
  error?: string;
}

const TestFixesPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Dynamic Swap Node Data Flow
    try {
      const nodes = [
        { id: 'start-1', type: 'start', data: { label: 'Start' } },
        { id: 'loop-1', type: 'for-loop', data: { loopStart: 0, loopEnd: 2, loopVariable: 'i' } },
        { id: 'swap-1', type: 'array-swap', data: { arrayIndex1: 0, arrayIndex2: 1 } },
        { id: 'end-1', type: 'end', data: { label: 'End' } }
      ];

      const connections = [
        { source: 'start-1', sourceHandle: 'exec-out', target: 'loop-1', targetHandle: 'exec-in' },
        { source: 'loop-1', sourceHandle: 'exec-out', target: 'swap-1', targetHandle: 'exec-in' },
        { source: 'loop-1', sourceHandle: 'exec-complete', target: 'end-1', targetHandle: 'exec-in' },
        // Data flow connection for dynamic index
        { source: 'loop-1', sourceHandle: 'index-out', target: 'swap-1', targetHandle: 'index1-in' }
      ];

      const interpreter = new VisualScriptingInterpreter(nodes, connections, [5, 3, 8, 1]);
      const steps = interpreter.execute();
      
      // Check if swap operations used data flow
      const swapSteps = steps.filter(step => step.action === 'swap');
      const hasDataFlowSwap = swapSteps.some(step => step.metadata?.hasDataFlow);
      
      results.push({
        success: hasDataFlowSwap,
        message: hasDataFlowSwap 
          ? '✅ Dynamic swap node data flow working correctly'
          : '❌ Dynamic swap node data flow not working',
        steps: steps
      });
    } catch (error) {
      results.push({
        success: false,
        message: '❌ Dynamic swap test failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 2: Nested Loop Execution Flow
    try {
      const nodes = [
        { id: 'start-1', type: 'start', data: { label: 'Start' } },
        { id: 'outer-1', type: 'for-loop', data: { loopStart: 0, loopEnd: 2, loopVariable: 'i' } },
        { id: 'inner-1', type: 'for-loop', data: { loopStart: 0, loopEnd: 2, loopVariable: 'j' } },
        { id: 'access-1', type: 'array-access', data: { arrayIndex1: 0 } },
        { id: 'end-1', type: 'end', data: { label: 'End' } }
      ];

      const connections = [
        { source: 'start-1', sourceHandle: 'exec-out', target: 'outer-1', targetHandle: 'exec-in' },
        { source: 'outer-1', sourceHandle: 'exec-out', target: 'inner-1', targetHandle: 'exec-in' },
        { source: 'inner-1', sourceHandle: 'exec-out', target: 'access-1', targetHandle: 'exec-in' },
        { source: 'outer-1', sourceHandle: 'exec-complete', target: 'end-1', targetHandle: 'exec-in' }
      ];

      const interpreter = new VisualScriptingInterpreter(nodes, connections, [1, 2, 3, 4]);
      const steps = interpreter.execute();
      
      // Check for proper nested loop execution
      const outerLoopSteps = steps.filter(step => 
        step.metadata?.loopVariable === 'i' && step.metadata?.loopIteration
      );
      const innerLoopSteps = steps.filter(step => 
        step.metadata?.loopVariable === 'j' && step.metadata?.loopIteration
      );
      
      const hasNestedExecution = outerLoopSteps.length >= 2 && innerLoopSteps.length >= 4;
      
      results.push({
        success: hasNestedExecution,
        message: hasNestedExecution
          ? '✅ Nested loop execution flow working correctly'
          : '❌ Nested loop execution flow not working properly',
        steps: steps
      });
    } catch (error) {
      results.push({
        success: false,
        message: '❌ Nested loop test failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Visual Script Editor Fixes Test</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className="font-semibold mb-2">{result.message}</h3>
            
            {result.error && (
              <div className="text-red-600 text-sm mb-2">
                Error: {result.error}
              </div>
            )}
            
            {result.steps && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">
                  View Execution Steps ({result.steps.length} steps)
                </summary>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {result.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="text-xs p-2 border-b">
                      <div className="font-mono">{step.description}</div>
                      {step.metadata && (
                        <div className="text-gray-500 mt-1">
                          {step.metadata.loopVariable && (
                            <span>Loop: {step.metadata.loopVariable}={step.metadata.loopValue} </span>
                          )}
                          {step.metadata.hasDataFlow && <span>DataFlow </span>}
                          {step.metadata.indices && (
                            <span>Indices: [{step.metadata.indices.join(', ')}]</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Test Summary</h2>
        <p className="text-sm text-gray-600">
          These tests verify that the Visual Script Editor fixes are working correctly:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
          <li>Dynamic data flow connections for swap and compare nodes</li>
          <li>Proper nested loop execution flow with return-to-outer-loop behavior</li>
        </ul>
      </div>
    </div>
  );
};

export default TestFixesPage;
