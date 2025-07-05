import React, { useState } from 'react';
import { VisualScriptingInterpreter } from '@/lib/visualScriptingInterpreter';

const TestMathNodePage: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const testMathNode = async () => {
    setIsRunning(true);
    
    try {
      // Create a simple test with math operations
      const nodes = [
        {
          id: 'start-1',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'var-a',
          type: 'variable-set',
          data: {
            label: 'Set A = 10',
            variableName: 'a',
            variableValue: 10
          }
        },
        {
          id: 'var-b',
          type: 'variable-set',
          data: {
            label: 'Set B = 3',
            variableName: 'b',
            variableValue: 3
          }
        },
        {
          id: 'math-add',
          type: 'math-operation',
          data: {
            label: 'A + B',
            operation: 'add',
            leftValue: 10,
            rightValue: 3
          }
        },
        {
          id: 'math-subtract',
          type: 'math-operation',
          data: {
            label: 'A - B',
            operation: 'subtract',
            leftValue: 10,
            rightValue: 3
          }
        },
        {
          id: 'math-multiply',
          type: 'math-operation',
          data: {
            label: 'A × B',
            operation: 'multiply',
            leftValue: 10,
            rightValue: 3
          }
        },
        {
          id: 'math-divide',
          type: 'math-operation',
          data: {
            label: 'A ÷ B',
            operation: 'divide',
            leftValue: 10,
            rightValue: 3
          }
        },
        {
          id: 'end-1',
          type: 'end',
          data: { label: 'End' }
        }
      ];

      const connections = [
        { source: 'start-1', sourceHandle: 'exec-out', target: 'var-a', targetHandle: 'exec-in' },
        { source: 'var-a', sourceHandle: 'exec-out', target: 'var-b', targetHandle: 'exec-in' },
        { source: 'var-b', sourceHandle: 'exec-out', target: 'math-add', targetHandle: 'exec-in' },
        { source: 'math-add', sourceHandle: 'exec-out', target: 'math-subtract', targetHandle: 'exec-in' },
        { source: 'math-subtract', sourceHandle: 'exec-out', target: 'math-multiply', targetHandle: 'exec-in' },
        { source: 'math-multiply', sourceHandle: 'exec-out', target: 'math-divide', targetHandle: 'exec-in' },
        { source: 'math-divide', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' },
        
        // Data flow connections
        { source: 'var-a', sourceHandle: 'value-out', target: 'math-add', targetHandle: 'left-in' },
        { source: 'var-b', sourceHandle: 'value-out', target: 'math-add', targetHandle: 'right-in' },
        { source: 'var-a', sourceHandle: 'value-out', target: 'math-subtract', targetHandle: 'left-in' },
        { source: 'var-b', sourceHandle: 'value-out', target: 'math-subtract', targetHandle: 'right-in' },
        { source: 'var-a', sourceHandle: 'value-out', target: 'math-multiply', targetHandle: 'left-in' },
        { source: 'var-b', sourceHandle: 'value-out', target: 'math-multiply', targetHandle: 'right-in' },
        { source: 'var-a', sourceHandle: 'value-out', target: 'math-divide', targetHandle: 'left-in' },
        { source: 'var-b', sourceHandle: 'value-out', target: 'math-divide', targetHandle: 'right-in' }
      ];

      const interpreter = new VisualScriptingInterpreter(nodes, connections, [1, 2, 3]);
      const steps = interpreter.execute();
      
      // Extract math operation results
      const mathSteps = steps.filter(step => step.metadata?.mathOperation);
      let resultText = 'Math Operation Results:\n\n';
      
      mathSteps.forEach(step => {
        const { operation, leftValue, rightValue, result, operationSymbol } = step.metadata;
        resultText += `${operation.toUpperCase()}: ${leftValue} ${operationSymbol} ${rightValue} = ${result}\n`;
      });
      
      if (mathSteps.length === 0) {
        resultText = 'No math operations found in execution steps.';
      }
      
      setResult(resultText);
      
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Math Operation Node Test</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">🧮 Math Node UI Features</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ <strong>Operation Selector</strong>: Dropdown to choose Add, Subtract, Multiply, Divide</li>
          <li>✅ <strong>Left/Right Value Inputs</strong>: Number fields for default operand values</li>
          <li>✅ <strong>Data Flow Integration</strong>: Input values override when connections are made</li>
          <li>✅ <strong>Visual Feedback</strong>: Clear indication of data flow override behavior</li>
        </ul>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Math Operations</h2>
        <p className="text-sm text-gray-600 mb-4">
          This test creates math nodes with different operations and connects them via data flow.
          Variables A=10 and B=3 are used as inputs to demonstrate dynamic calculation.
        </p>
        
        <button
          onClick={testMathNode}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isRunning ? 'Running Test...' : 'Test Math Operations'}
        </button>
      </div>

      {result && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Use Math Operation Node</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>1. Add Math Node:</strong> Drag the "Math Operation" node from the Math Operations palette
          </div>
          <div>
            <strong>2. Configure Operation:</strong> Use the dropdown to select Add (+), Subtract (-), Multiply (×), or Divide (÷)
          </div>
          <div>
            <strong>3. Set Default Values:</strong> Enter numbers in the Left and Right input fields
          </div>
          <div>
            <strong>4. Connect Data Flow:</strong> Connect other nodes' outputs to the "Left Value" and "Right Value" inputs
          </div>
          <div>
            <strong>5. Use Result:</strong> Connect the "Result" output to other nodes that need the calculated value
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
            <strong>Note:</strong> When data flow connections are made, they override the manual input values.
            This enables dynamic calculations like "n - i - 1" for bubble sort optimization.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMathNodePage;
