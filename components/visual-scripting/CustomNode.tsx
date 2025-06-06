"use client"
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, 
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
import { NodeType } from '@/types/VisualScripting';
import { getNodeTemplate } from '@/lib/visualScriptingTemplates';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Play, Square, RotateCw, GitBranch, Database, ArrowUpDown, 
  ArrowLeftRight, Highlighter, Equal, Variable, Plus, MessageSquare, Pause
};

interface CustomNodeData {
  nodeType: NodeType;
  label: string;
  isSelected: boolean;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onSelect: () => void;
  [key: string]: any;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const template = getNodeTemplate(data.nodeType);
  const NodeIcon = template ? iconMap[template.icon] : Play;

  const handleInputChange = (field: string, value: any) => {
    data.onUpdate({ [field]: value });
  };

  const getNodeColor = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'start':
        return 'border-green-500 bg-green-900/20';
      case 'end':
        return 'border-red-500 bg-red-900/20';
      case 'for-loop':
      case 'if-condition':
        return 'border-blue-500 bg-blue-900/20';
      case 'array-access':
      case 'array-compare':
      case 'array-swap':
        return 'border-purple-500 bg-purple-900/20';
      case 'array-highlight':
      case 'update-description':
      case 'pause-execution':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'variable-set':
      case 'variable-get':
      case 'counter-increment':
        return 'border-orange-500 bg-orange-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const renderNodeContent = () => {
    switch (data.nodeType) {
      case 'for-loop':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Start"
                value={data.loopStart || 0}
                onChange={(e) => handleInputChange('loopStart', parseInt(e.target.value) || 0)}
                className="h-6 text-xs bg-gray-800 border-gray-600"
              />
              <Input
                placeholder="End"
                value={data.loopEnd || 10}
                onChange={(e) => handleInputChange('loopEnd', parseInt(e.target.value) || 10)}
                className="h-6 text-xs bg-gray-800 border-gray-600"
              />
            </div>
            <Input
              placeholder="Variable (i)"
              value={data.loopVariable || 'i'}
              onChange={(e) => handleInputChange('loopVariable', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
          </div>
        );

      case 'if-condition':
        return (
          <Input
            placeholder="Condition"
            value={data.condition || ''}
            onChange={(e) => handleInputChange('condition', e.target.value)}
            className="h-6 text-xs bg-gray-800 border-gray-600"
          />
        );

      case 'array-access':
        return (
          <Input
            placeholder="Index"
            type="number"
            value={data.arrayIndex1 || 0}
            onChange={(e) => handleInputChange('arrayIndex1', parseInt(e.target.value) || 0)}
            className="h-6 text-xs bg-gray-800 border-gray-600"
          />
        );

      case 'array-compare':
      case 'array-swap':
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Index 1"
              type="number"
              value={data.arrayIndex1 || 0}
              onChange={(e) => handleInputChange('arrayIndex1', parseInt(e.target.value) || 0)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
            <Input
              placeholder="Index 2"
              type="number"
              value={data.arrayIndex2 || 1}
              onChange={(e) => handleInputChange('arrayIndex2', parseInt(e.target.value) || 1)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
          </div>
        );

      case 'array-highlight':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Index"
              type="number"
              value={data.arrayIndex1 || 0}
              onChange={(e) => handleInputChange('arrayIndex1', parseInt(e.target.value) || 0)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
            <select
              value={data.highlightColor || 'yellow'}
              onChange={(e) => handleInputChange('highlightColor', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 rounded px-2 w-full"
            >
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        );

      case 'variable-set':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Variable Name"
              value={data.variableName || ''}
              onChange={(e) => handleInputChange('variableName', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
            <Input
              placeholder="Value"
              value={data.variableValue || ''}
              onChange={(e) => handleInputChange('variableValue', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600"
            />
          </div>
        );

      case 'variable-get':
      case 'counter-increment':
        return (
          <Input
            placeholder="Variable Name"
            value={data.variableName || ''}
            onChange={(e) => handleInputChange('variableName', e.target.value)}
            className="h-6 text-xs bg-gray-800 border-gray-600"
          />
        );

      case 'update-description':
        return (
          <Input
            placeholder="Description"
            value={data.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-6 text-xs bg-gray-800 border-gray-600"
          />
        );

      case 'pause-execution':
        return (
          <Input
            placeholder="Duration (ms)"
            type="number"
            value={data.pauseDuration || 1000}
            onChange={(e) => handleInputChange('pauseDuration', parseInt(e.target.value) || 1000)}
            className="h-6 text-xs bg-gray-800 border-gray-600"
          />
        );

      default:
        return null;
    }
  };

  const renderHandles = () => {
    if (!template) return null;

    return (
      <>
        {/* Input Handles */}
        {template.inputs.map((input, index) => (
          <Handle
            key={`input-${input.id}`}
            type="target"
            position={Position.Left}
            id={input.id}
            title={`Input: ${input.label} (${input.type})`}
            className="transition-all duration-200 hover:scale-125 hover:shadow-lg"
            style={{
              top: `${20 + index * 20}px`,
              background: input.type === 'execution' ? '#10B981' : '#6366F1',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              boxShadow: input.type === 'execution'
                ? '0 0 8px rgba(16, 185, 129, 0.4)'
                : '0 0 8px rgba(99, 102, 241, 0.4)'
            }}
          />
        ))}

        {/* Output Handles */}
        {template.outputs.map((output, index) => (
          <Handle
            key={`output-${output.id}`}
            type="source"
            position={Position.Right}
            id={output.id}
            title={`Output: ${output.label} (${output.type})`}
            className="transition-all duration-200 hover:scale-125 hover:shadow-lg"
            style={{
              top: `${20 + index * 20}px`,
              background: output.type === 'execution' ? '#10B981' : '#6366F1',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              boxShadow: output.type === 'execution'
                ? '0 0 8px rgba(16, 185, 129, 0.4)'
                : '0 0 8px rgba(99, 102, 241, 0.4)'
            }}
          />
        ))}
      </>
    );
  };

  return (
    <Card 
      className={`min-w-[180px] max-w-[250px] ${getNodeColor(data.nodeType)} ${
        selected ? 'ring-2 ring-blue-400' : ''
      } cursor-pointer transition-all hover:shadow-lg`}
      onClick={data.onSelect}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {NodeIcon && <NodeIcon className="w-4 h-4 text-gray-300" />}
            <span className="text-sm font-medium text-white truncate">
              {data.label}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        {renderNodeContent()}

        {/* Handles */}
        {renderHandles()}
      </div>
    </Card>
  );
};

export default CustomNode;
