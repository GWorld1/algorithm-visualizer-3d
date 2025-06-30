// Test script for Linear Search Algorithm implementation
// Tests the enhanced if-condition and variable-set nodes

const testLinearSearchAlgorithm = () => {
  console.log('🔍 Testing Linear Search Algorithm Implementation');
  console.log('===============================================');
  
  // Create nodes for Linear Search algorithm
  const linearSearchNodes = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start' }
    },
    {
      id: 'init-found-1',
      type: 'variable-set',
      position: { x: 250, y: 200 },
      data: { 
        label: 'Initialize Found Index',
        variableName: 'foundIndex',
        variableValue: -1  // -1 means not found
      }
    },
    {
      id: 'init-target-1',
      type: 'variable-set',
      position: { x: 400, y: 200 },
      data: { 
        label: 'Set Search Target',
        variableName: 'searchTarget',
        variableValue: 30  // Looking for value 30
      }
    },
    {
      id: 'loop-1',
      type: 'for-loop',
      position: { x: 550, y: 200 },
      data: { 
        label: 'For Loop',
        loopStart: 0,
        loopEnd: 5,  // Array length
        loopVariable: 'i'
      }
    },
    {
      id: 'array-access-1',
      type: 'array-access',
      position: { x: 700, y: 200 },
      data: { 
        label: 'Get Current Element',
        arrayIndex1: 0  // Will be overridden by loop index
      }
    },
    {
      id: 'if-condition-1',
      type: 'if-condition',
      position: { x: 850, y: 200 },
      data: { 
        label: 'Check if Found',
        comparisonOperator: '==',
        leftValue: 0,   // Current element (from array access)
        rightValue: 0   // Search target (from variable)
      }
    },
    {
      id: 'set-found-1',
      type: 'variable-set',
      position: { x: 1000, y: 150 },
      data: { 
        label: 'Set Found Index',
        variableName: 'foundIndex',
        variableValue: 0  // Will be set to current loop index
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 1150, y: 200 },
      data: { label: 'End' }
    }
  ];

  // Create connections for Linear Search
  const linearSearchConnections = [
    // Execution flow
    {
      id: 'conn-1',
      source: 'start-1',
      sourceHandle: 'exec-out',
      target: 'init-found-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-2',
      source: 'init-found-1',
      sourceHandle: 'exec-out',
      target: 'init-target-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-3',
      source: 'init-target-1',
      sourceHandle: 'exec-out',
      target: 'loop-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-4',
      source: 'loop-1',
      sourceHandle: 'exec-out',
      target: 'array-access-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-5',
      source: 'array-access-1',
      sourceHandle: 'exec-out',
      target: 'if-condition-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-6',
      source: 'if-condition-1',
      sourceHandle: 'exec-true',
      target: 'set-found-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-7',
      source: 'loop-1',
      sourceHandle: 'exec-complete',
      target: 'end-1',
      targetHandle: 'exec-in'
    },
    
    // Data flow connections
    {
      id: 'conn-8',
      source: 'loop-1',
      sourceHandle: 'index-out',
      target: 'array-access-1',
      targetHandle: 'index-in'
    },
    {
      id: 'conn-9',
      source: 'array-access-1',
      sourceHandle: 'value-out',
      target: 'if-condition-1',
      targetHandle: 'left-in'
    },
    {
      id: 'conn-10',
      source: 'init-target-1',
      sourceHandle: 'value-out',
      target: 'if-condition-1',
      targetHandle: 'right-in'
    },
    {
      id: 'conn-11',
      source: 'loop-1',
      sourceHandle: 'index-out',
      target: 'set-found-1',
      targetHandle: 'value-in'
    }
  ];

  // Test array: [10, 20, 30, 40, 50] - searching for 30 (should find at index 2)
  const testArray = [10, 20, 30, 40, 50];

  console.log('✅ Created Linear Search Algorithm:');
  console.log(`   - Array: [${testArray.join(', ')}]`);
  console.log(`   - Search Target: 30`);
  console.log(`   - Expected: Found at index 2`);
  console.log('');

  console.log('🔧 Algorithm Flow:');
  console.log('1. Initialize foundIndex = -1');
  console.log('2. Set searchTarget = 30');
  console.log('3. For i = 0 to 4:');
  console.log('   a. Get currentElement = array[i]');
  console.log('   b. If currentElement == searchTarget:');
  console.log('      - Set foundIndex = i');
  console.log('      - (Continue loop to completion)');
  console.log('4. End with foundIndex containing result');
  console.log('');

  console.log('🎯 Expected Animation Steps:');
  const expectedSteps = [
    'Starting algorithm execution',
    'Set foundIndex = -1 (static value)',
    'Set searchTarget = 30 (static value)',
    'Starting loop: i = 0 to 5',
    'Loop iteration 0: i = 0',
    'Accessed array[0] = 10 (Loop iteration 0: i = 0)',
    'Compare: 10 == 30 = false (Loop iteration 0: i = 0)',
    'Completed loop body for i = 0',
    'Loop iteration 1: i = 1',
    'Accessed array[1] = 20 (Loop iteration 1: i = 1)',
    'Compare: 20 == 30 = false (Loop iteration 1: i = 1)',
    'Completed loop body for i = 1',
    'Loop iteration 2: i = 2',
    'Accessed array[2] = 30 (Loop iteration 2: i = 2)',
    'Compare: 30 == 30 = true (Loop iteration 2: i = 2)',
    'Set foundIndex = 2 (from data flow) (Loop iteration 2: i = 2)',
    'Completed loop body for i = 2',
    'Loop iteration 3: i = 3',
    'Accessed array[3] = 40 (Loop iteration 3: i = 3)',
    'Compare: 40 == 30 = false (Loop iteration 3: i = 3)',
    'Completed loop body for i = 3',
    'Loop iteration 4: i = 4',
    'Accessed array[4] = 50 (Loop iteration 4: i = 4)',
    'Compare: 50 == 30 = false (Loop iteration 4: i = 4)',
    'Completed loop body for i = 4',
    'Loop completed: processed 5 iterations',
    'Algorithm execution completed'
  ];

  console.log(`Expected total steps: ${expectedSteps.length}`);
  expectedSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step}`);
  });
  console.log('');

  console.log('🧪 Key Enhancements Tested:');
  console.log('✅ If-Condition Node:');
  console.log('  - Dynamic value comparison from data flow');
  console.log('  - Left value from array-access, right value from variable-set');
  console.log('  - Proper == operator comparison');
  console.log('  - Loop context in animation steps');
  console.log('');
  console.log('✅ Variable-Set Node:');
  console.log('  - Dynamic value setting from data flow (loop index)');
  console.log('  - Static value setting (initialization)');
  console.log('  - Loop context in animation steps');
  console.log('  - Value output for chaining');
  console.log('');

  console.log('🔍 Testing Instructions:');
  console.log('1. Create the node structure above in Visual Scripting Editor');
  console.log('2. Set array to [10, 20, 30, 40, 50]');
  console.log('3. Execute the algorithm');
  console.log('4. Verify ~26 animation steps are generated');
  console.log('5. Check that foundIndex variable is set to 2');
  console.log('6. Verify each comparison is shown in animation');

  return {
    nodes: linearSearchNodes,
    connections: linearSearchConnections,
    testArray: testArray,
    expectedSteps: expectedSteps,
    algorithmType: 'LINEAR_SEARCH',
    status: 'ENHANCED_NODES_IMPLEMENTED'
  };
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testLinearSearchAlgorithm };
} else {
  testLinearSearchAlgorithm();
}
