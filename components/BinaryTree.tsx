import { Line } from '@react-three/drei';
import  TreeNode  from './TreeNode';
import { TreeNode as TreeNodeType } from '@/types/Treenode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
const BinaryTree = () => {
  const { camera } = useThree();
  const { currentStep,steps,tree } = useAlgorithmStore();
  
  useEffect(() => {
    // Center camera on root node
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  const positionedTree = tree;

  
  const renderTree = (node: TreeNodeType, parentPos?: Vector3) => {
    const currentPos = new Vector3(node.x, node.y, 0);
    const isActive = steps[currentStep]?.value === node.value;
    
    // Check if this is the edge being traversed
    const isActiveEdge = isActive && parentPos && steps[currentStep - 1]?.value === node.parentValue;
  
    return (
      <group key={node.value}>
        {/* Render current node */}
        <TreeNode isActive={isActive} node={node} position={currentPos} />
  
        {/* Draw line to parent */}
        {parentPos && (
          <Line
            points={[parentPos, currentPos]}
            color={isActiveEdge ? "#ef4444" : "gray"} // Red when active, gray otherwise
            lineWidth={isActiveEdge ? 4 : 2} // Thicker when active
          />
        )}
  
        {/* Recursively render children */}
        {node.left && renderTree(node.left, currentPos)}
        {node.right && renderTree(node.right, currentPos)}
      </group>
    );
  };
  
  return renderTree(positionedTree);
};

export default BinaryTree;