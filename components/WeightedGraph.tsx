/* eslint-disable @typescript-eslint/no-unused-vars */
// components/WeightedTree.tsx
import { Line } from '@react-three/drei';
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
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

   // Keep track of visited nodes to avoid cycles
   const visited = new Set<number>();
  
   const renderGraph = (node: WeightedTreeNodeType, parentPos?: Vector3) => {
    if (visited.has(node.value)) {
      return null;
    }
    visited.add(node.value);

    const currentPos = new Vector3(node.x, node.y, 0);
    const isActive = steps[currentStep]?.value === node.value;
    const isActiveEdge = isActive && parentPos && steps[currentStep - 1]?.value === node.parentValue;
  
    return (
      <group key={node.value}>
        <WeightedTreeNode 
          node={node} 
          position={currentPos} 
          isActive={isActive} 
        />
  
        {/* Render edge to parent if exists */}
        {parentPos && (
          <Line
            points={[parentPos, currentPos]}
            color={isActiveEdge ? "#ef4444" : "gray"}
            lineWidth={isActiveEdge ? 4 : 2}
          />
        )}
  
        {/* Render all connected edges */}
        {Object.entries(node.edges).map(([direction, edge]) => {
          if (edge && edge.node) {
            return renderGraph(edge.node, currentPos);
          }
          return null;
        })}
      </group>
    );
  };
  
  const render = () => {
    if (!weightedTree) return null;
    visited.clear(); // Reset visited set before each render
    return renderGraph(weightedTree);
  };

  return render();
};

export default WeightedTree;