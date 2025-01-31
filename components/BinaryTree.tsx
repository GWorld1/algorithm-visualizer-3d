import { Line } from '@react-three/drei';
import  TreeNode  from './TreeNode';
import { TreeNode as TreeNodeType } from '@/types/Treenode';
import { calculateTreeLayout } from '@/lib/TreeLayout';
import { sampleTree } from '@/data/sampleTree';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

const BinaryTree = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Center camera on root node
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  const positionedTree = calculateTreeLayout(sampleTree);

  
  const renderTree = (node: TreeNodeType, parentPos?: Vector3) => {
    const currentPos = new Vector3(node.x, node.y, 0);

    return (
      <group key={node.value}>
        {/* Render current node */}
        <TreeNode node={node} position={currentPos} />

        {/* Draw line to parent */}
        {parentPos && (
          <Line
            points={[parentPos, currentPos]}
            color="gray"
            lineWidth={2}
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