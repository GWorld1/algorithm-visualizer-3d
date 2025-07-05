// Test the actual interpreter with the fixes
import { VisualScriptingInterpreter } from './lib/visualScriptingInterpreter.js';

// Simple nested loop test to verify the fixes
const testNodes = [
  {
    id: 'start-1',
    type: 'start',
    data: { label: 'Start' }
  },
  {
    id: 'outer-loop-1',
    type: 'for-loop',
    data: {
      label: 'Outer Loop',
      loopStart: 0,
      loopEnd: 2,
      loopVariable: 'i'
    }
  },
  {
    id: 'inner-loop-1',
    type: 'for-loop',
    data: {
      label: 'Inner Loop',
      loopStart: 0,
      loopEnd: 2,
      loopVariable: 'j'
    }
  },
  {
    id: 'swap-1',
    type: 'array-swap',
    data: {
      label: 'Test Swap',
      arrayIndex1: 0,
      arrayIndex2: 1
    }
  },
  {
    id: 'end-1',
    type: 'end',
    data: { label: 'End' }
  }
];

const testConnections = [
  // Execution flow
  { source: 'start-1', sourceHandle: 'exec-out', target: 'outer-loop-1', targetHandle: 'exec-in' },
  { source: 'outer-loop-1', sourceHandle: 'exec-out', target: 'inner-loop-1', targetHandle: 'exec-in' },
  { source: 'inner-loop-1', sourceHandle: 'exec-out', target: 'swap-1', targetHandle: 'exec-in' },
  { source: 'outer-loop-1', sourceHandle: 'exec-complete', target: 'end-1', targetHandle: 'exec-in' },
  
  // Data flow for dynamic swap indices
  { source: 'outer-loop-1', sourceHandle: 'index-out', target: 'swap-1', targetHandle: 'index1-in' },
  { source: 'inner-loop-1', sourceHandle: 'index-out', target: 'swap-1', targetHandle: 'index2-in' }
];

const testArray = [5, 3, 8, 1];

console.log('Testing interpreter with fixes...');
console.log('Input array:', testArray);

try {
  const interpreter = new VisualScriptingInterpreter(testNodes, testConnections, testArray);
  const steps = interpreter.execute();
  
  console.log('\n=== Execution Steps ===');
  steps.forEach((step, index) => {
    console.log(`Step ${index + 1}: ${step.description}`);
    if (step.metadata) {
      if (step.metadata.loopIteration) {
        console.log(`  → Loop: ${step.metadata.loopVariable} = ${step.metadata.loopValue}`);
      }
      if (step.metadata.hasDataFlow) {
        console.log(`  → Uses data flow connections`);
      }
      if (step.metadata.indices) {
        console.log(`  → Indices: [${step.metadata.indices.join(', ')}]`);
      }
    }
  });
  
  console.log('\n✅ Test completed successfully!');
  console.log('Total steps:', steps.length);
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}
