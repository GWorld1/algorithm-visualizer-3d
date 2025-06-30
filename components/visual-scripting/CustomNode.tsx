/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  isConnecting?: boolean;
  connectingHandle?: string;
  compatibleHandles?: string[];
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
                className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="End"
                value={data.loopEnd || 10}
                onChange={(e) => handleInputChange('loopEnd', parseInt(e.target.value) || 10)}
                className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Input
              placeholder="Variable (i)"
              value={data.loopVariable || 'i'}
              onChange={(e) => handleInputChange('loopVariable', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
          </div>
        );

      case 'if-condition':
        return (
          <div className="space-y-2">
            <select
              value={data.comparisonOperator || '=='}
              onChange={(e) => handleInputChange('comparisonOperator', e.target.value)}
              className="w-full h-6 text-xs bg-gray-800 border border-gray-600 rounded px-2 text-white"
            >
              <option value="==">Equal (==)</option>
              <option value="!=">Not Equal (!=)</option>
              <option value=">">Greater Than (&gt;)</option>
              <option value="<">Less Than (&lt;)</option>
              <option value=">=">Greater Equal (&gt;=)</option>
              <option value="<=">Less Equal (&lt;=)</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Left Value"
                value={data.leftValue || ''}
                onChange={(e) => handleInputChange('leftValue', e.target.value)}
                className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Right Value"
                value={data.rightValue || ''}
                onChange={(e) => handleInputChange('rightValue', e.target.value)}
                className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 'array-access':
        return (
          <Input
            placeholder="Index"
            type="number"
            value={data.arrayIndex1 || 0}
            onChange={(e) => handleInputChange('arrayIndex1', parseInt(e.target.value) || 0)}
            className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
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
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
            <Input
              placeholder="Index 2"
              type="number"
              value={data.arrayIndex2 || 1}
              onChange={(e) => handleInputChange('arrayIndex2', parseInt(e.target.value) || 1)}
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
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
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
            <select
              value={data.highlightColor || 'yellow'}
              onChange={(e) => handleInputChange('highlightColor', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 rounded px-2 w-full text-white"
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
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
            <Input
              placeholder="Value"
              value={data.variableValue || ''}
              onChange={(e) => handleInputChange('variableValue', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
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
            className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
          />
        );

      case 'update-description':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Static Description"
              value={data.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
            <Input
              placeholder="Template: Current max: {value}"
              value={data.descriptionTemplate || ''}
              onChange={(e) => handleInputChange('descriptionTemplate', e.target.value)}
              className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
            />
            <div className="text-xs text-gray-400 px-1">
              Use &#123;value&#125; for dynamic values from data flow
            </div>
          </div>
        );

      case 'pause-execution':
        return (
          <Input
            placeholder="Duration (ms)"
            type="number"
            value={data.pauseDuration || 1000}
            onChange={(e) => handleInputChange('pauseDuration', parseInt(e.target.value) || 1000)}
            className="h-6 text-xs bg-gray-800 border-gray-600 text-white"
          />
        );

      default:
        return null;
    }
  };

  const getHandleStyle = (handleType: string, handleId: string, isInput: boolean) => {
    const isExecution = handleType === 'execution';
    const baseColor = isExecution ? '#10B981' : '#1F23FF';
    const isCompatible = data.compatibleHandles?.includes(handleId);
    const isConnecting = data.isConnecting && data.connectingHandle;

    let background = baseColor;
    let border = '2px solid rgba(255, 255, 255, 0.2)';
    let boxShadow = isExecution
      ? '0 0 8px rgba(16, 185, 129, 0.4)'
      : '0 0 8px rgba(31, 35, 255, 0.79)';
    let scale = 1;

    if (isConnecting) {
      if (isCompatible) {
        // Compatible handle - highlight in green
        background = '#22C55E';
        border = '3px solid #16A34A';
        boxShadow = '0 0 12px rgba(34, 197, 94, 0.8)';
        scale = 1.3;
      } else if (data.connectingHandle !== handleId) {
        // Incompatible handle - dim it
        background = '#6B7280';
        border = '2px solid rgba(107, 114, 128, 0.3)';
        boxShadow = 'none';
        scale = 0.8;
      }
    }

    return {
      background,
      border,
      boxShadow,
      width: 12,
      height: 12,
      borderRadius: '50%',
      transform: `scale(${scale})`,
      transition: 'all 0.2s ease-in-out',
      zIndex: isCompatible ? 10 : 1
    };
  };

  const getHandleTooltip = (handle: any, isInput: boolean) => {
    const direction = isInput ? 'Input' : 'Output';
    const flowType = handle.type === 'execution' ? 'Execution Flow' : 'Data Flow';
    const connectionRule = handle.type === 'execution'
      ? 'Only one connection allowed'
      : 'Multiple connections allowed';

    let description = '';
    let examples = '';

    switch (handle.id) {
      case 'exec-in':
        description = 'Connect from previous step in algorithm';
        examples = 'Example: Start → For Loop';
        break;
      case 'exec-out':
        description = 'Connect to next step to execute';
        examples = 'Example: For Loop → Array Access';
        break;
      case 'exec-complete':
        description = 'Connect to step after loop completes';
        examples = 'Example: For Loop → End';
        break;
      case 'index-out':
        description = 'Current loop index value (0, 1, 2, ...)';
        examples = 'Connect to: Array Access (Index input)';
        break;
      case 'array-out':
        description = 'Array being processed';
        examples = 'Connect to: Array Access (Array input)';
        break;
      case 'array-in':
        description = 'Array to access elements from';
        examples = 'Connect from: For Loop (Array output)';
        break;
      case 'index-in':
        description = 'Index position to access in array';
        examples = 'Connect from: For Loop (Current Index)';
        break;
      case 'value-out':
        description = 'Value retrieved from array at index';
        examples = 'Connect to: Variable Set, Array Compare, etc.';
        break;
      default:
        description = `${handle.label} - ${handle.type} type`;
    }

    const compatibilityInfo = data.isConnecting && data.compatibleHandles?.includes(handle.id)
      ? '\n\n✅ COMPATIBLE - You can connect here!'
      : data.isConnecting && !data.compatibleHandles?.includes(handle.id)
      ? '\n\n❌ INCOMPATIBLE - Cannot connect here'
      : '';

    return `${direction}: ${handle.label}\n${flowType} (${handle.type})\n${connectionRule}\n\n${description}\n${examples}${compatibilityInfo}`;
  };

  const renderHandles = () => {
    if (!template) return null;

    return (
      <>
        {/* Input Handles */}
        {template.inputs.map((input, index) => (
          <div key={`input-container-${input.id}`} className="relative">
            <Handle
              key={`input-${input.id}`}
              type="target"
              position={Position.Left}
              id={input.id}
              title={getHandleTooltip(input, true)}
              className="transition-all duration-200 hover:scale-125 hover:shadow-lg cursor-pointer"
              style={{
                top: `${20 + index * 25}px`,
                ...getHandleStyle(input.type, input.id, true)
              }}
            />
            {/* Handle Label */}
            <div
              className="absolute text-xs text-gray-300 pointer-events-none select-none"
              style={{
                top: `${20 + index * 25 - 2}px`,
                left: '-8px',
                transform: 'translateX(-100%)',
                whiteSpace: 'nowrap'
              }}
            >
              {input.label}
            </div>
          </div>
        ))}

        {/* Output Handles */}
        {template.outputs.map((output, index) => (
          <div key={`output-container-${output.id}`} className="relative">
            <Handle
              key={`output-${output.id}`}
              type="source"
              position={Position.Right}
              id={output.id}
              title={getHandleTooltip(output, false)}
              className="transition-all duration-200 hover:scale-125 hover:shadow-lg cursor-pointer"
              style={{
                top: `${20 + index * 25}px`,
                ...getHandleStyle(output.type, output.id, false)
              }}
            />
            {/* Handle Label */}
            <div
              className="absolute text-xs text-gray-300 pointer-events-none select-none"
              style={{
                top: `${20 + index * 25 - 2}px`,
                right: '-8px',
                transform: 'translateX(100%)',
                whiteSpace: 'nowrap'
              }}
            >
              {output.label}
            </div>
          </div>
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
