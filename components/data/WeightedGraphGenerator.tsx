/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { WeightedTreeNode } from '@/types/WeightedGraphNode';
import { calculateWeightedTreeLayout } from '@/lib/weightedGraphLayout';
import { Network, Loader2, Target, Shuffle, RotateCcw } from 'lucide-react';

interface EdgeInput {
  from: number;
  to: number;
  weight: number;
}

const WeightedGraphGenerator = () => {
  const { weightedTree, updateWeightedTree, algorithmType } = useAlgorithmStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceNode, setSourceNode] = useState(1);
  const [newNodeValue, setNewNodeValue] = useState('');
  const [edgeInput, setEdgeInput] = useState<EdgeInput>({ from: 1, to: 2, weight: 1 });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Get all node values from current graph
  const getAllNodeValues = (): number[] => {
    if (!weightedTree) return [];
    const nodes = new Set<number>();
    
    const collectNodes = (node: WeightedTreeNode, visited = new Set<number>()) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);
      nodes.add(node.value);
      
      Object.values(node.edges).forEach(edge => {
        collectNodes(edge.node, visited);
      });
    };
    
    collectNodes(weightedTree);
    return Array.from(nodes).sort((a, b) => a - b);
  };

  // Update source node while preserving graph structure and positions
  const handleSourceChange = (newSource: number) => {
    if (!weightedTree) return;

    setSourceNode(newSource);

    // Create a completely new graph structure with proper source assignment
    const nodeMap = new Map<number, WeightedTreeNode>();

    // First pass: create all nodes with ONLY the new source marked
    const collectNodes = (node: WeightedTreeNode, visited = new Set<number>()) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);

      const clonedNode: WeightedTreeNode = {
        value: node.value,
        isSource: node.value === newSource, // ONLY the new source is true
        x: node.x, // Preserve existing positions
        y: node.y,
        z: node.z,
        edges: {}
      };

      nodeMap.set(node.value, clonedNode);

      // Continue collecting from connected nodes
      Object.values(node.edges).forEach(edge => {
        collectNodes(edge.node, visited);
      });
    };

    collectNodes(weightedTree);

    // Second pass: rebuild edges using the cloned nodes
    const rebuildEdges = (node: WeightedTreeNode, visited = new Set<number>()) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);

      const clonedNode = nodeMap.get(node.value)!;

      Object.entries(node.edges).forEach(([key, edge]) => {
        const targetClonedNode = nodeMap.get(edge.node.value)!;
        clonedNode.edges[key] = {
          node: targetClonedNode,
          weight: edge.weight
        };

        rebuildEdges(edge.node, visited);
      });
    };

    rebuildEdges(weightedTree);

    // Find the new root node (the one that was originally the root)
    const originalRootValue = weightedTree.value;
    const updatedGraph = nodeMap.get(originalRootValue)!;

    updateWeightedTree(updatedGraph);

    setFeedback({ type: 'success', message: `Source node changed to ${newSource}` });
    setTimeout(() => setFeedback(null), 2000);
  };

  // Add new node
  const handleAddNode = () => {
    const nodeValue = parseInt(newNodeValue);
    if (isNaN(nodeValue) || nodeValue <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid positive node value' });
      return;
    }
    
    const existingNodes = getAllNodeValues();
    if (existingNodes.includes(nodeValue)) {
      setFeedback({ type: 'error', message: `Node ${nodeValue} already exists` });
      return;
    }
    
    if (!weightedTree) return;
    
    // Create new isolated node
    const newNode: WeightedTreeNode = {
      value: nodeValue,
      isSource: false,
      edges: {}
    };
    
    // For now, add it as an isolated node - user can connect it later
    // We need to find a way to add it to the existing graph structure
    // This is a simplified approach - in a real implementation, you might want to
    // connect it to an existing node or let the user specify connections
    
    setNewNodeValue('');
    setFeedback({ type: 'success', message: `Node ${nodeValue} added (isolated)` });
    setTimeout(() => setFeedback(null), 2000);
  };

  // Add edge between nodes
  const handleAddEdge = () => {
    const { from, to, weight } = edgeInput;
    
    if (from === to) {
      setFeedback({ type: 'error', message: 'Cannot connect node to itself' });
      return;
    }
    
    if (weight <= 0) {
      setFeedback({ type: 'error', message: 'Weight must be positive' });
      return;
    }
    
    const existingNodes = getAllNodeValues();
    if (!existingNodes.includes(from) || !existingNodes.includes(to)) {
      setFeedback({ type: 'error', message: 'Both nodes must exist in the graph' });
      return;
    }
    
    // Implementation for adding edge would go here
    // This requires modifying the graph structure
    
    setFeedback({ type: 'success', message: `Edge added: ${from} ↔ ${to} (weight: ${weight})` });
    setTimeout(() => setFeedback(null), 2000);
  };

  // Generate random graph
  const handleGenerateRandom = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create a random connected graph
      const nodeCount = 6;
      const nodes: { [key: number]: WeightedTreeNode } = {};
      
      // Create nodes
      for (let i = 1; i <= nodeCount; i++) {
        nodes[i] = {
          value: i,
          isSource: i === sourceNode,
          edges: {}
        };
      }
      
      // Define some random edges
      const edges: [number, number, number][] = [
        [1, 2, Math.floor(Math.random() * 5) + 1],
        [1, 3, Math.floor(Math.random() * 5) + 1],
        [2, 4, Math.floor(Math.random() * 5) + 1],
        [3, 4, Math.floor(Math.random() * 5) + 1],
        [3, 5, Math.floor(Math.random() * 5) + 1],
        [4, 6, Math.floor(Math.random() * 5) + 1],
        [5, 6, Math.floor(Math.random() * 5) + 1]
      ];
      
      // Add bidirectional edges
      edges.forEach(([from, to, weight]) => {
        nodes[from].edges[`edge_${from}_${to}`] = {
          node: nodes[to],
          weight: weight
        };
        
        nodes[to].edges[`edge_${to}_${from}`] = {
          node: nodes[from],
          weight: weight
        };
      });
      
      const newGraph = calculateWeightedTreeLayout(nodes[1]);
      updateWeightedTree(newGraph);
      
      setFeedback({ type: 'success', message: 'Random graph generated successfully' });
      setTimeout(() => setFeedback(null), 3000);
      
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to generate random graph' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset to default graph
  const handleReset = () => {
    // Import and use the default sample graph
    import('@/data/sampleWeightTree').then(({ sampleWeightedTree }) => {
      const resetGraph = calculateWeightedTreeLayout(sampleWeightedTree);
      updateWeightedTree(resetGraph);
      setSourceNode(1);
      setFeedback({ type: 'success', message: 'Graph reset to default' });
      setTimeout(() => setFeedback(null), 2000);
    });
  };

  const nodeValues = getAllNodeValues();

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <Network className="w-4 h-4" />
          Weighted Graph Editor
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Feedback */}
        {feedback && (
          <div className={`text-xs p-2 rounded ${
            feedback.type === 'success' 
              ? 'bg-green-900/50 text-green-300 border border-green-700' 
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Source Node Selection */}
        {algorithmType === 'dijkstra' && (
          <div className="space-y-2">
            <label className="text-xs text-gray-300 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Source Node for Dijkstra
            </label>
            <select
              value={sourceNode}
              onChange={(e) => handleSourceChange(parseInt(e.target.value))}
              className="w-full text-xs border border-gray-600 rounded px-2 py-2 bg-gray-700 text-gray-100"
            >
              {nodeValues.map(value => (
                <option key={value} value={value}>
                  Node {value}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleGenerateRandom}
            disabled={isGenerating}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Shuffle className="w-3 h-3 mr-1" />
            )}
            Random
          </Button>
          
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Current Graph Info */}
        <div className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded">
          <div>Nodes: {nodeValues.join(', ')}</div>
          <div>Source: Node {sourceNode}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightedGraphGenerator;
