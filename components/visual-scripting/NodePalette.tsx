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
  Pause,
  Calculator
} from 'lucide-react';
import { nodeTemplates, nodeCategories } from '@/lib/visualScriptingTemplates';
import { NodeType } from '@/types/VisualScripting';


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
  Pause,
  Calculator
};

const NodePalette: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = React.useState<string>('control');
  // const { addNode } = useVisualScriptingStore();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
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


        </CardContent>
      </Card>
    </div>
  );
};

export default NodePalette;
