// Find Maximum Algorithm with Dynamic Description Updates
// Demonstrates the enhanced update-description node functionality

const findMaximumWithDynamicDescriptions = () => {
  console.log('📊 Find Maximum Algorithm with Dynamic Descriptions');
  console.log('==================================================');
  
  console.log('🎯 This example demonstrates the enhanced update-description node');
  console.log('showing real-time status updates with actual variable values.');
  console.log('');

  const algorithmStructure = {
    title: 'Find Maximum with Real-Time Status Updates',
    description: 'Find the maximum value in array [15, 3, 42, 8, 27] with dynamic status messages',
    
    nodeConfiguration: [
      {
        step: 1,
        node: 'Start',
        type: 'start',
        purpose: 'Begin algorithm execution'
      },
      {
        step: 2,
        node: 'Initialize Max Value',
        type: 'variable-set',
        config: {
          variableName: 'maxValue',
          variableValue: -999
        },
        purpose: 'Set initial maximum to very small value'
      },
      {
        step: 3,
        node: 'Initialize Max Index',
        type: 'variable-set',
        config: {
          variableName: 'maxIndex',
          variableValue: -1
        },
        purpose: 'Set initial index to -1 (not found)'
      },
      {
        step: 4,
        node: 'Search Loop',
        type: 'for-loop',
        config: {
          loopStart: 0,
          loopEnd: 5,
          loopVariable: 'i'
        },
        purpose: 'Iterate through array elements'
      },
      {
        step: 5,
        node: 'Get Current Element',
        type: 'array-access',
        purpose: 'Access array element at current index'
      },
      {
        step: 6,
        node: 'Get Current Max',
        type: 'variable-get',
        config: {
          variableName: 'maxValue'
        },
        purpose: 'Retrieve current maximum value for comparison'
      },
      {
        step: 7,
        node: 'Check if Greater',
        type: 'if-condition',
        config: {
          comparisonOperator: '>',
          leftValue: 0,   // From array-access
          rightValue: 0   // From variable-get
        },
        purpose: 'Compare current element with current maximum'
      },
      {
        step: 8,
        node: 'Update Max Value',
        type: 'variable-set',
        config: {
          variableName: 'maxValue',
          variableValue: 0  // From array-access
        },
        purpose: 'Update maximum value when larger element found'
      },
      {
        step: 9,
        node: 'Update Max Index',
        type: 'variable-set',
        config: {
          variableName: 'maxIndex',
          variableValue: 0  // From loop index
        },
        purpose: 'Update index of maximum element'
      },
      {
        step: 10,
        node: 'Status Update',
        type: 'update-description',
        config: {
          description: 'Found new maximum',
          descriptionTemplate: 'New maximum found: {value} at index {i}'
        },
        purpose: 'Display dynamic status message with actual values'
      },
      {
        step: 11,
        node: 'End',
        type: 'end',
        purpose: 'Complete algorithm execution'
      }
    ],

    connectionDetails: {
      executionFlow: [
        'Start → Initialize Max Value',
        'Initialize Max Value → Initialize Max Index',
        'Initialize Max Index → Search Loop',
        'Search Loop → Get Current Element',
        'Get Current Element → Check if Greater',
        'Check if Greater (exec-true) → Update Max Value',
        'Update Max Value → Update Max Index',
        'Update Max Index → Status Update',
        'Check if Greater (exec-false) → [UNCONNECTED - returns to loop]',
        'Search Loop (exec-complete) → End'
      ],
      dataFlow: [
        'Search Loop (index-out) → Get Current Element (index-in)',
        'Get Current Element (value-out) → Check if Greater (left-in)',
        'Get Current Max (value-out) → Check if Greater (right-in)',
        'Get Current Element (value-out) → Update Max Value (value-in)',
        'Search Loop (index-out) → Update Max Index (value-in)',
        'Update Max Value (value-out) → Status Update (value-in)'
      ]
    },

    testData: {
      array: [15, 3, 42, 8, 27],
      expectedMaxValue: 42,
      expectedMaxIndex: 2
    }
  };

  console.log('📋 Algorithm Structure:');
  console.log('======================');
  algorithmStructure.nodeConfiguration.forEach(node => {
    console.log(`${node.step}. ${node.node} (${node.type})`);
    if (node.config) {
      Object.entries(node.config).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    console.log(`   Purpose: ${node.purpose}`);
    console.log('');
  });

  console.log('🔗 Key Connections:');
  console.log('===================');
  console.log('Execution Flow:');
  algorithmStructure.connectionDetails.executionFlow.forEach(conn => {
    console.log(`  ${conn}`);
  });
  console.log('');
  console.log('Data Flow:');
  algorithmStructure.connectionDetails.dataFlow.forEach(conn => {
    console.log(`  ${conn}`);
  });
  console.log('');

  console.log('🎯 Key Enhancement - Dynamic Status Update:');
  console.log('===========================================');
  console.log('Node: Status Update (update-description)');
  console.log('Configuration:');
  console.log('  Static Description: "Found new maximum"');
  console.log('  Template: "New maximum found: {value} at index {i}"');
  console.log('  Data Input: Update Max Value (value-out) → Status Update (value-in)');
  console.log('');
  console.log('How it works:');
  console.log('1. Update Max Value sets maxValue to new maximum (e.g., 42)');
  console.log('2. This value flows through value-out to Status Update value-in');
  console.log('3. Template "New maximum found: {value} at index {i}" is processed');
  console.log('4. {value} is replaced with 42 (from data flow)');
  console.log('5. {i} is replaced with 2 (current loop index)');
  console.log('6. Result: "New maximum found: 42 at index 2"');
  console.log('');

  console.log('🎬 Expected Execution Flow:');
  console.log('===========================');
  
  const expectedExecution = [
    {
      iteration: 0,
      element: 15,
      currentMax: -999,
      comparison: '15 > -999 = true',
      action: 'Update max to 15, index to 0',
      statusMessage: 'New maximum found: 15 at index 0'
    },
    {
      iteration: 1,
      element: 3,
      currentMax: 15,
      comparison: '3 > 15 = false',
      action: 'No update',
      statusMessage: 'No status update (exec-false branch)'
    },
    {
      iteration: 2,
      element: 42,
      currentMax: 15,
      comparison: '42 > 15 = true',
      action: 'Update max to 42, index to 2',
      statusMessage: 'New maximum found: 42 at index 2'
    },
    {
      iteration: 3,
      element: 8,
      currentMax: 42,
      comparison: '8 > 42 = false',
      action: 'No update',
      statusMessage: 'No status update (exec-false branch)'
    },
    {
      iteration: 4,
      element: 27,
      currentMax: 42,
      comparison: '27 > 42 = false',
      action: 'No update',
      statusMessage: 'No status update (exec-false branch)'
    }
  ];

  expectedExecution.forEach(step => {
    console.log(`Iteration ${step.iteration}:`);
    console.log(`  Element: array[${step.iteration}] = ${step.element}`);
    console.log(`  Current Max: ${step.currentMax}`);
    console.log(`  Comparison: ${step.comparison}`);
    console.log(`  Action: ${step.action}`);
    console.log(`  Status: ${step.statusMessage}`);
    console.log('');
  });

  console.log('📊 Expected Animation Steps (Key Highlights):');
  console.log('=============================================');
  const keySteps = [
    'Starting algorithm execution',
    'Set maxValue = -999 (static value)',
    'Set maxIndex = -1 (static value)',
    'Starting loop: i = 0 to 5',
    '...',
    'Compare: 15 > -999 = true (Loop iteration 0: i = 0)',
    'Set maxValue = 15 (from data flow) (Loop iteration 0: i = 0)',
    'Set maxIndex = 0 (from data flow) (Loop iteration 0: i = 0)',
    'New maximum found: 15 at index 0 (Loop iteration 0: i = 0)',
    '...',
    'Compare: 42 > 15 = true (Loop iteration 2: i = 2)',
    'Set maxValue = 42 (from data flow) (Loop iteration 2: i = 2)',
    'Set maxIndex = 2 (from data flow) (Loop iteration 2: i = 2)',
    'New maximum found: 42 at index 2 (Loop iteration 2: i = 2)',
    '...',
    'Loop completed: processed 5 iterations',
    'Algorithm execution completed'
  ];

  keySteps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
  console.log('');

  console.log('✅ Success Indicators:');
  console.log('======================');
  console.log('1. Status Update node shows template input field in UI');
  console.log('2. Template field contains: "New maximum found: {value} at index {i}"');
  console.log('3. Can connect Update Max Value → Status Update (data flow)');
  console.log('4. Animation step 9 shows: "New maximum found: 15 at index 0"');
  console.log('5. Animation step 14 shows: "New maximum found: 42 at index 2"');
  console.log('6. Loop context is included in all dynamic descriptions');
  console.log('7. Final maxValue = 42, maxIndex = 2');
  console.log('');

  console.log('🚨 Testing Instructions:');
  console.log('========================');
  console.log('1. Create the algorithm structure above in Visual Scripting Editor');
  console.log('2. Configure Status Update node:');
  console.log('   - Template: "New maximum found: {value} at index {i}"');
  console.log('   - Connect: Update Max Value value-out → Status Update value-in');
  console.log('3. Set array to [15, 3, 42, 8, 27]');
  console.log('4. Execute algorithm');
  console.log('5. Verify dynamic status messages appear with actual values');
  console.log('6. Check that only iterations 0 and 2 show status updates');
  console.log('7. Confirm final result: maxValue = 42, maxIndex = 2');

  return {
    algorithmStructure,
    expectedExecution,
    keySteps,
    status: 'FIND_MAXIMUM_WITH_DYNAMIC_DESCRIPTIONS_READY'
  };
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findMaximumWithDynamicDescriptions };
} else {
  findMaximumWithDynamicDescriptions();
}
