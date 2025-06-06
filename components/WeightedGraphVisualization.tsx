import { Line, Text } from '@react-three/drei';
import WeightedTreeNode from './WeightedGraphNode';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedGraphNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { DijkstraStep } from '@/lib/graphAlgorithms';

const WeightedTree = () => {
  const { currentStep, steps, weightedTree, algorithmType } = useAlgorithmStore();
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const isDijkstra = algorithmType === 'dijkstra';
  const currentDijkstraStep = isDijkstra && steps[currentStep] ? (steps[currentStep] as unknown) as DijkstraStep : null;

  const isNodeInShortestPath = (nodeValue: number): boolean => {
    if (!currentDijkstraStep) return false;

    // A node is in the shortest path tree if:
    // 1. It has a finite distance (has been reached)
    // 2. It has been visited (not in unvisited set)
    const distance = currentDijkstraStep.distances.get(nodeValue);
    const isReached = distance !== undefined && distance < Infinity;
    const isVisited = !currentDijkstraStep.unvisited.has(nodeValue);

    return isReached && isVisited;
  };

  const isEdgeInShortestPath = (node1Value: number, node2Value: number): boolean => {
    if (!currentDijkstraStep) return false;

    // An edge is in the shortest path tree if both nodes are visited and
    // the edge is part of the shortest path to one of the nodes
    const node1Visited = !currentDijkstraStep.unvisited.has(node1Value);
    const node2Visited = !currentDijkstraStep.unvisited.has(node2Value);

    if (!node1Visited || !node2Visited) return false;

    // Check if this edge is part of any shortest path
    for (const [targetNode, path] of currentDijkstraStep.paths.entries()) {
      if (path.length < 2) continue;

      // Check if these nodes are consecutive in this specific path
      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        if ((current === node1Value && next === node2Value) ||
            (current === node2Value && next === node1Value)) {
          return true;
        }
      }
    }
    return false;
  };

  const isCurrentlyBeingProcessed = (nodeValue: number): boolean => {
    if (!currentDijkstraStep) return false;
    return currentDijkstraStep.currentNode.value === nodeValue;
  };

  const isVisited = (nodeValue: number): boolean => {
    if (!currentDijkstraStep) return false;
    return !currentDijkstraStep.unvisited.has(nodeValue);
  };

  const getNodeDistance = (nodeValue: number): number | undefined => {
    return currentDijkstraStep?.distances.get(nodeValue);
  };

  const renderGraph = () => {
    if (!weightedTree) return null;
    
    const nodes = new Map<number, WeightedTreeNodeType>();
    const edges = new Set<string>();
    
    const collectNodes = (node: WeightedTreeNodeType, visited = new Set<number>()) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);
      nodes.set(node.value, node);
      
      Object.values(node.edges).forEach(edge => {
        const edgeId = [node.value, edge.node.value].sort().join('-');
        edges.add(edgeId);
        collectNodes(edge.node, visited);
      });
    };
    
    collectNodes(weightedTree);
    
    return (
      <group>
        {/* Render Edges */}
        {Array.from(edges).map(edgeId => {
          const [node1Value, node2Value] = edgeId.split('-').map(Number);
          const node1 = nodes.get(node1Value)!;
          const node2 = nodes.get(node2Value)!;
          const edge = Object.values(node1.edges).find(e => e.node.value === node2Value);
          
          const isInPath = isEdgeInShortestPath(node1Value, node2Value);
          const weight = edge?.weight ?? 1;
          
          return (
            <group key={edgeId}>
              <Line
                points={[
                  new Vector3(node1.x ?? 0, node1.y ?? 0, node1.z ?? 0),
                  new Vector3(node2.x ?? 0, node2.y ?? 0, node2.z ?? 0)
                ]}
                color={isInPath ? "#22c55e" : "gray"}
                lineWidth={isInPath ? 4 : 2}
              />
              <group position={[
                ((node1.x ?? 0) + (node2.x ?? 0)) / 2,
                ((node1.y ?? 0) + (node2.y ?? 0)) / 2,
                ((node1.z ?? 0) + (node2.z ?? 0)) / 2
              ]}>
                <Text
                  fontSize={0.3}
                  color={isInPath ? "#22c55e" : "black"}
                  anchorX="center"
                  anchorY="middle"
                >
                  {weight}
                </Text>
              </group>
            </group>
          );
        })}

        {/* Render Nodes */}
        {Array.from(nodes.values()).map(node => {
          const nodeValue = node.value;
          const isCurrentNode = isCurrentlyBeingProcessed(nodeValue);
          const isInShortestPath = isNodeInShortestPath(nodeValue);
          const nodeIsVisited = isVisited(nodeValue);

          return (
            <WeightedTreeNode
              key={node.value}
              node={node}
              position={new Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0)}
              isActive={isInShortestPath && !isCurrentNode}
              distance={getNodeDistance(node.value)}
              isCurrentNode={isCurrentNode}
            />
          );
        })}
      </group>
    );
  };

  return renderGraph();
};

export default WeightedTree;