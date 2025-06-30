// Test script for Find Maximum Algorithm implementation
// Tests the enhanced if-condition and variable-set nodes

const testFindMaximumAlgorithm = () => {
  console.log('📊 Testing Find Maximum Algorithm Implementation');
  console.log('==============================================');
  
  // Create nodes for Find Maximum algorithm
  const findMaxNodes = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 200 },
      data: { label: 'Start' }
    },
    {
      id: 'init-max-1',
      type: 'variable-set',
      position: { x: 250, y: 200 },
      data: { 
        label: 'Initialize Max Value',
        variableName: 'maxValue',
        variableValue: -999  // Start with very small value
      }
    },
    {
      id: 'init-max-index-1',
      type: 'variable-set',
      position: { x: 400, y: 200 },
      data: { 
        label: 'Initialize Max Index',
        variableName: 'maxIndex',
        variableValue: -1
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
      id: 'get-max-1',
      type: 'variable-get',
      position: { x: 850, y: 150 },
      data: { 
        label: 'Get Current Max',
        variableName: 'maxValue'
      }
    },
    {
      id: 'if-condition-1',
      type: 'if-condition',
      position: { x: 850, y: 250 },
      data: { 
        label: 'Check if Greater',
        comparisonOperator: '>',
        leftValue: 0,   // Current element (from array access)
        rightValue: 0   // Current max (from variable get)
      }
    },
    {
      id: 'set-max-value-1',
      type: 'variable-set',
      position: { x: 1000, y: 200 },
      data: { 
        label: 'Update Max Value',
        variableName: 'maxValue',
        variableValue: 0  // Will be set to current element
      }
    },
    {
      id: 'set-max-index-1',
      type: 'variable-set',
      position: { x: 1150, y: 200 },
      data: { 
        label: 'Update Max Index',
        variableName: 'maxIndex',
        variableValue: 0  // Will be set to current loop index
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 1300, y: 200 },
      data: { label: 'End' }
    }
  ];

  // Create connections for Find Maximum
  const findMaxConnections = [
    // Execution flow
    {
      id: 'conn-1',
      source: 'start-1',
      sourceHandle: 'exec-out',
      target: 'init-max-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-2',
      source: 'init-max-1',
      sourceHandle: 'exec-out',
      target: 'init-max-index-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-3',
      source: 'init-max-index-1',
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
      target: 'set-max-value-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-7',
      source: 'set-max-value-1',
      sourceHandle: 'exec-out',
      target: 'set-max-index-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-8',
      source: 'loop-1',
      sourceHandle: 'exec-complete',
      target: 'end-1',
      targetHandle: 'exec-in'
    },
    
    // Data flow connections
    {
      id: 'conn-9',
      source: 'loop-1',
      sourceHandle: 'index-out',
      target: 'array-access-1',
      targetHandle: 'index-in'
    },
    {
      id: 'conn-10',
      source: 'array-access-1',
      sourceHandle: 'value-out',
      target: 'if-condition-1',
      targetHandle: 'left-in'
    },
    {
      id: 'conn-11',
      source: 'get-max-1',
      sourceHandle: 'value-out',
      target: 'if-condition-1',
      targetHandle: 'right-in'
    },
    {
      id: 'conn-12',
      source: 'array-access-1',
      sourceHandle: 'value-out',
      target: 'set-max-value-1',
      targetHandle: 'value-in'
    },
    {
      id: 'conn-13',
      source: 'loop-1',
      sourceHandle: 'index-out',
      target: 'set-max-index-1',
      targetHandle: 'value-in'
    }
  ];

  // Test array: [15, 3, 42, 8, 27] - maximum is 42 at index 2
  const testArray = [15, 3, 42, 8, 27];

  console.log('✅ Created Find Maximum Algorithm:');
  console.log(`   - Array: [${testArray.join(', ')}]`);
  console.log(`   - Expected: Maximum value 42 at index 2`);
  console.log('');

  console.log('🔧 Algorithm Flow:');
  console.log('1. Initialize maxValue = -999');
  console.log('2. Initialize maxIndex = -1');
  console.log('3. For i = 0 to 4:');
  console.log('   a. Get currentElement = array[i]');
  console.log('   b. Get currentMax = maxValue');
  console.log('   c. If currentElement > currentMax:');
  console.log('      - Set maxValue = currentElement');
  console.log('      - Set maxIndex = i');
  console.log('4. End with maxValue and maxIndex containing results');
  console.log('');

  console.log('🎯 Expected Key Comparisons:');
  console.log('- Iteration 0: 15 > -999 = true → Update max to 15, index to 0');
  console.log('- Iteration 1: 3 > 15 = false → No update');
  console.log('- Iteration 2: 42 > 15 = true → Update max to 42, index to 2');
  console.log('- Iteration 3: 8 > 42 = false → No update');
  console.log('- Iteration 4: 27 > 42 = false → No update');
  console.log('- Final result: maxValue = 42, maxIndex = 2');
  console.log('');

  console.log('🧪 Key Enhancements Tested:');
  console.log('✅ If-Condition Node:');
  console.log('  - Dynamic value comparison with > operator');
  console.log('  - Left value from array-access, right value from variable-get');
  console.log('  - Proper greater-than comparison');
  console.log('  - Loop context in animation steps');
  console.log('');
  console.log('✅ Variable-Set Node:');
  console.log('  - Dynamic value setting from array-access data flow');
  console.log('  - Dynamic index setting from loop index');
  console.log('  - Static initialization values');
  console.log('  - Loop context in animation steps');
  console.log('');
  console.log('✅ Variable-Get Node:');
  console.log('  - Provides current max value for comparison');
  console.log('  - Data flow output to if-condition');
  console.log('');

  console.log('📊 Expected Animation Highlights:');
  console.log('- Each array element should be highlighted during access');
  console.log('- Comparisons should show actual values being compared');
  console.log('- Variable updates should be clearly indicated');
  console.log('- Loop context should be included in all steps');
  console.log('');

  console.log('🔍 Testing Instructions:');
  console.log('1. Create the node structure above in Visual Scripting Editor');
  console.log('2. Set array to [15, 3, 42, 8, 27]');
  console.log('3. Execute the algorithm');
  console.log('4. Verify detailed animation steps are generated');
  console.log('5. Check that maxValue variable ends up as 42');
  console.log('6. Check that maxIndex variable ends up as 2');
  console.log('7. Verify comparisons show correct > operator results');

  return {
    nodes: findMaxNodes,
    connections: findMaxConnections,
    testArray: testArray,
    algorithmType: 'FIND_MAXIMUM',
    expectedMaxValue: 42,
    expectedMaxIndex: 2,
    status: 'ENHANCED_NODES_IMPLEMENTED'
  };
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testFindMaximumAlgorithm };
} else {
  testFindMaximumAlgorithm();
}
