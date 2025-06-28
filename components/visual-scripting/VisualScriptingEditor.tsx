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
import { ScriptNode } from '@/types/VisualScripting';
import NodePalette from './NodePalette';
import CustomNode from './CustomNode';
import TutorialOverlay from './TutorialOverlay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Save, Trash2, Eye, EyeOff, HelpCircle } from 'lucide-react';

// Custom node types for React Flow
const nodeTypes = {
  customNode: CustomNode,
};

const VisualScriptingEditor: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [showTutorial, setShowTutorial] = React.useState(false);

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

  // Convert store nodes to React Flow nodes
  const reactFlowNodes: Node[] = storeNodes.map(node => ({
    id: node.id,
    type: 'customNode',
    position: node.position,
    data: {
      ...node.data,
      nodeType: node.type,
      isSelected: selectedNode === node.id,
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

  const onConnect: OnConnect = useCallback((params: Connection) => {
    console.log('🔗 Attempting to connect:', params);

    if (params.source && params.target && params.sourceHandle && params.targetHandle) {
      // Basic validation: prevent self-connections
      if (params.source === params.target) {
        console.warn('❌ Cannot connect node to itself');
        alert('Cannot connect a node to itself.');
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
        alert('This connection already exists.');
        return;
      }

      // Prevent multiple execution connections from the same source handle or to the same target handle
      // Only for execution-type handles (by convention: handle id starts with 'exec')
      const isExecutionSource = params.sourceHandle.startsWith('exec');
      const isExecutionTarget = params.targetHandle.startsWith('exec');
      if (isExecutionSource) {
        const hasSourceConflict = storeConnections.some(conn =>
          conn.source === params.source && conn.sourceHandle === params.sourceHandle
        );
        if (hasSourceConflict) {
          alert('Only one connection is allowed from this execution output.');
          return;
        }
      }
      if (isExecutionTarget) {
        const hasTargetConflict = storeConnections.some(conn =>
          conn.target === params.target && conn.targetHandle === params.targetHandle
        );
        if (hasTargetConflict) {
          alert('Only one connection is allowed to this execution input.');
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
  }, [addConnection, storeConnections]);

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
    <div className="h-full w-full bg-gray-900 text-white flex">
      {/* Node Palette */}
      {showNodePalette && (
        <div className="w-64 border-r border-gray-700 flex-shrink-0">
          <NodePalette />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNodePalette}
              className="text-gray-300 hover:text-white"
            >
              {showNodePalette ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showNodePalette ? 'Hide' : 'Show'} Palette
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTutorial(true)}
              className="text-purple-400 hover:text-purple-300"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Tutorial
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleValidateAndCompile}
              className="text-green-400 hover:text-green-300"
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-blue-400 hover:text-blue-300"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
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
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-900"
              style={{ backgroundColor: '#111827' }}
              connectionLineStyle={{ stroke: '#9CA3AF', strokeWidth: 2 }}
              connectionLineType="smoothstep"
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
    </div>
  );
};

export default VisualScriptingEditor;
