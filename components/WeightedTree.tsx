// components/WeightedTree.tsx
import { Line } from '@react-three/drei';
import WeightedTreeNode from './WeightedTreeNode';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedTreeNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';

const WeightedTree = () => {
  const { camera } = useThree();
  const { currentStep, steps, weightedTree } = useAlgorithmStore();
  
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  const renderTree = (node: WeightedTreeNodeType, parentPos?: Vector3) => {
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
  
        {parentPos && (
          <>
            <Line
              points={[parentPos, currentPos]}
              color={isActiveEdge ? "#ef4444" : "gray"}
              lineWidth={isActiveEdge ? 4 : 2}
            />
          </>
        )}
  
        {node.edges.left && renderTree(node.edges.left.node, currentPos)}
        {node.edges.right && renderTree(node.edges.right.node, currentPos)}
      </group>
    );
  };
  
  return weightedTree ? renderTree(weightedTree) : null;
};

export default WeightedTree;