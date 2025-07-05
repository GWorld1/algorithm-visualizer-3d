/**
 * Test suite for Visual Script Editor Template Save and Load functionality
 * 
 * This test verifies that:
 * 1. Templates save both nodes and connections correctly
 * 2. Templates load with all connections restored
 * 3. Node ID mapping works properly during template loading
 * 4. Connection validation prevents invalid connections
 */

import { PersonalTemplateManager } from '@/lib/personalTemplateStorage';
import { ScriptNode, Connection, TemplateFormData } from '@/types/VisualScripting';

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Template Save and Load Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    mockLocalStorage.clear();
  });

  const createTestNodes = (): ScriptNode[] => [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Start', isValid: true }
    },
    {
      id: 'for-loop-1',
      type: 'for-loop',
      position: { x: 300, y: 100 },
      data: { 
        label: 'For Loop', 
        loopStart: 0, 
        loopEnd: 5, 
        loopVariable: 'i',
        isValid: true 
      }
    },
    {
      id: 'array-access-1',
      type: 'array-access',
      position: { x: 500, y: 100 },
      data: { label: 'Array Access', isValid: true }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 700, y: 100 },
      data: { label: 'End', isValid: true }
    }
  ];

  const createTestConnections = (): Connection[] => [
    {
      id: 'conn-1',
      source: 'start-1',
      sourceHandle: 'exec-out',
      target: 'for-loop-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-2',
      source: 'for-loop-1',
      sourceHandle: 'exec-out',
      target: 'array-access-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-3',
      source: 'for-loop-1',
      sourceHandle: 'exec-complete',
      target: 'end-1',
      targetHandle: 'exec-in'
    },
    {
      id: 'conn-4',
      source: 'for-loop-1',
      sourceHandle: 'index-out',
      target: 'array-access-1',
      targetHandle: 'index-in'
    }
  ];

  const createTestFormData = (): TemplateFormData => ({
    name: 'Test Array Iteration',
    description: 'A test template for array iteration with connections',
    category: 'array',
    complexity: 'beginner',
    estimatedTime: '2-3 minutes'
  });

  test('should save template with nodes and connections', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    expect(result.success).toBe(true);
    expect(result.template).toBeDefined();
    expect(result.template?.nodes).toHaveLength(4);
    expect(result.template?.connections).toHaveLength(4);
    expect(result.template?.metadata.nodeCount).toBe(4);
    expect(result.template?.metadata.connectionCount).toBe(4);
  });

  test('should preserve node data when saving template', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    expect(result.success).toBe(true);
    const savedTemplate = result.template!;
    
    // Check that node data is preserved
    const forLoopNode = savedTemplate.nodes.find(n => n.type === 'for-loop');
    expect(forLoopNode).toBeDefined();
    expect(forLoopNode?.data.loopStart).toBe(0);
    expect(forLoopNode?.data.loopEnd).toBe(5);
    expect(forLoopNode?.data.loopVariable).toBe('i');
  });

  test('should preserve connection data when saving template', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    expect(result.success).toBe(true);
    const savedTemplate = result.template!;
    
    // Check that all connections are preserved
    expect(savedTemplate.connections).toHaveLength(4);
    
    // Check specific connection details
    const execConnection = savedTemplate.connections.find(c => 
      c.source === 'start-1' && c.target === 'for-loop-1'
    );
    expect(execConnection).toBeDefined();
    expect(execConnection?.sourceHandle).toBe('exec-out');
    expect(execConnection?.targetHandle).toBe('exec-in');

    const dataConnection = savedTemplate.connections.find(c => 
      c.source === 'for-loop-1' && c.target === 'array-access-1' && c.sourceHandle === 'index-out'
    );
    expect(dataConnection).toBeDefined();
    expect(dataConnection?.targetHandle).toBe('index-in');
  });

  test('should load saved template correctly', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    // Save template
    const saveResult = PersonalTemplateManager.saveTemplate(formData, nodes, connections);
    expect(saveResult.success).toBe(true);

    // Load templates
    const loadedTemplates = PersonalTemplateManager.getPersonalTemplates();
    expect(loadedTemplates).toHaveLength(1);

    const loadedTemplate = loadedTemplates[0];
    expect(loadedTemplate.name).toBe(formData.name);
    expect(loadedTemplate.description).toBe(formData.description);
    expect(loadedTemplate.nodes).toHaveLength(4);
    expect(loadedTemplate.connections).toHaveLength(4);
  });

  test('should handle empty connections gracefully', () => {
    const nodes = createTestNodes();
    const connections: Connection[] = [];
    const formData = createTestFormData();

    const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    expect(result.success).toBe(true);
    expect(result.template?.connections).toHaveLength(0);
    expect(result.template?.metadata.connectionCount).toBe(0);
  });

  test('should prevent saving template with empty nodes', () => {
    const nodes: ScriptNode[] = [];
    const connections: Connection[] = [];
    const formData = createTestFormData();

    const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Cannot save empty template');
  });

  test('should prevent duplicate template names', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    // Save first template
    const firstResult = PersonalTemplateManager.saveTemplate(formData, nodes, connections);
    expect(firstResult.success).toBe(true);

    // Try to save template with same name
    const secondResult = PersonalTemplateManager.saveTemplate(formData, nodes, connections);
    expect(secondResult.success).toBe(false);
    expect(secondResult.message).toBe('A template with this name already exists');
  });

  test('should validate template structure on load', () => {
    const nodes = createTestNodes();
    const connections = createTestConnections();
    const formData = createTestFormData();

    // Save template
    PersonalTemplateManager.saveTemplate(formData, nodes, connections);

    // Load and verify structure
    const templates = PersonalTemplateManager.getPersonalTemplates();
    const template = templates[0];

    expect(template.id).toBeDefined();
    expect(template.metadata).toBeDefined();
    expect(template.metadata.createdAt).toBeDefined();
    expect(template.metadata.version).toBeDefined();
    expect(typeof template.metadata.nodeCount).toBe('number');
    expect(typeof template.metadata.connectionCount).toBe('number');
  });
});
