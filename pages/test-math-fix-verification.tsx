import React, { useState } from 'react';
import { VisualScriptingInterpreter } from '@/lib/visualScriptingInterpreter';

const TestMathFixVerificationPage: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const testStringConcatenationFix = async () => {
    setIsRunning(true);
    
    try {
      // Test case that specifically reproduces the string concatenation bug
      // This creates a scenario where values might be stored as strings
      const nodes = [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'var-num1',
          type: 'variable-set',
          data: {
            label: 'Set num1 = 2',
            variableName: 'num1',
            variableValue: 2  // This might be stored as string in some cases
          }
        },
        {
          id: 'var-num2',
          type: 'variable-set',
          data: {
            label: 'Set num2 = 3',
            variableName: 'num2',
            variableValue: 3  // This might be stored as string in some cases
          }
        },
        {
          id: 'math-add',
          type: 'math-operation',
          data: {
            label: 'Add num1 + num2',
            operation: 'add',
            leftValue: 0,  // Will be overridden by data flow
            rightValue: 0  // Will be overridden by data flow
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ];

      const connections = [
        { source: 'start', sourceHandle: 'exec-out', target: 'var-num1', targetHandle: 'exec-in' },
        { source: 'var-num1', sourceHandle: 'exec-out', target: 'var-num2', targetHandle: 'exec-in' },
        { source: 'var-num2', sourceHandle: 'exec-out', target: 'math-add', targetHandle: 'exec-in' },
        { source: 'math-add', sourceHandle: 'exec-out', target: 'end', targetHandle: 'exec-in' },
        
        // Critical data flow connections that were causing the bug
        { source: 'var-num1', sourceHandle: 'value-out', target: 'math-add', targetHandle: 'left-in' },
        { source: 'var-num2', sourceHandle: 'value-out', target: 'math-add', targetHandle: 'right-in' }
      ];

      const interpreter = new VisualScriptingInterpreter(nodes, connections, []);
      const steps = interpreter.execute();
      
      // Find the math operation step
      const mathStep = steps.find(step => step.metadata?.mathOperation);
      
      let resultText = '🧪 String Concatenation Bug Fix Verification\n\n';
      
      if (mathStep) {
        const {
          leftValue,
          rightValue,
          result,
          originalLeftValue,
          originalRightValue
        } = mathStep.metadata;
        
        resultText += `Test: ${originalLeftValue} + ${originalRightValue}\n`;
        resultText += `Expected Result: 5 (numeric addition)\n`;
        resultText += `Actual Result: ${result}\n`;
        resultText += `Result Type: ${typeof result}\n\n`;
        
        // Check if type conversion occurred
        if (originalLeftValue !== undefined && originalRightValue !== undefined) {
          resultText += `Original Values:\n`;
          resultText += `  Left: ${originalLeftValue} (type: ${typeof originalLeftValue})\n`;
          resultText += `  Right: ${originalRightValue} (type: ${typeof originalRightValue})\n\n`;
          
          resultText += `Converted Values:\n`;
          resultText += `  Left: ${leftValue} (type: ${typeof leftValue})\n`;
          resultText += `  Right: ${rightValue} (type: ${typeof rightValue})\n\n`;
        }
        
        // Determine test result
        const isCorrect = result === 5 && typeof result === 'number';
        resultText += `Test Status: ${isCorrect ? '✅ PASS' : '❌ FAIL'}\n`;
        
        if (isCorrect) {
          resultText += `✅ Bug Fixed: Addition correctly performs numeric addition (5) instead of string concatenation ("23")\n`;
        } else {
          resultText += `❌ Bug Still Present: Addition result is ${result} (${typeof result})\n`;
          if (result === "23" || result === 23) {
            resultText += `   This suggests string concatenation occurred instead of numeric addition\n`;
          }
        }
        
        resultText += `\nStep Description: ${mathStep.description}\n`;
        
      } else {
        resultText += '❌ No math operation step found in execution\n';
      }
      
      setResult(resultText);
      
    } catch (error) {
      setResult(`❌ Error during test: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Math Operation Bug Fix Verification</h1>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">🐛 Bug Description</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Critical Issue:</strong> Math operation nodes were performing string concatenation instead of numeric addition when values were passed through data flow connections.</p>
          <p><strong>Example:</strong> When two variables containing numbers 2 and 3 were connected to a math operation node set to &quot;add&quot;, the result was &quot;23&quot; (string concatenation) instead of 5 (numeric addition).</p>
          <p><strong>Root Cause:</strong> Values from data flow connections were not being converted to numbers before performing mathematical operations.</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">🔧 Fix Applied</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Solution:</strong> Added explicit type conversion using Number() for both operands before performing mathematical operations.</p>
          <p><strong>Implementation:</strong> Modified the executeMathOperation method in visualScriptingInterpreter.ts to convert leftVal and rightVal to numbers.</p>
          <p><strong>Validation:</strong> Added NaN checking to warn about invalid numeric conversions.</p>
          <p><strong>Debugging:</strong> Enhanced step metadata to show both original and converted values for troubleshooting.</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Run Verification Test</h2>
        <p className="text-sm text-gray-600 mb-4">
          This test creates a scenario that specifically reproduces the string concatenation bug.
          It sets up two variables with numeric values and connects them to a math operation node via data flow.
        </p>
        
        <button
          onClick={testStringConcatenationFix}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isRunning ? 'Running Verification...' : 'Verify Bug Fix'}
        </button>
      </div>

      {result && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>File Modified:</strong> lib/visualScriptingInterpreter.ts
          </div>
          <div>
            <strong>Method:</strong> executeMathOperation()
          </div>
          <div>
            <strong>Change:</strong> Added Number() conversion for leftVal and rightVal before arithmetic operations
          </div>
          <div>
            <strong>Impact:</strong> Ensures all mathematical operations work with numeric values regardless of input source
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMathFixVerificationPage;
