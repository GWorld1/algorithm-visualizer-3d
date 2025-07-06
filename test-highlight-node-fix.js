// Test script to validate the array-highlight node data flow fix
// This script tests the highlight element node with dynamic index values

import { VisualScriptingInterpreter } from './lib/visualScriptingInterpreter.js';

console.log('🧪 Testing Array Highlight Node Data Flow Fix\n');

// Test Case 1: Static index (should work as before)
console.log('📋 Test Case 1: Static Index Highlighting');
const staticTest = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start' }
    },
    {
      id: 'highlight-1',
      type: 'array-highlight',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Highlight Index 2',
        arrayIndex1: 2,
        highlightColor: 'yellow'
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 500, y: 200 },
      data: { label: 'End' }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'start-1', sourceHandle: 'exec-out', target: 'highlight-1', targetHandle: 'exec-in' },
    { id: 'conn-2', source: 'highlight-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
  ]
};

// Test Case 2: Dynamic index from for-loop (the main fix)
console.log('📋 Test Case 2: Dynamic Index from For-Loop');
const dynamicTest = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start' }
    },
    {
      id: 'loop-1',
      type: 'for-loop',
      position: { x: 300, y: 200 },
      data: { 
        label: 'For i = 0 to 2',
        loopStart: 0,
        loopEnd: 3,
        loopVariable: 'i'
      }
    },
    {
      id: 'highlight-1',
      type: 'array-highlight',
      position: { x: 500, y: 200 },
      data: { 
        label: 'Highlight Current Index',
        highlightColor: 'cyan'
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 700, y: 200 },
      data: { label: 'End' }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'start-1', sourceHandle: 'exec-out', target: 'loop-1', targetHandle: 'exec-in' },
    { id: 'conn-2', source: 'loop-1', sourceHandle: 'exec-out', target: 'highlight-1', targetHandle: 'exec-in' },
    { id: 'conn-3', source: 'highlight-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' },
    // This is the key data flow connection that should now work
    { id: 'conn-4', source: 'loop-1', sourceHandle: 'index-out', target: 'highlight-1', targetHandle: 'index-in' }
  ]
};

// Test Case 3: Invalid index handling
console.log('📋 Test Case 3: Invalid Index Handling');
const invalidIndexTest = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start' }
    },
    {
      id: 'highlight-1',
      type: 'array-highlight',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Highlight Invalid Index',
        arrayIndex1: 10, // Out of bounds for typical test array
        highlightColor: 'red'
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 500, y: 200 },
      data: { label: 'End' }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'start-1', sourceHandle: 'exec-out', target: 'highlight-1', targetHandle: 'exec-in' },
    { id: 'conn-2', source: 'highlight-1', sourceHandle: 'exec-out', target: 'end-1', targetHandle: 'exec-in' }
  ]
};

// Test array for all tests
const testArray = [10, 20, 30, 40, 50];

// Function to run a test case
function runTest(testName, testCase, expectedResults) {
  console.log(`\n🔍 Running ${testName}...`);
  
  try {
    const interpreter = new VisualScriptingInterpreter(testCase.nodes, testCase.connections, testArray);
    const steps = interpreter.execute();
    
    console.log(`✅ Test completed successfully`);
    console.log(`   - Generated ${steps.length} steps`);
    
    // Check for highlight steps
    const highlightSteps = steps.filter(step => step.action === 'highlight');
    console.log(`   - Found ${highlightSteps.length} highlight step(s)`);
    
    highlightSteps.forEach((step, index) => {
      console.log(`   - Highlight ${index + 1}: indices [${step.highlightedElements.join(', ')}], color: ${step.metadata?.color || 'default'}`);
    });
    
    // Check for error steps
    const errorSteps = steps.filter(step => step.metadata?.error);
    if (errorSteps.length > 0) {
      console.log(`   - Found ${errorSteps.length} error step(s)`);
      errorSteps.forEach((step, index) => {
        console.log(`   - Error ${index + 1}: ${step.description}`);
      });
    }
    
    return { success: true, steps, highlightSteps, errorSteps };
    
  } catch (error) {
    console.log(`❌ Test failed with error: ${error.message}`);
    return { success: false, error };
  }
}

// Run all test cases
console.log(`\n🎯 Test Array: [${testArray.join(', ')}]\n`);

const test1Results = runTest('Static Index Test', staticTest);
const test2Results = runTest('Dynamic Index Test', dynamicTest);
const test3Results = runTest('Invalid Index Test', invalidIndexTest);

// Summary
console.log('\n📊 Test Summary:');
console.log('================');

if (test1Results.success) {
  console.log('✅ Static Index Test: PASSED');
} else {
  console.log('❌ Static Index Test: FAILED');
}

if (test2Results.success) {
  console.log('✅ Dynamic Index Test: PASSED');
  if (test2Results.highlightSteps.length > 1) {
    console.log('   🎉 Multiple highlights detected - data flow working!');
  }
} else {
  console.log('❌ Dynamic Index Test: FAILED');
}

if (test3Results.success) {
  console.log('✅ Invalid Index Test: PASSED');
  if (test3Results.errorSteps.length > 0) {
    console.log('   🛡️ Error handling working correctly');
  }
} else {
  console.log('❌ Invalid Index Test: FAILED');
}

console.log('\n🏁 Testing Complete!');

// Export for potential use in other test files
export { runTest, testArray };
