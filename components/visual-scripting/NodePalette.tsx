/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  RotateCw, 
  GitBranch, 
  Database, 
  ArrowUpDown, 
  ArrowLeftRight, 
  Highlighter, 
  Equal, 
  Variable, 
  Plus, 
  MessageSquare, 
  Pause 
} from 'lucide-react';
import { nodeTemplates, nodeCategories } from '@/lib/visualScriptingTemplates';
import { NodeType } from '@/types/VisualScripting';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';
import { useArrayStore } from '@/store/useArrayStore';

// Icon mapping for node types
const iconMap: Record<string, React.ComponentType<any>> = {
  Play,
  Square,
  RotateCw,
  GitBranch,
  Database,
  ArrowUpDown,
  ArrowLeftRight,
  Highlighter,
  Equal,
  Variable,
  Plus,
  MessageSquare,
  Pause
};

const NodePalette: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = React.useState<string>('control');
  const { addNode, clearAll } = useVisualScriptingStore();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
  };

  const loadSimpleTestTemplate = () => {
    clearAll();

    // Create a simple test: Start → Array Access → Array Highlight → End
    addNode('start', { x: 100, y: 200 });
    addNode('array-access', { x: 300, y: 200 });
    addNode('array-highlight', { x: 500, y: 200 });
    addNode('end', { x: 700, y: 200 });

    // Add connections after a brief delay to ensure nodes are created
    setTimeout(() => {
      const { addConnection } = useVisualScriptingStore.getState();

      addConnection({
        source: 'start-1',
        sourceHandle: 'exec-out',
        target: 'array-access-1',
        targetHandle: 'exec-in'
      });

      addConnection({
        source: 'array-access-1',
        sourceHandle: 'exec-out',
        target: 'array-highlight-1',
        targetHandle: 'exec-in'
      });

      addConnection({
        source: 'array-highlight-1',
        sourceHandle: 'exec-out',
        target: 'end-1',
        targetHandle: 'exec-in'
      });
    }, 100);
  };

  const loadLinearSearchTemplate = () => {
    clearAll();

    // Create nodes for linear search algorithm
    addNode('start', { x: 100, y: 100 });
    addNode('variable-set', { x: 100, y: 200 });
    addNode('for-loop', { x: 100, y: 300 });
    addNode('array-access', { x: 300, y: 350 });
    addNode('if-condition', { x: 300, y: 450 });
    addNode('array-highlight', { x: 500, y: 400 });
    addNode('update-description', { x: 500, y: 500 });
    addNode('end', { x: 700, y: 450 });

    // Update node data
    setTimeout(() => {
      const { nodes, updateNode } = useVisualScriptingStore.getState();

      // Find nodes by type and update their data
      const variableSetNode = nodes.find(n => n.type === 'variable-set');
      if (variableSetNode) {
        updateNode(variableSetNode.id, {
          variableName: 'target',
          variableValue: 5,
          label: 'Set Target = 5'
        });
      }

      const forLoopNode = nodes.find(n => n.type === 'for-loop');
      if (forLoopNode) {
        updateNode(forLoopNode.id, {
          loopStart: 0,
          loopEnd: useArrayStore.getState().elements.length,
          loopVariable: 'i',
          label: `For i = 0 to ${useArrayStore.getState().elements.length}`
        });
      }

      const ifConditionNode = nodes.find(n => n.type === 'if-condition');
      if (ifConditionNode) {
        updateNode(ifConditionNode.id, {
          condition: 'array[i] == target',
          label: 'If array[i] == target'
        });
      }

      const highlightNode = nodes.find(n => n.type === 'array-highlight');
      if (highlightNode) {
        updateNode(highlightNode.id, {
          arrayIndex1: 0,
          highlightColor: 'green',
          label: 'Highlight Found Element'
        });
      }

      const descriptionNode = nodes.find(n => n.type === 'update-description');
      if (descriptionNode) {
        updateNode(descriptionNode.id, {
          description: 'Element found!',
          label: 'Show Success Message'
        });
      }
    }, 100);
  };

  const loadFindMaxTemplate = () => {
    clearAll();

    // Create nodes for find maximum algorithm
    addNode('start', { x: 100, y: 100 });
    addNode('variable-set', { x: 100, y: 200 });
    addNode('for-loop', { x: 100, y: 300 });
    addNode('array-access', { x: 300, y: 350 });
    addNode('if-condition', { x: 300, y: 450 });
    addNode('variable-set', { x: 500, y: 400 });
    addNode('array-highlight', { x: 500, y: 500 });
    addNode('end', { x: 700, y: 450 });

    // Update node data
    setTimeout(() => {
      const { nodes, updateNode } = useVisualScriptingStore.getState();

      const firstVariableSetNode = nodes.filter(n => n.type === 'variable-set')[0];
      if (firstVariableSetNode) {
        updateNode(firstVariableSetNode.id, {
          variableName: 'max',
          variableValue: 'array[0]',
          label: 'Set max = array[0]'
        });
      }

      const forLoopNode = nodes.find(n => n.type === 'for-loop');
      if (forLoopNode) {
        updateNode(forLoopNode.id, {
          loopStart: 1,
          loopEnd: useArrayStore.getState().elements.length,
          loopVariable: 'i',
          label: `For i = 1 to ${useArrayStore.getState().elements.length}`
        });
      }

      const ifConditionNode = nodes.find(n => n.type === 'if-condition');
      if (ifConditionNode) {
        updateNode(ifConditionNode.id, {
          condition: 'array[i] > max',
          label: 'If array[i] > max'
        });
      }

      const secondVariableSetNode = nodes.filter(n => n.type === 'variable-set')[1];
      if (secondVariableSetNode) {
        updateNode(secondVariableSetNode.id, {
          variableName: 'max',
          variableValue: 'array[i]',
          label: 'Update max = array[i]'
        });
      }

      const highlightNode = nodes.find(n => n.type === 'array-highlight');
      if (highlightNode) {
        updateNode(highlightNode.id, {
          arrayIndex1: 0,
          highlightColor: 'blue',
          label: 'Highlight New Max'
        });
      }
    }, 100);
  };

  return (
    <div className="h-full bg-gray-800 overflow-y-auto">
      <Card className="border-0 rounded-none bg-transparent h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300">Node Palette</CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-2">
          {nodeCategories.map(category => {
            const CategoryIcon = iconMap[category.icon];
            const categoryNodes = nodeTemplates.filter(template => template.category === category.id);
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id} className="border border-gray-600 rounded-lg overflow-hidden">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-gray-700"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    {CategoryIcon && <CategoryIcon className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm text-gray-300 flex-1">{category.label}</span>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      <GitBranch className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                </Button>

                {/* Category Nodes */}
                {isExpanded && (
                  <div className="bg-gray-750 p-2 space-y-1">
                    {categoryNodes.map(template => {
                      const NodeIcon = iconMap[template.icon];
                      
                      return (
                        <div
                          key={template.type}
                          className="bg-gray-700 border border-gray-600 rounded p-2 cursor-grab hover:bg-gray-650 transition-colors"
                          draggable
                          onDragStart={(event) => onDragStart(event, template.type)}
                          title={template.description}
                        >
                          <div className="flex items-center gap-2">
                            {NodeIcon && <NodeIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-white truncate">
                                {template.label}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {template.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Instructions */}
          <div className="mt-4 p-3 bg-gray-750 border border-gray-600 rounded-lg">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="font-medium text-gray-300">How to use:</div>
              <div>• Drag nodes from palette to canvas</div>
              <div>• Connect nodes by dragging from output to input</div>
              <div>• Click nodes to edit properties</div>
              <div>• Use Start and End nodes for every algorithm</div>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-300 mb-2">Quick Templates</div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-blue-400 hover:text-white hover:bg-gray-700 border border-blue-500/30"
                onClick={() => loadSimpleTestTemplate()}
              >
                🧪 Simple Test (Debug)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => loadLinearSearchTemplate()}
              >
                Linear Search
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => loadFindMaxTemplate()}
              >
                Find Maximum
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  console.log('Bubble Sort template coming soon!');
                }}
              >
                Bubble Sort (Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NodePalette;
