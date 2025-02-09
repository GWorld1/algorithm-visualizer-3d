// components/WeightedTree.tsx
import { Line,Text } from '@react-three/drei';
import WeightedTreeNode from './WeightedGraphNode';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedGraphNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';

const WeightedTree = () => {
  const { currentStep, steps, weightedTree } = useAlgorithmStore();
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Collect all nodes and edges first to avoid duplicate rendering
  const collectNodesAndEdges = (root: WeightedTreeNodeType) => {
    const nodes = new Map<number, WeightedTreeNodeType>();
    const edges = new Set<string>();
    
    const traverse = (node: WeightedTreeNodeType) => {
      if (nodes.has(node.value)) return;
      
      nodes.set(node.value, node);
      
      Object.values(node.edges).forEach(edge => {
        if (!edge.node) return;
        
        // Create a unique identifier for each edge
        const edgeId = [node.value, edge.node.value].sort().join('-');
        if (!edges.has(edgeId)) {
          edges.add(edgeId);
        }
        
        traverse(edge.node);
      });
    };
    
    if (root) {
      traverse(root);
    }
    
    return { nodes, edges };
  };

  const renderGraph = () => {
    if (!weightedTree) return null;
    
    const { nodes, edges } = collectNodesAndEdges(weightedTree);
    
    return (
      <group>
        {/* Render Edges First */}
        {Array.from(edges).map(edgeId => {
          const [node1Value, node2Value] = edgeId.split('-').map(Number);
          const node1 = nodes.get(node1Value)!;
          const node2 = nodes.get(node2Value)!;
          
          const isActive = (
            steps[currentStep]?.value === node1Value && 
            steps[currentStep - 1]?.value === node2Value
          ) || (
            steps[currentStep]?.value === node2Value && 
            steps[currentStep - 1]?.value === node1Value
          );

          // Find the edge weight
          const edge = Object.values(node1.edges).find(e => e.node.value === node2Value);
          const weight = edge?.weight ?? 1;
          
          return (
            <group key={edgeId}>
              <Line
                points={[
                  new Vector3(node1.x ?? 0, node1.y ?? 0, 0),
                  new Vector3(node2.x ?? 0, node2.y ?? 0, 0)
                ]}
                color={isActive ? "#ef4444" : "gray"}
                lineWidth={isActive ? 4 : 2}
              />
              {/* Edge weight label positioned at midpoint */}
              <group position={[
                ((node1.x ?? 0) + (node2.x ?? 0)) / 2,
                ((node1.y ?? 0) + (node2.y ?? 0)) / 2,
                0
              ]}>
                <mesh scale={[0.3, 0.3, 0.3]}>
                  <sphereGeometry />
                  <meshStandardMaterial color="white" />
                </mesh>
                <group position={[0, 0.4, 0]}>
                  <WeightLabel weight={weight} />
                </group>
              </group>
            </group>
          );
        })}

        {/* Render Nodes */}
        {Array.from(nodes.values()).map(node => {
          const isActive = steps[currentStep]?.value === node.value;
          return (
            <WeightedTreeNode
              key={node.value}
              node={node}
              position={new Vector3(node.x ?? 0, node.y ?? 0, 0)}
              isActive={isActive}
            />
          );
        })}
      </group>
    );
  };

  return renderGraph();
};

// Helper component for weight labels
const WeightLabel = ({ weight }: { weight: number }) => {
  return (
    <mesh>
      <Text
        fontSize={0.3}
        position={[0, 0, 0]}
        color="black"
      >
        {weight}
      </Text>
      <meshStandardMaterial color="black" />
    </mesh>
  );
};

export default WeightedTree;