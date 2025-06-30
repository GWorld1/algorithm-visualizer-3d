// Working Linear Search Example - Demonstrates the Branch Connection Fix
// This example should now work correctly with the if-condition branch fix

const linearSearchWorkingExample = () => {
  console.log('🔍 Linear Search - Working Example');
  console.log('==================================');
  
  console.log('🎯 This example demonstrates the fixed if-condition node');
  console.log('working correctly within a for-loop with only ONE branch connected.');
  console.log('');

  // Define the exact node structure that should work
  const workingExample = {
    title: 'Linear Search for Value 30',
    description: 'Find the index of value 30 in array [10, 20, 30, 40, 50]',
    
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Start Algorithm'
      },
      {
        id: 'init-found',
        type: 'variable-set',
        label: 'Initialize Found Index',
        config: {
          variableName: 'foundIndex',
          variableValue: -1
        }
      },
      {
        id: 'loop',
        type: 'for-loop',
        label: 'Search Loop',
        config: {
          loopStart: 0,
          loopEnd: 5,
          loopVariable: 'i'
        }
      },
      {
        id: 'access',
        type: 'array-access',
        label: 'Get Current Element'
      },
      {
        id: 'condition',
        type: 'if-condition',
        label: 'Check if Found',
        config: {
          comparisonOperator: '==',
          leftValue: 0,    // Will be overridden by data flow
          rightValue: 30   // Search target
        }
      },
      {
        id: 'set-found',
        type: 'variable-set',
        label: 'Set Found Index',
        config: {
          variableName: 'foundIndex',
          variableValue: 0  // Will be overridden by data flow
        }
      },
      {
        id: 'end',
        type: 'end',
        label: 'End Algorithm'
      }
    ],

    connections: {
      execution: [
        'start → init-found',
        'init-found → loop',
        'loop → access',
        'access → condition',
        'condition (exec-true) → set-found',
        'condition (exec-false) → [UNCONNECTED - KEY FIX!]',
        'loop (exec-complete) → end'
      ],
      dataFlow: [
        'loop (index-out) → access (index-in)',
        'access (value-out) → condition (left-in)',
        'loop (index-out) → set-found (value-in)'
      ]
    },

    testData: {
      array: [10, 20, 30, 40, 50],
      searchTarget: 30,
      expectedFoundIndex: 2
    }
  };

  console.log('📋 Node Structure:');
  console.log('==================');
  workingExample.nodes.forEach((node, index) => {
    console.log(`${index + 1}. ${node.label} (${node.type})`);
    if (node.config) {
      Object.entries(node.config).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
  });
  console.log('');

  console.log('🔗 Connections:');
  console.log('===============');
  console.log('Execution Flow:');
  workingExample.connections.execution.forEach(conn => {
    console.log(`  ${conn}`);
  });
  console.log('');
  console.log('Data Flow:');
  workingExample.connections.dataFlow.forEach(conn => {
    console.log(`  ${conn}`);
  });
  console.log('');

  console.log('🎯 Key Fix Point:');
  console.log('=================');
  console.log('❗ CRITICAL: condition (exec-false) → [UNCONNECTED]');
  console.log('');
  console.log('This is the key to the fix:');
  console.log('- When condition is TRUE: Execute set-found → Return to loop');
  console.log('- When condition is FALSE: [No connection] → Return to loop directly');
  console.log('- Both cases allow the loop to continue to next iteration');
  console.log('');

  console.log('🎬 Expected Execution Flow:');
  console.log('===========================');
  
  const expectedFlow = [
    {
      iteration: 0,
      arrayValue: 10,
      comparison: '10 == 30 = false',
      action: 'exec-false (unconnected) → return to loop',
      foundIndex: -1
    },
    {
      iteration: 1,
      arrayValue: 20,
      comparison: '20 == 30 = false',
      action: 'exec-false (unconnected) → return to loop',
      foundIndex: -1
    },
    {
      iteration: 2,
      arrayValue: 30,
      comparison: '30 == 30 = true',
      action: 'exec-true (connected) → set foundIndex = 2 → return to loop',
      foundIndex: 2
    },
    {
      iteration: 3,
      arrayValue: 40,
      comparison: '40 == 30 = false',
      action: 'exec-false (unconnected) → return to loop',
      foundIndex: 2
    },
    {
      iteration: 4,
      arrayValue: 50,
      comparison: '50 == 30 = false',
      action: 'exec-false (unconnected) → return to loop',
      foundIndex: 2
    }
  ];

  expectedFlow.forEach(step => {
    console.log(`Iteration ${step.iteration}:`);
    console.log(`  Array[${step.iteration}] = ${step.arrayValue}`);
    console.log(`  Compare: ${step.comparison}`);
    console.log(`  Action: ${step.action}`);
    console.log(`  foundIndex: ${step.foundIndex}`);
    console.log('');
  });

  console.log('📊 Expected Animation Steps:');
  console.log('============================');
  const expectedSteps = [
    'Starting algorithm execution',
    'Set foundIndex = -1 (static value)',
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

  console.log(`Total Expected Steps: ${expectedSteps.length}`);
  expectedSteps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
  console.log('');

  console.log('✅ Success Indicators:');
  console.log('======================');
  console.log('1. All 25 animation steps are generated');
  console.log('2. Step 14 shows "Set foundIndex = 2"');
  console.log('3. Steps 6, 10, 18, 22 show "Compare: X == 30 = false"');
  console.log('4. Step 13 shows "Compare: 30 == 30 = true"');
  console.log('5. All 5 loop iterations complete');
  console.log('6. Final foundIndex variable = 2');
  console.log('7. Algorithm does not terminate early');
  console.log('');

  console.log('🚨 Failure Indicators (Before Fix):');
  console.log('===================================');
  console.log('1. Algorithm terminates after first false comparison');
  console.log('2. Only 3-6 animation steps generated');
  console.log('3. foundIndex remains -1');
  console.log('4. Missing steps for iterations 1-4');
  console.log('5. Error messages about null currentNodeId');
  console.log('');

  console.log('🎉 Ready for Testing!');
  console.log('=====================');
  console.log('Create this exact structure in the Visual Scripting Editor');
  console.log('and verify that it now works correctly with the branch fix.');

  return {
    workingExample,
    expectedFlow,
    expectedSteps,
    status: 'READY_FOR_LINEAR_SEARCH_TESTING'
  };
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { linearSearchWorkingExample };
} else {
  linearSearchWorkingExample();
}
