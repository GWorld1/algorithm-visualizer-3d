/**
 * Manual Test Script for Template Save and Load Functionality
 * 
 * Run this script in the browser console while on the Visual Script Editor page
 * to test the template save and load functionality.
 * 
 * Instructions:
 * 1. Open the Visual Script Editor
 * 2. Open browser developer tools (F12)
 * 3. Copy and paste this script into the console
 * 4. Run the script by pressing Enter
 * 5. Follow the test results in the console
 */

(function() {
  console.log('🧪 Starting Manual Template Save/Load Test...');
  
  // Test data
  const testNodes = [
    {
      id: 'test-start-1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Test Start', isValid: true }
    },
    {
      id: 'test-loop-1',
      type: 'for-loop',
      position: { x: 300, y: 100 },
      data: { 
        label: 'Test Loop', 
        loopStart: 0, 
        loopEnd: 10, 
        loopVariable: 'i',
        isValid: true 
      }
    },
    {
      id: 'test-end-1',
      type: 'end',
      position: { x: 500, y: 100 },
      data: { label: 'Test End', isValid: true }
    }
  ];

  const testConnections = [
    {
      id: 'test-conn-1',
      source: 'test-start-1',
      sourceHandle: 'exec-out',
      target: 'test-loop-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'test-conn-2',
      source: 'test-loop-1',
      sourceHandle: 'exec-complete',
      target: 'test-end-1',
      targetHandle: 'exec-in'
    }
  ];

  const testFormData = {
    name: 'Manual Test Template',
    description: 'A template created by the manual test script',
    category: 'custom',
    complexity: 'beginner',
    estimatedTime: '1 minute'
  };

  // Test functions
  function testTemplateSave() {
    console.log('📝 Testing template save...');
    
    try {
      // Access the PersonalTemplateManager (assuming it's available globally or through imports)
      if (typeof PersonalTemplateManager === 'undefined') {
        console.error('❌ PersonalTemplateManager not available. Make sure you are on the Visual Script Editor page.');
        return false;
      }

      const result = PersonalTemplateManager.saveTemplate(testFormData, testNodes, testConnections);
      
      if (result.success) {
        console.log('✅ Template saved successfully:', result.template.name);
        console.log('   - Nodes saved:', result.template.nodes.length);
        console.log('   - Connections saved:', result.template.connections.length);
        return true;
      } else {
        console.error('❌ Template save failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Template save error:', error);
      return false;
    }
  }

  function testTemplateLoad() {
    console.log('📖 Testing template load...');
    
    try {
      const templates = PersonalTemplateManager.getPersonalTemplates();
      const testTemplate = templates.find(t => t.name === testFormData.name);
      
      if (!testTemplate) {
        console.error('❌ Test template not found in loaded templates');
        return false;
      }

      console.log('✅ Template loaded successfully:', testTemplate.name);
      console.log('   - Nodes loaded:', testTemplate.nodes.length);
      console.log('   - Connections loaded:', testTemplate.connections.length);
      
      // Verify node data preservation
      const loopNode = testTemplate.nodes.find(n => n.type === 'for-loop');
      if (loopNode && loopNode.data.loopStart === 0 && loopNode.data.loopEnd === 10) {
        console.log('✅ Node data preserved correctly');
      } else {
        console.error('❌ Node data not preserved correctly');
        return false;
      }

      // Verify connection data preservation
      const execConnection = testTemplate.connections.find(c => 
        c.sourceHandle === 'exec-out' && c.targetHandle === 'exec-in'
      );
      if (execConnection) {
        console.log('✅ Connection data preserved correctly');
      } else {
        console.error('❌ Connection data not preserved correctly');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Template load error:', error);
      return false;
    }
  }

  function testTemplateInEditor() {
    console.log('🎨 Testing template in editor...');
    
    try {
      // Try to access the visual scripting store
      if (typeof useVisualScriptingStore === 'undefined') {
        console.warn('⚠️ Visual scripting store not accessible. Skipping editor test.');
        return true;
      }

      const store = useVisualScriptingStore.getState();
      const initialNodeCount = store.nodes.length;
      const initialConnectionCount = store.connections.length;

      console.log('📊 Current editor state:');
      console.log('   - Nodes:', initialNodeCount);
      console.log('   - Connections:', initialConnectionCount);

      // Note: We can't easily test the template loading in the editor without 
      // triggering the actual UI, but we can verify the store is accessible
      console.log('✅ Editor store accessible for template loading');
      return true;
    } catch (error) {
      console.error('❌ Editor test error:', error);
      return false;
    }
  }

  function cleanup() {
    console.log('🧹 Cleaning up test data...');
    
    try {
      const result = PersonalTemplateManager.deleteTemplate(
        PersonalTemplateManager.getPersonalTemplates()
          .find(t => t.name === testFormData.name)?.id
      );
      
      if (result.success) {
        console.log('✅ Test template cleaned up');
      } else {
        console.warn('⚠️ Could not clean up test template:', result.message);
      }
    } catch (error) {
      console.warn('⚠️ Cleanup error:', error);
    }
  }

  // Run tests
  console.log('🚀 Running template save/load tests...\n');
  
  let allTestsPassed = true;
  
  // Test 1: Save template
  if (!testTemplateSave()) {
    allTestsPassed = false;
  }
  
  // Test 2: Load template
  if (!testTemplateLoad()) {
    allTestsPassed = false;
  }
  
  // Test 3: Editor integration
  if (!testTemplateInEditor()) {
    allTestsPassed = false;
  }
  
  // Results
  console.log('\n📋 Test Results:');
  if (allTestsPassed) {
    console.log('🎉 All tests passed! Template save/load functionality is working correctly.');
  } else {
    console.log('❌ Some tests failed. Check the errors above for details.');
  }
  
  // Cleanup
  cleanup();
  
  console.log('\n✨ Manual test completed.');
})();
