import { Line, Text } from '@react-three/drei';
import WeightedTreeNode from './WeightedGraphNode';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedGraphNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { DijkstraStep } from '@/lib/graphAlgorithms';

const WeightedGraph = () => {

  const { currentStep, steps, weightedTree, algorithmType } = useAlgorithmStore();
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const isDijkstra = algorithmType === 'dijkstra';
  const currentDijkstraStep = isDijkstra ? steps[currentStep] as unknown as DijkstraStep : null;
  
  const isNodeInCurrentPath = (nodeValue: number): boolean => {
    if (!currentDijkstraStep) return false;
    const currentNode = currentDijkstraStep.currentNode;
    const path = currentDijkstraStep.paths.get(currentNode.value);
    return path?.includes(nodeValue) ?? false;
  };
  
  const isEdgeInCurrentPath = (node1Value: number, node2Value: number): boolean => {
    if (!currentDijkstraStep) return false;
    const currentNode = currentDijkstraStep.currentNode;
    const path = currentDijkstraStep.paths.get(currentNode.value);
    if (!path) return false;
    
    // Check if these nodes are adjacent in the path
    const index1 = path.indexOf(node1Value);
    const index2 = path.indexOf(node2Value);
    return index1 !== -1 && index2 !== -1 && Math.abs(index1 - index2) === 1;
  };

  const renderGraph = () => {
    if (!weightedTree) return null;
    
    const nodes = new Map<number, WeightedTreeNodeType>();
    const edges = new Set<string>();
    
    const collectNodes = (node: WeightedTreeNodeType, visited: Set<number> = new Set()) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);
      nodes.set(node.value, node);
      
      Object.values(node.edges).forEach(edge => {
        if (!edge.node) return;
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
          
          const isInPath = isEdgeInCurrentPath(node1Value, node2Value);
          
          const edge = Object.values(node1.edges).find(e => e.node.value === node2Value);
          const weight = edge?.weight ?? 1;
          
          const midPoint = new Vector3(
            ((node1.x ?? 0) + (node2.x ?? 0)) / 2,
            ((node1.y ?? 0) + (node2.y ?? 0)) / 2,
            ((node1.z ?? 0) + (node2.z ?? 0)) / 2
          );
          
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
              <group position={midPoint.toArray()}>
                <mesh scale={[0.3, 0.3, 0.3]}>
                  <sphereGeometry />
                  <meshStandardMaterial color={isInPath ? "#22c55e" : "white"} />
                </mesh>
                <group position={[0, 0.4, 0]}>
                  <Text
                    fontSize={0.3}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    quaternion={camera.quaternion}
                  >
                    {weight}
                  </Text>
                </group>
              </group>
            </group>
          );
        })}

        {/* Render Nodes */}
        {Array.from(nodes.values()).map(node => {
          const isInPath = isNodeInCurrentPath(node.value);
          const distance = currentDijkstraStep?.distances.get(node.value);
          
          return (
            <WeightedTreeNode
              key={node.value}
              node={node}
              position={new Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0)}
              isActive={isInPath}
              distance={distance}
            />
          );
        })}
      </group>
    );
  };

  return renderGraph();
};

export default WeightedGraph;
