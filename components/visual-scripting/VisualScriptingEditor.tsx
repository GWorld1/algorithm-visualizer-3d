/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useArrayStore } from '@/store/useArrayStore';
import { ScriptNode, NodeType, ValidationResult } from '@/types/VisualScripting';
import { getNodeTemplate } from '@/lib/visualScriptingTemplates';
import NodePalette from './NodePalette';
import CustomNode from './CustomNode';
import TutorialOverlay from './TutorialOverlay';
import ArrayIterationGuide from './ArrayIterationGuide';
import DebuggerModal from '@/components/layout/DebuggerModal';
import ConnectionStatus from './ConnectionStatus';
import { Button } from '@/components/ui/button';
import { Play, Save, Trash2, Eye, EyeOff, HelpCircle, BookOpen, Bug } from 'lucide-react';

// Custom node types for React Flow
const nodeTypes = {
  customNode: CustomNode,
};

// Helper function to validate connection type compatibility
const validateConnectionTypes = (sourceType: string, targetType: string): boolean => {
  // Exact type match
  if (sourceType === targetType) return true;

  // 'any' type is compatible with everything
  if (sourceType === 'any' || targetType === 'any') return true;

  // Execution flow can only connect to execution flow
  if (sourceType === 'execution' || targetType === 'execution') {
    return sourceType === 'execution' && targetType === 'execution';
  }

  // Number can connect to array index inputs
  if (sourceType === 'number' && targetType === 'number') return true;

  // Array can connect to array inputs
  if (sourceType === 'array' && targetType === 'array') return true;

  // Boolean connections
  if (sourceType === 'boolean' && targetType === 'boolean') return true;

  return false;
};

const VisualScriptingEditor: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [showArrayGuide, setShowArrayGuide] = React.useState(false);
  const [showDebuggerModal, setShowDebuggerModal] = React.useState(false);
  const [currentValidation, setCurrentValidation] = React.useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [connectionState, setConnectionState] = React.useState<{
    isConnecting: boolean;
    sourceNode?: string;
    sourceHandle?: string;
    sourceType?: string;
  }>({ isConnecting: false });

  const {
    nodes: storeNodes,
    connections: storeConnections,
    selectedNode,
    showNodePalette,
    addNode,
    removeNode,
    updateNode,
    selectNode,
    addConnection,
    removeConnection,
    toggleNodePalette,
    validateScript,
    saveAlgorithm,
    clearAll,
    compileAlgorithm
  } = useVisualScriptingStore();

  // Helper function to get compatible handles for connection guidance
  const getCompatibleHandles = (sourceNodeId: string, sourceHandleId: string, targetNodeId: string): string[] => {
    if (!connectionState.isConnecting) return [];

    const sourceNode = storeNodes.find(n => n.id === sourceNodeId);
    const targetNode = storeNodes.find(n => n.id === targetNodeId);

    if (!sourceNode || !targetNode) return [];

    const sourceTemplate = getNodeTemplate(sourceNode.type);
    const targetTemplate = getNodeTemplate(targetNode.type);

    if (!sourceTemplate || !targetTemplate) return [];

    const sourceOutput = sourceTemplate.outputs.find(o => o.id === sourceHandleId);
    if (!sourceOutput) return [];

    return targetTemplate.inputs
      .filter(input => validateConnectionTypes(sourceOutput.type, input.type))
      .map(input => input.id);
  };

  // Convert store nodes to React Flow nodes
  const reactFlowNodes: Node[] = storeNodes.map(node => ({
    id: node.id,
    type: 'customNode',
    position: node.position,
    data: {
      ...node.data,
      nodeType: node.type,
      isSelected: selectedNode === node.id,
      isConnecting: connectionState.isConnecting,
      connectingHandle: connectionState.sourceNode === node.id ? connectionState.sourceHandle : undefined,
      compatibleHandles: connectionState.isConnecting && connectionState.sourceNode && connectionState.sourceHandle
        ? getCompatibleHandles(connectionState.sourceNode, connectionState.sourceHandle, node.id)
        : [],
      onUpdate: (data: any) => updateNode(node.id, data),
      onDelete: () => removeNode(node.id),
      onSelect: () => selectNode(node.id)
    },
    selected: selectedNode === node.id
  }));

  // Convert store connections to React Flow edges
  const reactFlowEdges: Edge[] = storeConnections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    animated: true
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Update React Flow state when store changes
  React.useEffect(() => {
    setNodes(reactFlowNodes);
  }, [storeNodes, selectedNode]);

  React.useEffect(() => {
    setEdges(reactFlowEdges);
  }, [storeConnections]);

  // Initialize and update validation when nodes or connections change
  React.useEffect(() => {
    setCurrentValidation(validateScript());
  }, [storeNodes, storeConnections, validateScript]);

  // Initialize validation on component mount
  React.useEffect(() => {
    setCurrentValidation(validateScript());
  }, []);

  const onConnectStart = useCallback((event: any, { nodeId, handleId, handleType }: any) => {
    console.log('🔗 Connection started:', { nodeId, handleId, handleType });

    const sourceNode = storeNodes.find(n => n.id === nodeId);
    if (sourceNode) {
      const template = getNodeTemplate(sourceNode.type);
      const output = template?.outputs.find(o => o.id === handleId);

      setConnectionState({
        isConnecting: true,
        sourceNode: nodeId,
        sourceHandle: handleId,
        sourceType: output?.type
      });
    }
  }, [storeNodes]);

  const onConnectEnd = useCallback(() => {
    console.log('🔗 Connection ended');
    setConnectionState({ isConnecting: false });
  }, []);

  const onConnect: OnConnect = useCallback((params: Connection) => {
    console.log('🔗 Attempting to connect:', params);

    // Reset connection state
    setConnectionState({ isConnecting: false });

    if (params.source && params.target && params.sourceHandle && params.targetHandle) {
      // Basic validation: prevent self-connections
      if (params.source === params.target) {
        console.warn('❌ Cannot connect node to itself');
        alert('❌ Cannot connect a node to itself.\n\nTip: Connect nodes in sequence to create a flow.');
        return;
      }

      // Check if connection already exists
      const existingConnection = storeConnections.find(conn =>
        conn.source === params.source &&
        conn.sourceHandle === params.sourceHandle &&
        conn.target === params.target &&
        conn.targetHandle === params.targetHandle
      );
      if (existingConnection) {
        console.warn('❌ Connection already exists');
        alert('❌ This connection already exists.\n\nTip: Each connection can only be made once.');
        return;
      }

      // Get node templates for type validation
      const sourceNode = storeNodes.find(n => n.id === params.source);
      const targetNode = storeNodes.find(n => n.id === params.target);

      if (sourceNode && targetNode) {
        const sourceTemplate = getNodeTemplate(sourceNode.type);
        const targetTemplate = getNodeTemplate(targetNode.type);

        if (sourceTemplate && targetTemplate) {
          const sourceOutput = sourceTemplate.outputs.find(o => o.id === params.sourceHandle);
          const targetInput = targetTemplate.inputs.find(i => i.id === params.targetHandle);

          if (sourceOutput && targetInput) {
            // Validate type compatibility
            const isCompatible = validateConnectionTypes(sourceOutput.type, targetInput.type);
            if (!isCompatible) {
              const flowTypes = {
                execution: 'Execution Flow (green)',
                number: 'Number Data (blue)',
                array: 'Array Data (blue)',
                boolean: 'Boolean Data (blue)',
                any: 'Any Data (blue)'
              };
              alert(`❌ Cannot connect ${flowTypes[sourceOutput.type as keyof typeof flowTypes] || sourceOutput.type} to ${flowTypes[targetInput.type as keyof typeof flowTypes] || targetInput.type}.\n\n💡 Connection Rules:\n• Execution flows (green) only connect to execution flows\n• Data flows (blue) connect to matching data types\n• Use 'any' type for flexible connections`);
              return;
            }
          }
        }
      }

      // Prevent multiple execution connections from the same source handle or to the same target handle
      const isExecutionSource = params.sourceHandle.startsWith('exec');
      const isExecutionTarget = params.targetHandle.startsWith('exec');
      if (isExecutionSource) {
        const hasSourceConflict = storeConnections.some(conn =>
          conn.source === params.source && conn.sourceHandle === params.sourceHandle
        );
        if (hasSourceConflict) {
          alert('❌ Only one connection is allowed from this execution output.\n\n💡 Tip: Each execution step can only lead to one next step.');
          return;
        }
      }
      if (isExecutionTarget) {
        const hasTargetConflict = storeConnections.some(conn =>
          conn.target === params.target && conn.targetHandle === params.targetHandle
        );
        if (hasTargetConflict) {
          alert('❌ Only one connection is allowed to this execution input.\n\n💡 Tip: Each execution step can only have one previous step.');
          return;
        }
      }

      console.log('✅ Creating connection');
      addConnection({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      });
    }
  }, [addConnection, storeConnections, storeNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type as any, position);
    },
    [reactFlowInstance, addNode]
  );

  const { elements } = useArrayStore();
  const { setSteps, setAlgorithmType, setDataStructure } = useAlgorithmStore();

  const createArrayIterationExample = useCallback(() => {
    // Clear existing nodes
    clearAll();

    // Create nodes for array iteration example
    const startNode = {
      id: 'start-example',
      type: 'start' as NodeType,
      position: { x: 100, y: 200 }
    };

    const loopNode = {
      id: 'loop-example',
      type: 'for-loop' as NodeType,
      position: { x: 300, y: 200 }
    };

    const arrayAccessNode = {
      id: 'access-example',
      type: 'array-access' as NodeType,
      position: { x: 500, y: 200 }
    };

    const endNode = {
      id: 'end-example',
      type: 'end' as NodeType,
      position: { x: 700, y: 200 }
    };

    // Add nodes
    addNode(startNode.type, startNode.position);
    setTimeout(() => addNode(loopNode.type, loopNode.position), 100);
    setTimeout(() => addNode(arrayAccessNode.type, arrayAccessNode.position), 200);
    setTimeout(() => addNode(endNode.type, endNode.position), 300);

    // Add connections after nodes are created
    setTimeout(() => {
      const nodes = useVisualScriptingStore.getState().nodes;
      const startId = nodes.find(n => n.type === 'start')?.id;
      const loopId = nodes.find(n => n.type === 'for-loop')?.id;
      const accessId = nodes.find(n => n.type === 'array-access')?.id;
      const endId = nodes.find(n => n.type === 'end')?.id;

      if (startId && loopId && accessId && endId) {
        // Execution flow connections
        addConnection({
          source: startId,
          sourceHandle: 'exec-out',
          target: loopId,
          targetHandle: 'exec-in'
        });

        addConnection({
          source: loopId,
          sourceHandle: 'exec-out',
          target: accessId,
          targetHandle: 'exec-in'
        });

        addConnection({
          source: loopId,
          sourceHandle: 'exec-complete',
          target: endId,
          targetHandle: 'exec-in'
        });

        // Data flow connection
        addConnection({
          source: loopId,
          sourceHandle: 'index-out',
          target: accessId,
          targetHandle: 'index-in'
        });

        // Update loop settings
        updateNode(loopId, {
          loopStart: 0,
          loopEnd: elements.length || 5,
          loopVariable: 'i'
        });
      }
    }, 500);

    setShowArrayGuide(false);
  }, [addNode, addConnection, updateNode, clearAll, elements.length]);

  const handleValidateAndCompile = () => {
    const validation = validateScript();
    console.log('🔍 Script validation result:', validation);
    console.log('📊 Current array elements:', elements);
    console.log('🔗 Store nodes:', storeNodes);
    console.log('🔗 Store connections:', storeConnections);

    if (validation.isValid) {
      // Execute the algorithm with current array data
      import('@/lib/visualScriptingInterpreter').then(({ VisualScriptingInterpreter }) => {
        console.log('🚀 Starting visual script execution...');
        const interpreter = new VisualScriptingInterpreter(storeNodes, storeConnections, elements);
        const steps = interpreter.execute();

        console.log('✅ Generated steps:', steps);
        console.log('📝 Step details:');
        steps.forEach((step, index) => {
          console.log(`  Step ${index + 1}:`, {
            description: step.description,
            action: step.action,
            highlightedElements: step.highlightedElements,
            dataStructureState: step.dataStructureState,
            metadata: step.metadata
          });
        });

        // Update the main algorithm store
        console.log('🎯 Setting algorithm type to customVisualScript...');
        setAlgorithmType('customVisualScript');
        setDataStructure('array'); // Ensure array visualization is used

        console.log('🎯 Setting steps in algorithm store...');
        setSteps(steps);

        // Verify the steps were set correctly
        setTimeout(() => {
          const currentState = useAlgorithmStore.getState();
          console.log('🔍 Algorithm store state after setting steps:', {
            algorithmType: currentState.algorithmType,
            dataStructure: currentState.dataStructure,
            stepsCount: currentState.steps.length,
            currentStep: currentState.currentStep
          });
        }, 200);

        console.log('🎯 Algorithm store updated with steps');
        alert(`Algorithm executed successfully! Generated ${steps.length} steps. Check console for details.`);
      }).catch(error => {
        console.error('❌ Error executing visual script:', error);
        alert('Error executing visual script: ' + error.message);
      });
    } else {
      console.error('❌ Validation errors:', validation.errors);
      alert('Script has errors:\n' + validation.errors.join('\n'));
    }
  };

  const handleSave = () => {
    saveAlgorithm();
    alert('Algorithm saved successfully!');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all nodes?')) {
      clearAll();
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white flex overflow-hidden">
      {/* Node Palette */}
      {showNodePalette && (
        <div className="w-64 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
          <NodePalette />
        </div>
      )}

      {/* Main Editor Area - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar with horizontal scrolling */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {/* Left side controls */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleNodePalette}
                className="text-gray-300 hover:text-white whitespace-nowrap"
              >
                {showNodePalette ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showNodePalette ? 'Hide' : 'Show'} Palette
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebuggerModal(true)}
                className={`whitespace-nowrap ${
                  (!currentValidation.isValid || currentValidation.warnings.length > 0)
                    ? 'text-red-400 hover:text-red-300 animate-pulse'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Bug className="w-4 h-4 mr-1" />
                Debugger
                {(!currentValidation.isValid || currentValidation.warnings.length > 0) && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {currentValidation.errors.length + currentValidation.warnings.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Help controls */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(true)}
                className="text-purple-400 hover:text-purple-300 whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Tutorial
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArrayGuide(true)}
                className="text-blue-400 hover:text-blue-300 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Array Guide
              </Button>
            </div>

            {/* Action controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleValidateAndCompile}
                className="text-green-400 hover:text-green-300 whitespace-nowrap"
              >
                <Play className="w-4 h-4 mr-1" />
                Run
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-blue-400 hover:text-blue-300 whitespace-nowrap"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300 whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-900"
              style={{ backgroundColor: '#111827' }}
              connectionLineStyle={{
                stroke: connectionState.isConnecting ? '#22C55E' : '#9CA3AF',
                strokeWidth: connectionState.isConnecting ? 3 : 2,
                strokeDasharray: connectionState.isConnecting ? '5,5' : 'none'
              }}
              connectionLineType={'smoothstep' as any}
              snapToGrid={true}
              snapGrid={[20, 20]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.5}
              maxZoom={2}
            >
              <Controls className="bg-gray-800 border-gray-600" />
              <Background color="#374151" gap={20} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Array Iteration Guide */}
      {showArrayGuide && (
        <ArrayIterationGuide
          onClose={() => setShowArrayGuide(false)}
          onCreateExample={createArrayIterationExample}
        />
      )}

      {/* Connection Status */}
      <ConnectionStatus
        isConnecting={connectionState.isConnecting}
        sourceNode={connectionState.sourceNode}
        sourceHandle={connectionState.sourceHandle}
        sourceType={connectionState.sourceType}
      />

      {/* Debugger Modal */}
      <DebuggerModal
        isOpen={showDebuggerModal}
        onClose={() => setShowDebuggerModal(false)}
        validation={currentValidation}
        onOpenGuide={() => setShowArrayGuide(true)}
        onCreateExample={createArrayIterationExample}
      />
    </div>
  );
};

export default VisualScriptingEditor;
